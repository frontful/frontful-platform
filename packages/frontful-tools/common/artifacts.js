import chalk from 'chalk'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import tmp from 'tmp'

const artifactList = [
  'assets/',
  'build/',
  'config/*.rsa',
  'config/*.sha1',
  'config/index.js',
  'config/public.pem',
  'package.json',
  'yarn.lock',
  '.npmrc',
  '.env',
]

export default function artifacts({absolutePackagePath, absoluteBuildPath, relativePackagePath}) {
  const temp = tmp.dirSync({unsafeCleanup: true})
  const tempPath = temp.name
  fs.removeSync(absoluteBuildPath)
  const buildList = glob.sync(`{${artifactList.join(',')}}`, {
    nodir: false,
    cwd: absolutePackagePath,
    mark: true,
    dot: true,
  })
  buildList.forEach((buildItem) => {
    fs.copySync(
      path.resolve(absolutePackagePath, buildItem),
      path.resolve(tempPath, buildItem)
    )
  })
  fs.copySync(tempPath, absoluteBuildPath)
  temp.removeCallback()
  console.log(chalk.green(`[Artifacts generated] ${relativePackagePath}`))
}
