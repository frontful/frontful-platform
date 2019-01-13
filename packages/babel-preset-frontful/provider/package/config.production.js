const commonConfig = require('frontful-common/config')
const resolve = require('../../utils/resolve')

module.exports = function provider(options) {
  options = Object.assign({
    debug: false,
  }, options)

  return {
    babelrc: false,
    ignore: new RegExp(`node_modules/(?!(${commonConfig.packages.join('|')}))`),
    presets: [
      ['babel-preset-env', {
        targets: {
          browsers: 'last 2 versions',
          node: 6,
        },
        include: [
          'transform-es2015-classes'
        ],
        modules: 'commonjs',
        loose: false,
        useBuiltIns: false,
        debug: options.debug,
      }],
      'babel-preset-react',
    ].map(resolve),
    plugins: [
      'babel-plugin-transform-decorators-legacy',
      'babel-plugin-add-module-exports',
      'babel-plugin-transform-class-properties',
      'babel-plugin-transform-object-assign',
      'babel-plugin-transform-object-rest-spread',
      ['babel-plugin-transform-runtime', {
        helpers: true,
        polyfill: true,
        regenerator: true,
        moduleName: 'babel-runtime',
      }],
    ].map(resolve),
  }
}
