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
      stdio: 'inherit',
    })
  }

  console.log(`Clean ${packageName}`)

  exec('rimraf node_modules/** && rimraf node_modules/**')
  exec('rimraf build/** && rimraf build/**' )
  exec('rimraf npm-debug*.* && rimraf npm-debug*.*')
  exec('rimraf yarn-error.* && rimraf yarn-error.*')
  exec('rimraf yarn.lock && rimraf yarn.lock')
})

const exec = function(command) {
  return execSync(command, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: 'inherit',
  })
}

exec('rimraf build/** && rimraf build/**' )
exec('rimraf npm-debug*.* && rimraf npm-debug*.*')
exec('rimraf yarn-error.* && rimraf yarn-error.*')
exec('rimraf yarn.lock && rimraf yarn.lock')
exec('rimraf node_modules/**')
