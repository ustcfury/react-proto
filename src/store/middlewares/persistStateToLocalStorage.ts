/*
  Simple but yet powerful persist middleware.
  Runs after every event in Redux, so be sure to filter unnecessary slices.
    (For example, in SSR version first async RTK Query actions are run before
      you can execute state rehydration. Without filtering API slice, these actions
      pull server state to local storage rewriting persist data)
  For a more precise data persisting use listener middlewares.
    (You can find a typed empty template in listener.ts file)
*/
import type { Action, Middleware } from 'redux'

import { localStorageAppKey } from 'constants/commonConstants'
import type { RootState } from 'store/store'

const isAction = (action: unknown): action is Action => {
  return (action as Action).type !== undefined
}

const persistStateToLocalStorage =
  (
    ignoreSlices?: Array<keyof RootState>,
    ignoreSliceActions = true,
  ): Middleware<unknown, RootState> =>
  (store) =>
  (next) =>
  (action) => {
    const result = next(action)
    if (ignoreSlices !== undefined) {
      if (
        isAction(action) &&
        ignoreSliceActions &&
        !ignoreSlices.some((el) => action.type.includes(el))
      ) {
        localStorage.setItem(
          localStorageAppKey,
          JSON.stringify(store.getState(), (key, value) => {
            if (ignoreSlices.includes(key as keyof RootState)) {
              return undefined
            }
            return value
          }),
        )
      }
    }

    return result
  }

export { persistStateToLocalStorage }
