import build from './build'
import chalk from 'chalk'
import deploy from './deploy'
import scope from './utils/scope'

export default function run(options) {
  scope(options, ({absolutePackagePath, absoluteBuildPath, relativePackagePath}) => {
    console.log()
    console.log(`# # # # # # # # # # # # # # # # # # # # # # # # # #`)
    console.log(`# ${chalk.green.bold(`Package deploy for ${relativePackagePath}`)}`)
    console.log(`# # # # # # # # # # # # # # # # # # # # # # # # # #`)
    console.log()
    build({
      cwd: absolutePackagePath,
      transpile: options.transpile,
    })
    deploy({
      absolutePackagePath,
      absoluteBuildPath,
      isPackage: true,
    })
    console.log()
  })
}
