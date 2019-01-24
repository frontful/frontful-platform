import Store from 'frontful-store-sql/common/Store'
import config from 'frontful-config/server'

const store = new Store('frontful-content', config.connection['frontful-content'])

export default store
