import { rspack } from '@rspack/core'
import type { RequestHandler } from 'express'
import devMiddleware from 'webpack-dev-middleware'
import hotMiddleware from 'webpack-hot-middleware'

import { clientConfig as config } from 'rspack/client.config'

const compiler = rspack({ ...config, mode: 'development' })

// biome-ignore lint/suspicious/noExplicitAny: Rspack types incompatibility
export const devMiddlewareInstance = devMiddleware(compiler as any, {
  serverSideRender: true,
  /*
  Setting writeToDisk to true leads to ERR_INVALID_ARG_TYPE error ("data" is undefined)
  with rspack, but it works ok with webpack)
  */
  writeToDisk: false,
  publicPath:
    config.output?.publicPath != null ? String(config.output.publicPath) : '/',
})

export function hotReload(): RequestHandler[] {
  // biome-ignore lint/suspicious/noExplicitAny: Rspack types incompatibility
  return [devMiddlewareInstance, hotMiddleware(compiler as any)]
}

export default hotReload
