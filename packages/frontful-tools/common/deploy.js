import Hash from './utils/Hash'
import PackageJson from './utils/Package.json'
import chalk from 'chalk'
import {execSync} from 'child_process'

export default function deploy({absolutePackagePath, absoluteBuildPath, relativePackagePath, isPackage}) {
  const hash = new Hash(absolutePackagePath, absoluteBuildPath)
  if (hash.changed()) {
    const hasChanges = execSync(`git diff-index --quiet HEAD -- . || echo "modified"`, {
      cwd: absolutePackagePath,
      encoding: 'utf8',
    })
    if (hasChanges) {
      console.log(chalk.red(`[Commit required] Commit all changes before deploying`))
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
      console.log(chalk.green(`[Deployed] v${version}`))
      const commitCommand = isPackage ? `git add --all . && git commit -m "Publish ${buildPackageJson.name}@${version}"` : `git commit -a -m "Publish v${version}"`
      const tagCommand = isPackage ? `git tag ${buildPackageJson.name}@${version}` : `git tag -a v${version} -m "v${version}"`
      execSync(`${commitCommand} && ${tagCommand}`, {
        cwd: absolutePackagePath,
        encoding: 'utf8',
        stdio: 'inherit'
      })
    }
  }
  else {
    console.log(chalk.yellow(`[Content not changed] ${relativePackagePath}`))
  }
}
