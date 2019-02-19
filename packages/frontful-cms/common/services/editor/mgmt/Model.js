import {model} from 'frontful-model'
import Field from 'frontful-field'
import {action} from 'mobx'
import Content from '../../../models/Content'

@model.define(({models}) => ({
  content: models.global(Content),
}))
@model({
  autoExpandDepth: 0,
  showGlobal: true,
  textGroups: [
    'en',
    'lv|en',
    'ru|lv|en',
  ],
  configGroups: [
    'default',
    'development|default'
  ],
})
class Model {
  constructor() {
    this.fields = {
      showGlobal: new Field({
        get: () => this.showGlobal,
        set: (value) => {this.showGlobal = value},
      }),
      textGroup: new Field({
        get: () => this.content.preferences.text,
        set: (value) => {this.content.updatePreferences({text: value})},
      }),
      configGroup: new Field({
        get: () => this.content.preferences.config,
        set: (value) => {this.content.updatePreferences({config: value})},
      }),
    }
  }

  addGroup = action((type, group) => {
    const groups = this[`${type}Groups`]
    if (!groups.includes(group)) {
      groups.push(group)
    }
  })

  removeGroup = action((type, group) => {
    const groups = this[`${type}Groups`]
    const index = groups.indexOf(group)
    if (index !== -1) {
      groups.splice(index, 1)
    }
  })
}

export default Model
