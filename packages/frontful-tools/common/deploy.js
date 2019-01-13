import Hash from './utils/Hash'
import PackageJson from './utils/Package.json'
import build from './build'
import chalk from 'chalk'
import scope from './utils/scope'
import {execSync} from 'child_process'

export default function run(options) {
  scope(options, ({absolutePackagePath, absoluteBuildPath, relativePackagePath}) => {
    console.log()
    console.log(`# # # # # # # # # # # # # # # # # # # # # # # # # #`)
    console.log(`# ${chalk.green.bold(`Deploy for ${relativePackagePath}`)}`)
    console.log(`# # # # # # # # # # # # # # # # # # # # # # # # # #`)
    console.log()
    build({
      cwd: absolutePackagePath,
      transpile: options.transpile,
    })
    const hash = new Hash(absolutePackagePath, absoluteBuildPath)
    if (hash.changed()) {
      const buildPackageJson = new PackageJson(absoluteBuildPath)
      buildPackageJson.unlock()
      buildPackageJson.bump()
      execSync(`npm publish "${absoluteBuildPath}"`, {
        cwd: absolutePackagePath,
        encoding: 'utf8',
        stdio: 'inherit'
      })
      buildPackageJson.lock()
      const version = new PackageJson(absolutePackagePath).bump()
      hash.update()
      console.log(chalk.green.bold(`Package deployed as version ${version}`))
    }
    else {
      console.log(chalk.yellow.bold(`Content not changed, deployment canceled`))
    }
    console.log()
  })
}
