import build from './build'
import chalk from 'chalk'
import deploy from './deploy'
import scope from './utils/scope'

export default function run(options) {
  scope(options, ({absolutePackagePath, absoluteBuildPath, relativePackagePath}) => {
    console.log()
    console.log(chalk.green.bold(`[Deploy package] ${absolutePackagePath}`))
    build({
      cwd: absolutePackagePath,
      transpile: options.transpile,
    })
    deploy({
      absolutePackagePath,
      absoluteBuildPath,
      relativePackagePath,
      isPackage: true,
    })
    console.log()
  })
}
