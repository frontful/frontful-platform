import {model, formatter} from 'frontful-model'
import Content from './Content'
import {computed, action, untracked} from 'mobx'
import objectPath from 'object-path'
import React from 'react'
import Manager from '../services/manager'

@model.define(({models}) => ({
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
        const model = new provider.mgmt.Model(provider.model.serialize(), this.context)
        managers[key] = (
          <Manager
            model={model}
            View={provider.mgmt.Component}
            save={() => provider.model.deserialize(model.serialize())}
          />
        )
      }
    }
    // console.log(managers)
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
    if (this.content.keys.get(key) === ':resolve') {
      this.content.keys.set(key, this.content.keys.get(this.content.resolveKey(key)))
    }
    else {
      this.content.keys.set(key, ':resolve')
    }
  })
}

export default Editor
