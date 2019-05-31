import {dao} from 'frontful-dao'

const NAME = 'cms'

@dao.define(() => ({}))
@dao(({config}) => ({
  url: config[NAME].params.host + '/api/cms',
  mode: 'cors',
  credentials: 'include',
  headers: {
    ...(config[NAME].req ? config[NAME].req.headers : null),
  },
}))
class Api {
}

export default Api
