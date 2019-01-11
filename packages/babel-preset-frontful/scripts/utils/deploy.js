import PackageJSON from './PackageJSON'
import {execSync} from 'child_process'

export default function deploy(sourcePath) {
  const packageJSON = new PackageJSON(sourcePath)

  packageJSON.unlock()
  packageJSON.bump()

  const result = execSync(`npm publish "${sourcePath}"`, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: 'inherit'
  })

  packageJSON.lock()

  return result
}
