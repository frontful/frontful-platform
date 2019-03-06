import artifacts from './artifacts'
import chalk from 'chalk'
import scope from './utils/scope'

export default function buildApp(options) {
  scope(options, ({absolutePackagePath, absoluteBuildPath, relativePackagePath}) => {
    console.log()
    console.log(chalk.green.bold(`[Build app] ${absolutePackagePath}`))
    artifacts({
      absolutePackagePath,
      absoluteBuildPath,
      relativePackagePath,
    })
    console.log()
  })
}
