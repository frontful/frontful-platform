import crypto from 'crypto'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'

export default class Hash {
  constructor(sourcePath, buildPath) {
    this.sourcePath = sourcePath
    this.buildPath = buildPath
    this.value = ''
    this.file = path.resolve(this.sourcePath, '.hash')
    fs.ensureFileSync(this.file)
    this.read()
  }

  read() {
    this.value = fs.readFileSync(this.file, 'utf8')
    return this.value
  }

  changed() {
    return this.generate() !== this.value
  }

  generate = () => {
    const hash = crypto.createHash('sha1')
    const files = glob.sync('**', {
      cwd: this.buildPath,
      nodir: true,
      dot: true,
      ignore: '.hash',
    })
    files.forEach((relativePath) => {
      const absolutePath = path.resolve(this.buildPath, relativePath)
      hash.write(relativePath + fs.readFileSync(absolutePath, 'utf8'))
    })
    return hash.digest('base64')
  }

  update() {
    this.write(this.generate())
  }

  write(hash) {
    fs.writeFileSync(path.resolve(this.file), hash)
    this.value = hash
  }
}
