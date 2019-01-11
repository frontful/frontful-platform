module.exports = {
  // Blob pattert for file to be excluded from transpilation
  ignore: null,
  server: {
    // Options that will be passed to `babel-preset-frontful/provider/server`
    options: null,
    // Raw Babel configuration for server
    config: null,
  },
  browser: {
    // Options that will be passed to `babel-preset-frontful/provider/browser`
    options: null,
    // Raw Babel configuration for browser
    config: null,
  },
  package: {
    // Options that will be passed to `babel-preset-frontful/provider/package`
    options: null,
    // Raw Babel configuration for package
    config: null,
  },
}
