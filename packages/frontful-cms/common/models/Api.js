import {dao} from 'frontful-dao'

const GLOBAL_NAME = 'frontful-cms'
const GLOBAL_NAME_HOST = 'ape-host'

@dao.define(() => ({}))
@dao(({config}) => ({
  url: config[GLOBAL_NAME].params.host + '/api',
  // headers: {
  //   'environment-key': config[GLOBAL_NAME].params.isHosted ? config[GLOBAL_NAME_HOST].params.session.key : config[GLOBAL_NAME].params.key,
  // },
  credentials: 'include',
}))
class Api {
}

export default Api
