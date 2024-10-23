import type { EnhancedStore } from '@reduxjs/toolkit'
import { pokemonApi } from 'api'

const apiRequest = async (
  // biome-ignore lint/suspicious/noExplicitAny: Created for complex sample API
  store: EnhancedStore<any, any, any[]>,
  // biome-ignore lint/suspicious/noExplicitAny: Created for complex sample API
): Promise<any[]> => {
  store.dispatch(pokemonApi.endpoints.getPokemonSpriteById.initiate(1))

  // biome-ignore lint/suspicious/noExplicitAny: Created for complex sample API
  return await Promise.all<any>(
    store.dispatch(pokemonApi.util.getRunningQueriesThunk()),
  )
}

export { apiRequest }
