import { getDataFromTree } from '@apollo/react-ssr'
import type { ChunkExtractor } from '@loadable/server'
import type { Request, RequestHandler, Response } from 'express'
import { renderToPipeableStream, renderToString } from 'react-dom/server'
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async'
import { StaticRouter } from 'react-router-dom/server'

import { Provider } from 'react-redux'
import { type RootState, initStore } from 'store/store'

import { THEME_NAMES } from 'constants/commonConstants'
import { ROUTE_CONSTANTS } from 'constants/routeConstants'
import { IS_RENDER_TO_STREAM } from 'server/constants'
import { apiRequest, setTranslations } from 'server/middlewares'
import { getHtmlTemplate } from 'server/template'
import { App } from 'src/App'

const serverRenderer =
  (chunkExtractor: ChunkExtractor): RequestHandler =>
  async (req: Request, res: Response) => {
    const isPageAvailable = Object.values(ROUTE_CONSTANTS).includes(req.path)

    if (!isPageAvailable) {
      req.url = ROUTE_CONSTANTS.NOT_FOUND
    }

    const location: string = req.url

    /*
        Check user accepted languages. If it is different from the default
        set it in the root state initial state including all needed translation.
        As a result rendering will be done with this language.
      */
    const i18nState = await setTranslations(req)

    let preloadedState: Partial<RootState> = {
      counter: { value: 42 },
      theme: {
        theme:
          req.headers['sec-ch-prefers-color-scheme'] === 'dark'
            ? THEME_NAMES.DARK
            : THEME_NAMES.LIGHT,
      },
      ...i18nState,
    }

    const store = initStore(preloadedState)

    /*
        Prefetching with RTK Query:
        - Get data;
        - Put it into the store;
        - Set the store as a preloaded state;
        - Use this store during SSR and for client hydration;
        - Prefetched data will be taken from RTK Query cache in the store.
        Note: Why not just get data during SSR?
        Because rendering will be done before resolving the request Promise.
      */
    await apiRequest(store)
    preloadedState = { ...store.getState() }

    const helmetContext = {}

    /*
        react-helmet-async forgot to export this interface after migrating to TypeScript in v2+.
      */
    interface HelmetDataContext {
      helmet: HelmetServerState
    }

    const jsx = (
      <Provider store={store}>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={location}>
            <App />
          </StaticRouter>
        </HelmetProvider>
      </Provider>
    )

    if (IS_RENDER_TO_STREAM) {
      await getDataFromTree(jsx)

      const { helmet } = helmetContext as HelmetDataContext

      const { header, footer } = getHtmlTemplate({
        preloadedState,
        helmetData: helmet,
        scriptTags: chunkExtractor.getScriptTags({
          nonce: res.locals.cspNonce,
        }),
        styleTags: chunkExtractor.getStyleTags(),
        nonce: res.locals.cspNonce,
        lang: i18nState.i18n.lang,
      })

      res.write(header)
      let didError = false
      const stream = renderToPipeableStream(jsx, {
        onShellReady() {
          res.statusCode = didError ? 500 : 200
          stream.pipe(res)
        },
        onAllReady() {
          res.end(footer)
        },
        onError(err) {
          didError = true
          console.error(err)
        },
      })
    } else {
      const reactHtml = renderToString(jsx)
      const { helmet } = helmetContext as HelmetDataContext

      const { header, footer } = getHtmlTemplate({
        preloadedState,
        helmetData: helmet,
        scriptTags: chunkExtractor.getScriptTags(),
        styleTags: chunkExtractor.getStyleTags(),
        nonce: res.locals.cspNonce,
      })

      res.send(header + reactHtml + footer)
    }
  }

export { serverRenderer }
