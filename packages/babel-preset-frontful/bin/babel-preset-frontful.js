#!/usr/bin/env node
process.env.NODE_ENV = 'production'

require('babel-register')(require('../config/package'))

require('../scripts/execute')
