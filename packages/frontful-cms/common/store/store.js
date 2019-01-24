import config from 'frontful-config/server'
import Store from 'frontful-store-sql/common/Store'

const store = new Store('frontful-content', config.connection['frontful-content'])

export default store
