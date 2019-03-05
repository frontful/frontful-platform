import artifacts from './artifacts'
import chalk from 'chalk'
import deploy from './deploy'
import scope from './utils/scope'

export default function deployApp(options) {
  scope(options, ({absolutePackagePath, absoluteBuildPath, relativePackagePath}) => {
    console.log()
    console.log(`# # # # # # # # # # # # # # # # # # # # # # # # # #`)
    console.log(`# ${chalk.green.bold(`App deploy for ${relativePackagePath}`)}`)
    console.log(`# # # # # # # # # # # # # # # # # # # # # # # # # #`)
    console.log()
    artifacts({
      absolutePackagePath,
      absoluteBuildPath,
    })
    deploy({
      absolutePackagePath,
      absoluteBuildPath,
      relativePackagePath,
    })
    console.log()
  })
}
