import build from './build'
import deploy from './deploy'

const command = process.argv[2]
const folder = process.argv[3]

switch(command) {
  case 'build': {
    build({
      folder: folder,
    })
    break
  }
  case 'build:frontful': {
    build({
      transpile: false,
      folder: folder,
    })
    break
  }
  case 'deploy': {
    deploy({
      folder: folder,
    })
    break
  }
  case 'deploy:frontful': {
    deploy({
      transpile: false,
      folder: folder,
    })
    break
  }
  default: {
  }
}
