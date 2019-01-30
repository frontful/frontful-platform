import {action, observable} from 'mobx'
import {debounce} from 'throttle-debounce'
import {model, formatter} from 'frontful-model'
import Api from '@frontful/viapro-api'
import extend from 'deep-extend'
import getDefaultPreferences from '../common/getDefaultPreferences'
import Provider from './Provider'
import {cookies} from 'frontful-utils'

@model.define(({models, config}) => ({
  $api: models.global(Api),
  $content: config['frontful-cms'].content,
  $req: config['frontful-cms'].req,
}))
@model({
  preferences: formatter.ref(null, getDefaultPreferences()),
})
class Content {
  static LINKED_VALUE = '@linked'
  static GLOBAL_KEY = '$global'
  static MODEL_KEY = '$model'

  constructor() {
    this.cookies = cookies(this.$req)
    this.providers = observable.map()
    this.relations = observable.map()
    this.queue = {
      text: new Map(),
      config: new Map(),
    }
    this.initialize()
    this.updatePreferences()
  }

  initialize() {
    let keys
    if (process.env.IS_BROWSER) {
      if (window.viapro && window.viapro.content) {
        keys = window.viapro.content
      }
      else {
        keys = {}
      }
    }
    else {
      keys = this.$content.resolveKeys(this.$req)
    }
    this.keys = keys instanceof Map ? keys : observable.map(keys)
  }

  @action
  updatePreferences(preferences) {
    const old = this.preferences
    if (preferences || !this.cookies.get('FRONTFUL_CONTENT_PREFERENCES')) {
      const cookie = JSON.stringify(extend(getDefaultPreferences(), this.preferences, preferences))
      this.cookies.set('FRONTFUL_CONTENT_PREFERENCES', cookie, {
        path: '/',
      })
    }
    try {
      this.preferences = JSON.parse(this.cookies.get('FRONTFUL_CONTENT_PREFERENCES'))
    }
    catch (error) {
      this.preferences = getDefaultPreferences()
    }
    const neu = this.preferences

    if (old.text !== neu.text || old.config !== neu.config) {
      this.reload()
    }
  }

  @action
  reload() {
    if (process.env.IS_BROWSER) {
      this.$api.get('/content',).then(action((entries) => {
        this.keys.clear()
        this.keys.merge(entries)
        for (let provider of this.providers.values()) {
          provider.reload()
        }
      }))
    }
  }

  cms(key, mgmt) {
    const content = this
    key = Provider.getKey(key, Content.MODEL_KEY)
    content.register(key, mgmt || 'BLANK', 'null')
    return observable.object({
      get html() {
        return content.providers.get(content.resolveKey(key)).html
      },
      get text() {
        return content.providers.get(content.resolveKey(key)).text
      },
      get model() {
        return content.providers.get(content.resolveKey(key)).model
      }
    })
  }

  uploadQueue = debounce(750, action(() => {
    if (process.env.IS_BROWSER) {
      const update = {
        text: [...this.queue.text],
        config: [...this.queue.config],
      }
      this.$api.post('/content', update).then(() => {
        this.queue.text.clear()
        this.queue.config.clear()
      })
    }
  }))

  @action
  update(key, value) {
    this.keys.set(key, value)
    this.addToQueue(key, value)
  }

  @action
  addToQueue(key, value) {
    const type = this.providers.has(key) ? 'config' : 'text'
    this.queue[type].set(key, value)
    this.uploadQueue()
  }

  @action
  registerResolved(key, mgmt, defaultValue, resolvableKey) {
    let isNew, value
    if (!this.keys.has(key)) {
      value = defaultValue || `"${key}"`
      this.keys.set(key, value)
      isNew = true
    }
    if (mgmt) {
      if (!this.providers.has(key)) {
        this.providers.set(key, new Provider(this, resolvableKey))
      }
      this.providers.get(key).initialise(mgmt !== 'BLANK' ? mgmt : null)
    }
    if (isNew) {
      this.addToQueue(key, value)
    }
  }

  resolveKey(key) {
    key = key.replace(/^[.!]+/gi, '')
    const globalIndex = key.indexOf('!')
    const resolvedKey = key.replace(/!/gi, '.')
    const value = this.keys.get(resolvedKey)
    if (value === Content.LINKED_VALUE && globalIndex !== -1) {
      const globalKey = Content.GLOBAL_KEY + '.' + key.substring(globalIndex + 1)
      return this.resolveKey(globalKey)
    }
    return resolvedKey
  }

  @action
  register(key, mgmt, defaultValue) {
    key = key.replace(/^[.!]+/gi, '')
    const globalIndex = key.indexOf('!')
    const resolvedKey = key.replace(/!/gi, '.')
    if (globalIndex !== -1) {
      const globalKey = Content.GLOBAL_KEY + '.' + key.substring(globalIndex + 1)
      this.register(globalKey, mgmt, defaultValue)
      this.relations.set(resolvedKey, globalKey)
      defaultValue = Content.LINKED_VALUE
    }
    this.registerResolved(resolvedKey, mgmt, defaultValue, key)
  }
}

export default Content
