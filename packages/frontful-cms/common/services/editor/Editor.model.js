import {computed, action, untracked} from 'mobx'
import {model, formatter} from 'frontful-model'
import Content from '../../models/Content'
import mgmtEditor from './mgmt'
import objectPath from 'object-path'

@model.define(({models}) => ({
  cms: models.global(Content).cms('content!editor', mgmtEditor),
  content: models.global(Content),
}))
@model({
  expanded: formatter.map(),
  filter: '',
})
class Editor {
  @computed
  get json() {
    const json = {}
    const filter = this.filter.toLowerCase()
    for (let key of this.content.keys.keys()) {
      if (!this.cms.model.showGlobal && key.indexOf('global.') === 0) {
        continue
      }
      if (this.content.providers.has(key) && !this.content.providers.get(key).mgmt) {
        continue
      }
      const value = untracked(() => this.content.keys.get(key).toLowerCase())
      if (!filter || value.toLowerCase().includes(filter) || key.toLowerCase().includes(filter)) {
        objectPath.set(json, key, {
          $editor: {},
        })
      }
    }
    return json
  }

  @computed
  get managers() {
    const managers = {}
    for (let [key, provider] of this.content.providers) {
      if (provider.mgmt) {
        managers[key] = provider.getManager().element
      }
    }
    return managers
  }

  toggle = action((key) => {
    if (this.expanded.has(key)) {
      this.expanded.delete(key)
    }
    else {
      this.expanded.set(key, true)
    }
  })

  toggleLink = action((key) => {
    let value = ':resolve'
    if (this.content.keys.get(key) === value) {
      value = this.content.keys.get(this.content.resolveKey(key))
    }
    this.content.keys.set(key, value)
    this.content.addToQueue(key, value)
  })
}

export default Editor
