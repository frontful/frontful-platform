const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

const execSync = childProcess.execSync
const allPackageSource = path.resolve(process.cwd(), './packages')

const packageNames = fs.readdirSync(allPackageSource).filter(function(file) {
  return fs.statSync(path.join(allPackageSource, file)).isDirectory()
})

packageNames.forEach(function(packageName) {
  const exec = function(command) {
    return execSync(command, {
      cwd: path.resolve(allPackageSource, packageName),
      encoding: 'utf8',
      stdio: 'ignore',
    })
  }

  try {
    exec('yarn unlink')
    console.log(`Unlinked ${packageName}`)
  }
  catch {
    console.log(`Not linked ${packageName}`)
  }
})
