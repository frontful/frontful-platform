import content from './mounts/content'
import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import mergeMaps from '../common/mergeMaps'
import getPreferences from '../common/getPreferences'

export default class Content {
  groups = new Map()
  
  updateKeys(groups, updates) {
    updates = new Map(updates)
    const names = groups.split('|')
    for (let i = 0, l = names.length - 1; i <= l; i++) {
      const name = names[i]
      let keys = this.groups.get(name)
      if (!keys) {
        keys = new Map()
        this.groups.set(name, keys)
      }
    }
    for (let i = 0, l = names.length - 1; i <= l; i++) {
      const name = names[i]
      let keys = this.groups.get(name)
      for (let [key, value] of updates) {
        const isUpdate = this.groups.get(names[l]).has(key)
        if (!isUpdate && i !== l) {
        }
        else {
          keys.set(key, value)
          updates.delete(key)
        }
      }
    }
  }

  resolveKeys(arg) {
    if (typeof arg === 'object') {
      const req = arg
      const preferences = getPreferences(req)
      return mergeMaps([
        this.resolveKeys(preferences.text),
        this.resolveKeys(preferences.config),
      ])
    }
    else {
      const groups = arg
      const names = groups.split('|')
      const blank = new Map()
      return mergeMaps(names.map((name) => this.groups.get(name) || blank))
    }
  }

  getScript(req) {
    return `<script>${this.getScriptContent(req)}</script>`
  }

  getScriptContent(req) {
    return `window.frontful = window.frontful || {}; window.frontful.content = ${JSON.stringify([...this.resolveKeys(req)])};`
  }

  get url() {
    return '/api/content/script.js'
  }

  mount() {
    const app = express()
    app.use('/content', [
      bodyParser.json(),
      cookieParser(),
      content(this),
    ])
    return app
  }
}
