import path from 'node:path'
import { ChunkExtractor } from '@loadable/server'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import express, { type RequestHandler } from 'express'

import { DIST_DIR, IS_DEV, SRC_DIR } from 'rspack/constants'
import { IS_RENDER_TO_STREAM, SERVER_PORT } from 'server/constants'
import { csp, nonce, serverRenderer } from 'server/middlewares'

const { PORT = SERVER_PORT } = process.env

const runServer = (hotReload?: () => RequestHandler[]): void => {
  const app = express()
  const statsFile = path.resolve('./dist/stats.json')
  const chunkExtractor = new ChunkExtractor({ statsFile })

  app
    .use(nonce)
    .use(csp)
    .use(express.json())
    .use(compression())
    .use(express.static(path.resolve(DIST_DIR)))
    .use(cookieParser())

  if (IS_DEV) {
    if (hotReload != null) {
      app.get('/*', [...hotReload()])
    }
  } else {
    app.get('/sw.js', (_req, res) => {
      res.sendFile(path.join(SRC_DIR, 'sw.js'))
    })
  }

  app.get('/*', serverRenderer(chunkExtractor))

  app.listen(PORT, () => {
    console.log(
      `App listening on port ${PORT}! (render to ${
        IS_RENDER_TO_STREAM ? 'stream' : 'string'
      })`,
    )
  })
}

if (IS_DEV) {
  ;(async () => {
    const { hotReload, devMiddlewareInstance } = await import(
      './middlewares/hotReload'
    )
    devMiddlewareInstance.waitUntilValid(() => {
      runServer(hotReload)
    })
  })()
    .then(() => {})
    .catch((er) => console.log(er))
} else {
  runServer()
}
