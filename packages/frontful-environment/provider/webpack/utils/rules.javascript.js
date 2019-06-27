const commonConfig = require('frontful-common/config')

module.exports = function rules(options) {
  return [
    {
      enforce: 'pre',
      test: /\.jsx?.svg$/,
      loader: require.resolve('./reactSvgLoader'),
    },
    {
      test: /\.jsx?(\.svg)?$/,
      exclude: new RegExp(`node_modules(\\\\|\\/)(?!(${commonConfig.packages.join('|')})(\\\\|\\/))`),
      loader: 'babel-loader',
      options: Object.assign({}, options.babel, {
        cacheDirectory: options.cache,
      }),
    },
    {
      test: /\.tsx?$/,
      exclude: new RegExp(`node_modules(\\\\|\\/)(?!(${commonConfig.packages.join('|')})(\\\\|\\/))`),
      use: [
        {
          loader: 'babel-loader',
          options: Object.assign({}, options.babel, {
            cacheDirectory: options.cache,
          }),
        },
        {
          loader: 'ts-loader',
          options: {
            context: process.cwd(),
            compilerOptions: {
              allowSyntheticDefaultImports: true,
              jsx: 'preserve',
              target: 'ES6',
              sourceMap: true,
            },
          },
        },
      ],
    },
  ]
}
