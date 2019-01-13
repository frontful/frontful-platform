import scope from './utils/scope'
import {execSync} from 'child_process'

export default function run(options) {
  scope(options, ({absolutePackagePath}) => {
    execSync(`frontful-tools --help`, {
      cwd: absolutePackagePath,
      encoding: 'utf8',
      stdio: 'inherit',
    })
  })
}
