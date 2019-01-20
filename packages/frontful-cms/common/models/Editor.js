import {model, formatter} from 'frontful-model'
import Content from './Content'
import {computed, action} from 'mobx'
import objectPath from 'object-path'
import React from 'react'
import Manager from '../services/manager'

@model.define(({models}) => ({
  content: models.global(Content),
}))
@model({
  expanded: formatter.map(),
})
class Editor {
  @computed
  get json() {
    const json = {}
    for (let key of this.content.keys.keys()) {
      objectPath.set(json, key, {
        $editor: {
          // value: untracked(() => this.content.keys.get(key)),
        },
      })
    }
    return json
  }

  @computed
  get managers() {
    const managers = {}
    for (let [key, provider] of this.content.providers) {
      const model = new provider.mgmt.Model(provider.model.serialize(), this.context)
      managers[key] = (
        <Manager
          model={model}
          Component={provider.mgmt.Component}
          save={() => provider.model.deserialize(model.serialize())}
        />
      )
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
}

export default Editor
