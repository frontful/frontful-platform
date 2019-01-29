import {content as contentStore} from '../store'
import bodyParser from 'body-parser'
import contentMount from './mounts/content'
import cookieParser from 'cookie-parser'
import express from 'express'
import getPreferences from '../common/getPreferences'
import mergeMaps from '../common/mergeMaps'

export default class Content {
  groups

  load() {
    return contentStore.load().then((entries) => {
      if (this.groups) {
        this.groups.clear()
      }
      this.groups = entries.reduce((groups, entrie) => {
        let group = groups.get(entrie.group)
        if (!group) {
          group = new Map()
          groups.set(entrie.group, group)
        }
        group.set(entrie.key, entrie.value)
        return groups
      }, new Map())
      return this
    })
  }
  
  updateKeys(groups, updates) {
    updates = new Map(updates)
    const dbUpdates = []
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
          dbUpdates.push({
            group: name,
            key,
            value,
          })
          updates.delete(key)
        }
      }
    }
    return contentStore.update(dbUpdates)
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
    return `window.viapro = window.viapro || {}; window.viapro.content = ${JSON.stringify([...this.resolveKeys(req)])};`
  }

  get url() {
    return '/api/content/script.js'
  }

  isLoaded() {
    return (req, res, next) => {
      if (!this.loaded) {
        this.loaded = this.loaded || this.load()
      }
      this.loaded.then(() => next()).catch(next)
    }
  }

  mount() {
    const app = express()
    app.use('/content', [
      this.isLoaded(),
      bodyParser.json(),
      cookieParser(),
      contentMount(this),
    ])
    return app
  }
}
