const commonConfig = require('frontful-common/config')
const findWorkspaceRoot = require('find-yarn-workspace-root')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const rulesAssets = require('../utils/rules.assets')
const rulesJavascript = require('../utils/rules.javascript')
const rulesStyles = require('../utils/rules.styles')
const webpack = require('webpack')

module.exports = function provider(options) {
  options = Object.assign({
    babel: require('babel-preset-frontful/server'),
    cache: false,
    index: './src/server/index.js',
    sourceMaps: true,
  }, options)

  const cwd = process.cwd()
  const workspaceRoot = findWorkspaceRoot(cwd)
  const workspaceNodeModules = workspaceRoot ? `${workspaceRoot}/node_modules` : 'node_modules'
  const nodeExternalsWhitelist = commonConfig.packages.concat(['core-js', 'corejs2'])

  return {
    mode: 'production',
    cache: options.cache,
    context: cwd,
    devtool: options.sourceMaps && 'source-map',
    externals: [nodeExternals({
      modulesDir: workspaceNodeModules,
      // includeAbsolutePaths: true,
      whitelist: (module) => {
        return nodeExternalsWhitelist.find((name) => module.includes(name))
      },
    })],
    target: 'node',
    stats: {
      children: false,
    },
    performance: {
      hints: false,
    },
    entry: {
      server: [
        require.resolve('../../../utils/coldreload/server.js'),
        options.index,
      ],
    },
    output: {
      path: path.resolve(cwd, './build/browser/assets/'),
      filename: `../../server/[name].js`,
      publicPath: '/assets/',
      libraryTarget: 'commonjs-module',
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      // devtoolModuleFilenameTemplate: (info) => {
      //   if (info.absoluteResourcePath.includes(cwd)) {
      //     return `${info.absoluteResourcePath}`
      //   }
      //   else {
      //     return `frontful:${info.absoluteResourcePath}`
      //   }
      // },
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: `require('source-map-support').install();`,
        raw: true,
        entryOnly: false,
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: function() {
            return []
          },
        },
      }),
    ],
    module: {
      rules: [].concat(
        rulesJavascript({
          babel: options.babel,
          cache: options.cache,
        }),
        rulesAssets(),
        rulesStyles({
          browser: false
        })
      ),
    },
    resolve: {
      extensions: ['.js', '.ts', '.jsx', '.tsx'],
      mainFields: ['jsnext:main', 'browser', 'main'],
      symlinks: false,
      modules: [
        workspaceNodeModules,
        // workspaceNodeModules || (cwd + '/node_modules'),
        // 'node_modules',
      ],
      alias: commonConfig.alias,
    },
  }
}
