import cn from 'classnames'
import { type FC, type ReactElement, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'

import {
  ErrorBoundary,
  LanguageSelector,
  Offline,
  ThemeSwitcher,
} from 'components'
import { routes } from 'router/Router'

import {
  THEME_NAMES,
  localStorageAppKey,
  reduxHydrationAction,
} from 'constants/commonConstants'
import { type RootState, useAppDispatch, useAppSelector } from 'store/store'
import { switchToDark } from 'store/theme/themeSlice'

import { isServer } from 'utils'

const App: FC = (): ReactElement => {
  const content = useRoutes(routes)
  const currentTheme = useAppSelector((state) => state.theme.theme)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (
      window.__PRELOADED_STATE__?.theme?.theme == null &&
      JSON.parse(localStorage.getItem(localStorageAppKey) as string)?.theme ==
        null &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      dispatch(switchToDark())
    }

    /*
      If it is SSR version, we need to render a server version first
      to avoid "Text content does not match server-rendered HTML" error.
      Then rehydrate all the state with persisted data from local storage.
      Otherwise, check index.tsx file.
     */
    if (
      !isServer &&
      !NO_SSR &&
      localStorage.getItem(localStorageAppKey) != null
    ) {
      const localStoragePersistedState: Partial<RootState> = JSON.parse(
        localStorage.getItem(localStorageAppKey) as string,
      )
      dispatch({
        type: reduxHydrationAction,
        payload: localStoragePersistedState,
      })
    }
  }, [dispatch])

  return (
    <ErrorBoundary>
      <div
        className={cn(
          'app-wrapper',
          currentTheme === THEME_NAMES.DARK && 'theme-dark',
        )}
      >
        <LanguageSelector />
        <ThemeSwitcher />
        <Offline />
        {content}
      </div>
    </ErrorBoundary>
  )
}

export { App }
