const commonConfig = require('frontful-common/config')
const resolve = require('../../utils/resolve')

module.exports = function provider(options) {
  options = Object.assign({
    debug: false,
  }, options)

  return {
    babelrc: false,
    ignore: [
      new RegExp(`node_modules/(?!(${commonConfig.packages.join('|')}))`),
    ],
    presets: [
      ['@babel/preset-env', {
        targets: {
          node: 10,
        },
        include: [
          'transform-classes'
        ],
        modules: 'commonjs',
        loose: false,
        useBuiltIns: false,
        debug: options.debug,
      }],
      '@babel/preset-react',
    ].map(resolve),
    plugins: [
      ['@babel/plugin-proposal-decorators', {
        legacy: true,
      }],
      'babel-plugin-add-module-exports',
      ['@babel/plugin-proposal-class-properties', {
        loose: true,
      }],
      '@babel/plugin-transform-object-assign',
      '@babel/plugin-proposal-object-rest-spread',
      ['@babel/plugin-transform-runtime', {
        helpers: true,
        corejs: 2,
        regenerator: true,
        absoluteRuntime: true,
      }],
    ].map(resolve),
  }
}
