import {model} from 'frontful-model'
import Field from 'frontful-field'

@model({
  autoExpandDepth: 1,
  showGlobal: true,
  language: 'en',
  presets: {
    language: 'default',
    services: 'default',
  },
})
class Model {
  constructor() {
    this.fields = {
      language: new Field({
        get: () => this.language,
        set: (value) => {this.language = value},
      }),
      showGlobal: new Field({
        get: () => this.showGlobal,
        set: (value) => {this.showGlobal = value},
      }),
    }
  }
}

export default Model
