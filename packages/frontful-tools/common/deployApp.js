import artifacts from './artifacts'
import chalk from 'chalk'
import deploy from './deploy'
import scope from './utils/scope'

export default function deployApp(options) {
  scope(options, ({absolutePackagePath, absoluteBuildPath, relativePackagePath}) => {
    console.log()
    console.log(chalk.green.bold(`[Deploy app] ${absolutePackagePath}`))
    artifacts({
      absolutePackagePath,
      absoluteBuildPath,
      relativePackagePath,
    })
    deploy({
      absolutePackagePath,
      absoluteBuildPath,
      relativePackagePath,
    })
    console.log()
  })
}
