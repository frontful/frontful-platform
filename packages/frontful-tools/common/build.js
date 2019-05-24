import {transformSync} from '@babel/core'
import babelConfig from 'babel-preset-frontful/config'
import chalk from 'chalk'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import scope from './utils/scope'
import tmp from 'tmp'

const buildExcludeList = [
  '.babelrc',
  '.eslintignore',
  '.eslintrc',
  '.gitignore',
  '.node-version',
  '.npmrc',
  'build/**',
  'node_modules/**',
  'packages/**',
  'platforms/**',
  'projects/**',
  'yarn.lock',
]

export default function build(options) {
  scope(options, ({absolutePackagePath, absoluteBuildPath, relativePackagePath}) => {
    const temp = tmp.dirSync({unsafeCleanup: true})
    const tempPath = temp.name
    fs.removeSync(absoluteBuildPath)
    const buildList = glob.sync('**', {
      nodir: true,
      cwd: absolutePackagePath,
      ignore: buildExcludeList,
      mark: true,
      dot: true,
    })
    buildList.forEach((buildItem) => {
      fs.copySync(
        path.resolve(absolutePackagePath, buildItem),
        path.resolve(tempPath, buildItem)
      )
    })
    fs.copySync(tempPath, absoluteBuildPath)
    temp.removeCallback()
    if (options.transpile) {
      const transformList = glob.sync('{./,**/}{*.js,*.jsx}', {
        ignore: babelConfig.ignore,
        mark: true,
        cwd: absoluteBuildPath,
        dot: true,
      })
      transformList.forEach(function(item) {
        const filePath = path.resolve(absoluteBuildPath, item)
        const sourceCode = fs.readFileSync(filePath, 'utf8')
        const compiled = transformSync(sourceCode, babelConfig.package)
        fs.writeFileSync(filePath, compiled.code)
      })
    }
    console.log(chalk.green(`[Package built] ${relativePackagePath}`))
  })
}
