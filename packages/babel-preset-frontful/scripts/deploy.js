import build from './build'
import Hash from './utils/Hash'
import PackageJSON from './utils/PackageJSON'
import chalk from 'chalk'
import deploy from './utils/deploy'
import fs from 'fs-extra'
import path from 'path'

export default function run(options) {
  options = Object.assign({
    transpile: true,
    folder: null
  }, options)

  let packages = ['.']
  const packagesPath = path.resolve(process.cwd(), options.folder || '.')

  if (options.folder) {
    packages = fs.readdirSync(packagesPath).filter(function(file) {
      return fs.statSync(path.join(packagesPath, file)).isDirectory()
    })
  }

  packages.forEach(function(pkg) {
    const relPath = options.folder ? path.join(options.folder, pkg) : '.'

    console.log()
    console.log(`# # # # # # # # # # # # # # # # # # # # # # # # # #`)
    console.log(`# ${chalk.green.bold(`Deploy for ${pkg}`)}`)
    console.log(`# # # # # # # # # # # # # # # # # # # # # # # # # #`)
    console.log()

    build({
      transpile: options.transpile,
      root: relPath,
    })

    const hash = new Hash(relPath, path.join(relPath, 'build'))

    if (hash.changed()) {
      const sourcePath = path.resolve(process.cwd(), relPath)
      const targetPath = path.resolve(sourcePath, 'build')

      deploy(targetPath)

      const version = new PackageJSON(sourcePath).bump()

      hash.update()

      console.log(chalk.green.bold(`Package deployed as version ${version}`))
    }
    else {
      console.log(chalk.yellow.bold(`Content not changed, deployment canceled`))
    }

    console.log()
  })
}
