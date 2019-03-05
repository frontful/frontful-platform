import chalk from 'chalk'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import tmp from 'tmp'

const artifactList = [
  'assets/',
  'build/',
  'config/*.js',
  'package.json',
  'yarn.lock',
  '.npmrc',
]

export default function artifacts({absolutePackagePath, absoluteBuildPath}) {
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
  console.log(chalk.green.bold(`App artifacts (${absoluteBuildPath.replace(absolutePackagePath, '')})`))
}
