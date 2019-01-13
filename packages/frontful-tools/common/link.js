import scope from './utils/scope'
import {execSync} from 'child_process'

export default function run(options) {
  scope(options, ({absolutePackagePath, relativePackagePath}) => {
    console.log(`Linked ${relativePackagePath}`)
    execSync('yarn link', {
      cwd: absolutePackagePath,
      encoding: 'utf8',
      stdio: 'ignore',
    })
  })
}
