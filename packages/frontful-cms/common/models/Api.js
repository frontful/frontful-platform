import {dao} from 'frontful-dao'

const NAME = 'cms'

@dao.define(() => ({}))
@dao(({config}) => ({
  url: config[NAME].params.host + '/api',
  mode: 'cors',
  credentials: 'include',
}))
class Api {
}

export default Api
