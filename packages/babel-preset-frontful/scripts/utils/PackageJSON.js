import path from 'path'
import fs from 'fs'

export default class PackageJSON {
  constructor(rootPath) {
    this.filePath = path.resolve(rootPath, 'package.json')
  }

  lock() {
    var content = fs.readFileSync(this.filePath, 'utf8')
    content = content.replace(`"private": false`, `"private": true`)
    fs.writeFileSync(this.filePath, content)
  }

  unlock() {
    var content = fs.readFileSync(this.filePath, 'utf8')
    content = content.replace(`"private": true`, `"private": false`)
    fs.writeFileSync(this.filePath, content)
  }

  bump() {
    var content = fs.readFileSync(this.filePath, 'utf8')

    let version = content.match(/"version": "(.+)"/i)[1]
    const arr = version.split('.').map((part) => parseInt(part, 10))
    version = `${arr[0]}.${arr[1]}.${arr[2] + 1}`

    content = content.replace(/"version": ".+"/i, `"version": "${version}"`)

    fs.writeFileSync(this.filePath, content)

    return version
  }
}
