import Hash from './utils/Hash'
import PackageJson from './utils/Package.json'
import chalk from 'chalk'
import {execSync} from 'child_process'

export default function deploy({absolutePackagePath, absoluteBuildPath, relativePackagePath}) {
  const hash = new Hash(absolutePackagePath, absoluteBuildPath)
  if (hash.changed()) {
    const hasChanges = execSync(`git diff-index --quiet HEAD -- || echo "modified"`, {
      cwd: absolutePackagePath,
      encoding: 'utf8',
    })
    if (hasChanges) {
      console.log(chalk.red.bold(`Commit all changes before deploying`))
    }
    else {
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
      console.log(chalk.green.bold(`Deployed as version ${version}`))
      const packageName = relativePackagePath.replace('./', '').replace('packages/', '').replace(/\/$/gi, '')
      const commitCommand = packageName ? `git add --all . && git commit -m "${packageName}@${version}"` : `git commit -a -m "v${version}"`
      const tagCommand = packageName ? `git tag ${packageName}@${version}` : `git tag -a v${version} -m "v${version}"`
      execSync(`${commitCommand} && ${tagCommand}`, {
        cwd: absolutePackagePath,
        encoding: 'utf8',
        stdio: 'inherit'
      })
    }
  }
  else {
    console.log(chalk.yellow.bold(`Content not changed, deployment canceled`))
  }
}
