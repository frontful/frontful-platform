import {execSync} from 'child_process'
import chalk from 'chalk'
import scope from './utils/scope'

const cleanList = [
  'artifacts/',
  'build/',
  'node_modules/',
  'npm-debug.log',
  'stats/',
  'yarn-error.log',
]

export default function run(options) {
  scope(options, ({absolutePackagePath, relativePackagePath}) => {
    execSync(`rimraf {${cleanList.join(',')}}`, {
      cwd: absolutePackagePath,
      encoding: 'utf8',
      stdio: 'ignore',
    })
    console.log(chalk.green(`[Cleaned] ${relativePackagePath}`))
  })
}
