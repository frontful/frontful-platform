import {action, observable, computed} from 'mobx'
import {model, formatter} from 'frontful-model'
import Api from '@frontful/viapro-api'
import extend from 'deep-extend'
import Provider from './Provider';

function getDefaultPreferences() {
  return {
    language: 'en',
    presets: {
      language: 'default',
      services: 'default',
    },
  }
}

@model.define(({models, config}) => ({
  api: models.global(Api),
  cookies: config['frontful-cms'].cookies,
}))
@model({
  preferences: formatter.ref(null, getDefaultPreferences()),
})
class Content {
  keys = observable.map()
  providers = observable.map()
  relations = observable.map()

  constructor() {
    this.updatePreferences()
  }

  resolve() {
    return Promise.resolve({
      preferences: this.preferences
    }).then(action(() => {
      this.keys.replace({})
    }))
  }

  @action
  updatePreferences(preferences) {
    if (preferences || !this.cookies.get('FRONTFUL_CONTENT_PREFERENCES')) {
      const cookie = JSON.stringify(extend(getDefaultPreferences(), preferences))
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
  }

  resolveKey(key) {
    key = key.replace(/!/gi, '.').replace(/^[.!]+/gi, '')
    const value = this.keys.get(key)
    if (value === ':resolve' && this.relations.has(key)) {
      return this.resolveKey(this.relations.get(key))
    }
    return key
  }

  cms(key, mgmt) {
    const content = this
    key = Provider.getKey(key, Provider.sufix)
    content.register(key, mgmt || 'BLANK', 'null')
    return observable.object({
      get html() {
        return content.providers.get(content.resolveKey(key)).html
      },
      get model() {
        return content.providers.get(content.resolveKey(key)).model
      }
    })
  }


  @action
  registerResolved(key, mgmt, defaultValue, globalCandidate) {
    if (!this.keys.has(key)) {
      this.keys.set(key, defaultValue || `"${key}"`)
    }
    if (mgmt) {
      if (!this.providers.has(key)) {
        this.providers.set(key, new Provider(this, key, globalCandidate))
      }
      this.providers.get(key).initialise(mgmt !== 'BLANK' ? mgmt : null)
    }
  }

  @action
  register(key, mgmt, defaultValue) {
    let globalCandidate = key
    let globalIndex = globalCandidate.indexOf('!')
    const resolvedKey = key.replace(/^[.!]+/gi, '').replace(/!/gi, '.')
    let child = resolvedKey
    while (globalIndex !== -1) {
      const globalKey = 'global.' + globalCandidate.substring(globalIndex + 1)
      const resolvedKey = globalKey.replace(/!/gi, '.')
      globalCandidate = globalCandidate.substring(0, globalIndex) + '.' + globalCandidate.substring(globalIndex + 1, globalCandidate.length)
      globalIndex = globalCandidate.indexOf('!')
      if (globalIndex === -1) {
        this.registerResolved(resolvedKey, mgmt, defaultValue, key)
        defaultValue = ':resolve'
      }
      else {
        this.registerResolved(resolvedKey, mgmt, ':resolve', key)
      }
      this.relations.set(child, resolvedKey)
      child = resolvedKey
    }
    this.registerResolved(resolvedKey, mgmt, defaultValue, key)
  }
}

export default Content
