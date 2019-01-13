import glob from 'glob'
import path from 'path'

export default function scope(options, predicate) {
  options = Object.assign({
    cwd: process.cwd(),
    pattern: null,
    transpile: true,
  }, options)
  const packagePathList = glob.sync(options.pattern || './', {
    cwd: options.cwd,
    mark: true,
  })
  packagePathList.forEach(function(relativePackagePath) {
    predicate({
      relativePackagePath: relativePackagePath,
      absolutePackagePath: path.resolve(options.cwd, relativePackagePath),
      absoluteBuildPath: path.resolve(options.cwd, relativePackagePath, 'build'),
    })
  })
}
