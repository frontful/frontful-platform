const MiniCssExtractPlugin = require('mini-css-extract-plugin')

function cssLoader(modules) {
  return {
    loader:`css-loader`,
    options: {
      // modules: modules ? true : false,
      // minimize: false,
      // context: process.cwd(),
      importLoaders: modules ? 1 : 0,
      // localIdentName: process.env.NODE_ENV === 'production' ? '[hash:base64:5]' : '[path]___[name]__[local]___[hash:base64:5]',
      modules: modules ? {
        localIdentName: process.env.NODE_ENV === 'production' ? '[hash:base64:5]' : '[path]___[name]__[local]___[hash:base64:5]',
        context: process.cwd(),
      } : false,
    }
  }
}

function postcssLoader(options) {
  return {
    loader: `postcss-loader`,
    options: Object.assign({
      plugins: [
        require('autoprefixer')({ /* browsers: 'last 4 version' */ })
      ]
    }, options)
  }
}

function miniCssLoader() {
  return {
    loader: MiniCssExtractPlugin.loader,
    options: {
    },
  }
}

module.exports = function(options) {
  return [
    {
      test: new RegExp(`^((?!\\.module).)*\\.css$`),
      use: options.browser ? [
        miniCssLoader(),
        cssLoader(),
        postcssLoader(),
      ] : 'null-loader',
    },
    {
      test: new RegExp(`^((?!\\.module).)*\\.pcss$`),
      use: options.browser ? [
        miniCssLoader(),
        cssLoader(),
        postcssLoader({
          parser: 'postcss-scss'
        }),
      ] : 'null-loader',
    },
    {
      test: new RegExp(`^((?!\\.module).)*\\.scss$`),
      use: options.browser ? [
        miniCssLoader(),
        cssLoader(),
        postcssLoader(),
        `sass-loader`,
      ] : 'null-loader',
    },
    {
      test: new RegExp(`^((?!\\.module).)*\\.sass$`),
      use: options.browser ? [
        miniCssLoader(),
        cssLoader(),
        postcssLoader(),
        `sass-loader?indentedSyntax`,
      ] : 'null-loader',
    },

    // ----- CSS Modules -----

    {
      test: new RegExp(`\\.module\\.css$`),
      use: options.browser ? [
        miniCssLoader(),
        cssLoader(true),
        postcssLoader(),
      ] : [
        require.resolve('./cssModuleMappingLoader.js'),
        cssLoader(true),
        postcssLoader(),
      ]
    },
    {
      test: new RegExp(`\\.module\\.pcss$`),
      use: options.browser ? [
        miniCssLoader(),
        cssLoader(true),
        postcssLoader({
          parser: 'postcss-scss'
        }),
      ] : [
        require.resolve('./cssModuleMappingLoader.js'),
        cssLoader(true),
        postcssLoader({
          parser: 'postcss-scss'
        }),
      ]
    },
    {
      test: new RegExp(`\\.module\\.scss$`),
      use: options.browser ? [
        miniCssLoader(),
        cssLoader(true),
        postcssLoader(),
        `sass-loader`,
      ] : [
        require.resolve('./cssModuleMappingLoader.js'),
        cssLoader(true),
        postcssLoader(),
        `sass-loader`,
      ]
    },
    {
      test: new RegExp(`\\.module\\.sass$`),
      use: options.browser ? [
        miniCssLoader(),
        cssLoader(true),
        postcssLoader(),
        `sass-loader?indentedSyntax`,
      ] : [
        require.resolve('./cssModuleMappingLoader.js'),
        cssLoader(true),
        postcssLoader(),
        `sass-loader?indentedSyntax`,
      ]
    },
  ]
}
