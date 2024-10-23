import {
  buildCreateApi,
  coreModule,
  createApi,
  fetchBaseQuery,
  reactHooksModule,
} from '@reduxjs/toolkit/query/react'

import { isServer } from 'utils'

interface TPokemonData {
  name: string
  sprite: string
}

let createApiFunction = createApi

/*
For data prefetching during SSR we need to use a modified createApi function.
You can remove this modification if you do not need this api to be used on the server.
*/
if (isServer) {
  createApiFunction = buildCreateApi(
    coreModule(),
    // eslint-disable-next-line camelcase
    reactHooksModule({ unstable__sideEffectsInRender: true }),
  )
}

export const pokemonApi = createApiFunction({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getPokemonSpriteById: builder.query<TPokemonData, number>({
      query: (id) => `pokemon/${id}`,
      // biome-ignore lint/suspicious/noExplicitAny: This should be type from API
      transformResponse: (response: any) => ({
        name: response.species.name,
        sprite: response.sprites.other.dream_world.front_default,
      }),
    }),
  }),
})
