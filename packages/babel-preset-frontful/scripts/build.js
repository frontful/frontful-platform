import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import tmp from 'tmp'
import transpile from './utils/transpile'

export default function run(options) {
  options = Object.assign({
    transpile: true,
    folder: null,
    root: '.',
  }, options)

  let packages = [options.root]
  const packagesPath = path.resolve(process.cwd(), options.folder || '.')

  if (options.folder) {
    packages = fs.readdirSync(packagesPath).filter(function(file) {
      return fs.statSync(path.join(packagesPath, file)).isDirectory()
    })
  }

  packages.forEach(function(pkg) {
    const sourcePath = path.resolve(packagesPath, pkg)

    const temp = tmp.dirSync({
      unsafeCleanup: true,
    })

    const tempPath = temp.name
    const targetPath = path.resolve(sourcePath, 'build')

    fs.removeSync(targetPath)

    fs.copySync(sourcePath, tempPath, {
      filter: (filename) => {
        return /^((?!([\\/](\.npmrc|\.node-version|npm-debug\.log|yarn-error\.log|\.git|node_modules|build|yarn\.lock)([\\/]|$))).)*$/i.test(filename)
      },
    })

    fs.copySync(tempPath, targetPath)

    temp.removeCallback()

    if (options.transpile) {
      transpile(targetPath)
    }

    console.log(chalk.green.bold(`Package built (${pkg})`))
  })
}
