import path from 'path'
import fs from 'fs-extra'
import find from 'find'
import crypto from 'crypto'

export default class Hash {
  constructor(sourcePath, buildPath) {
    this.sourcePath = path.resolve(process.cwd(), sourcePath)
    this.basePath = buildPath ? path.resolve(process.cwd(), buildPath) : process.cwd()
    this.value = ''
    this.file = path.resolve(this.basePath, '.hash')
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
    const files = find.fileSync(/^((?!(\/(\.npmrc|\.node-version|\.hash|npm-debug\.log|yarn-error\.log|\.git|node_modules|yarn\.lock)(\/|$))).)*$/i, this.basePath).sort()
    const hash = crypto.createHash('sha1')

    files.forEach((file) => {
      const fileIdentifier = file.replace(this.basePath, '').replace(/\\|\//gi, '>')
      hash.write(fileIdentifier + fs.readFileSync(file, 'utf8'))
    })

    return hash.digest('base64')
  }

  update() {
    this.write(this.generate())
  }

  write(hash) {
    fs.writeFileSync(path.resolve(this.sourcePath, '.hash'), hash)
    this.value = hash
  }
}
