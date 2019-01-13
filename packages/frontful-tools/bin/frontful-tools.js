#!/usr/bin/env node
process.env.NODE_ENV = 'production'
require('babel-register')(require('babel-preset-frontful/config/server'))
require('../common/cli.js')
