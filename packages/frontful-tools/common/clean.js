import scope from './utils/scope'
import {execSync} from 'child_process'

const cleanList = [
  'build/',
  'node_modules/',
  'npm-debug.log',
  'yarn-error.log',
  'yarn.lock',
]

export default function run(options) {
  scope(options, ({absolutePackagePath, relativePackagePath}) => {
    execSync(`rimraf {${cleanList.join(',')}}`, {
      cwd: absolutePackagePath,
      encoding: 'utf8',
      stdio: 'ignore',
    })
    console.log(`Cleaned ${relativePackagePath}`)
  })
}
