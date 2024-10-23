import path from 'node:path'

import { type Configuration, CssExtractRspackPlugin } from '@rspack/core'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import nodeExternals from 'webpack-node-externals'

import {
  ALIAS,
  DIST_DIR,
  IS_DEV,
  SERVER_BUNDLE_NAME,
  SERVER_SRC_DIR,
} from './constants'
import * as Loaders from './loaders'

const serverConfig: Configuration = {
  name: 'server',
  target: 'node',
  node: { __dirname: false },
  entry: path.join(SERVER_SRC_DIR, '/server'),
  plugins: [new ForkTsCheckerWebpackPlugin(), new CssExtractRspackPlugin()],
  module: {
    rules: Object.values(Loaders).map((el) => el.server),
  },
  output: {
    filename: `${SERVER_BUNDLE_NAME}.js`,
    path: DIST_DIR,
    publicPath: '/',
  },
  devtool: IS_DEV ? 'source-map' : false,
  resolve: {
    alias: ALIAS,
    extensions: ['.ts', '.tsx', '.js'],
  },
  // biome-ignore lint/suspicious/noExplicitAny: Rspack types incompatibility
  externals: [nodeExternals() as any],
}

export { serverConfig }
