import {model} from 'frontful-model'
import Content from './Content'
import {computed} from 'mobx'
import objectPath from 'object-path'

@model.define(({models}) => ({
  content: models.global(Content),
}))
@model({
})
class Manager {
  @computed
  get json() {
    const json = {}
    for (let key of this.content.mapping) {
      objectPath.set(json, key, this.content.keys.get(key))
    }
    return json
  }
}

export default Manager
