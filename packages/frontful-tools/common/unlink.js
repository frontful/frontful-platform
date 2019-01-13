import scope from './utils/scope'
import {execSync} from 'child_process'

export default function run(options) {
  scope(options, ({absolutePackagePath, relativePackagePath}) => {
    try {
      execSync('yarn unlink', {
        cwd: absolutePackagePath,
        encoding: 'utf8',
        stdio: 'ignore',
      })
      console.log(`Unlinked ${relativePackagePath}`)
    }
    catch (error) {
      console.log(`Not linked ${relativePackagePath}`)
    }
  })
}
