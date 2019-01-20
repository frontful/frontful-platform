import {action, observable} from 'mobx'
import {model, formatter} from 'frontful-model'
import Api from '@frontful/viapro-api'
import extend from 'deep-extend'
import mgmtText from './mgmt/text'
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
  services = observable.map()
  mapping = observable.map()
  providers = observable.map()

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

  config(prefix, mgmt = mgmtText) {
    if (!this.providers.has(prefix)) {
      this.providers.set(prefix, new Provider(this, prefix, mgmt))
    }
    return this.providers.get(prefix)
  }

  @action
  register(key, mgmt) {
    if (!this.keys.has(key)) {
      this.keys.set(key, `{${key}}`)
    }
    if (!this.mapping.has(key)) {
      this.mapping.set(key, mgmt.name)
    }
    if (!this.services.has(mgmt.name)) {
      this.services.set(mgmt.name, mgmt)
    }
  }
}

export default Content
