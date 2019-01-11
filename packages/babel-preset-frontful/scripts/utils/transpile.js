import fs from 'fs'
import find from 'find'
import babelOptions from '../../config/package'
import config from '../../config'

const babel = require('babel-core')

export default function transpile(transpilePath) {
  const sourceFiles = find.fileSync(new RegExp(`^((?!((/node_modules)${config.ignore ? `|(${config.ignore})` : '' })).)*(\\.jsx?)$`, 'i'), transpilePath)

  sourceFiles.forEach(function(sourceFile) {
    const sourceCode = fs.readFileSync(sourceFile, 'utf8')
    const compiled = babel.transform(sourceCode, babelOptions)
    fs.writeFileSync(sourceFile, compiled.code)
  })
}
