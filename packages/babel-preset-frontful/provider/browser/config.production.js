module.exports = function provider(options) {
  return require('./config.development')(options)
}
