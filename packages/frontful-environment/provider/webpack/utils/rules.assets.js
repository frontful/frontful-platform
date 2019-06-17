module.exports = function() {
  return [
    {
      test: /(\.(png|jpe?g|gif|ico)$)|(^((?!\.jsx?).)*\.svg$)/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 1024,
          },
        }
      ],
    },
    // {
    //   test: /\.json$/,
    //   loader: 'json-loader',
    // },
  ]
}
