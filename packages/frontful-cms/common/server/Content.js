import Client from '../client/Content'
import ContentModel from './models/Content'
import getPreferences from '../common/getPreferences'
import mergeMaps from '../common/mergeMaps'
import Provider from '@frontful/ape-host/common/server/Provider'
import RoleFeatures from './models/RoleFeatures'

const NAME = 'cms'

export default class Content extends Provider {
  groups = null

  load() {
    this.models = {
      content: new ContentModel(this),
      roleFeatures: new RoleFeatures(this),
    }
    return this.models.content.load().then((entries) => {
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
    return this.models.content.update(dbUpdates)
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

  client(req) {
    req.res.locals[NAME] = req.res.locals[NAME] || new Client(req, null, this)
    return req.res.locals[NAME]
  }

  mount(...args) {
    const router = super.mount(...args)
    router.use((req, res, next) => {
      this.client(req)
      next()
    })
    router.use('/api/cms', [
      require('./api/content')(this),
    ])
    return router
  }
}
