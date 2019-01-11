const defaultConfig = require('./index.default')
const providerPackage = require('frontful-config/provider/package')
const objectPath = require('object-path')

const customConfig = objectPath(providerPackage('frontful.babel') || {})

const mergedConfig = {
  ignore: customConfig.get('ignore'),
  server: (
    customConfig.get('server.config') ||
    require('../provider/server')(
      Object.assign({}, defaultConfig.server.options, customConfig.get('server.options'))
    )
  ),
  browser: (
    customConfig.get('browser.config') ||
    require('../provider/browser')(
      Object.assign({}, defaultConfig.browser.options, customConfig.get('browser.options'))
    )
  ),
  package: (
    customConfig.get('package.config') ||
    require('../provider/package')(
      Object.assign({}, defaultConfig.package.options, customConfig.get('package.options'))
    )
  ),
}

module.exports = mergedConfig
