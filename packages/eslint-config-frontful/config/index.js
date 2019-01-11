const defaultConfig = require('./index.default')
const providerPackage = require('frontful-config/provider/package')
const objectPath = require('object-path')

const customConfig = objectPath(providerPackage('frontful.eslint') || {})

const mergedConfig = customConfig.get('config') || require('../provider')(Object.assign({}, defaultConfig.options, customConfig.get('options')))

module.exports = mergedConfig
