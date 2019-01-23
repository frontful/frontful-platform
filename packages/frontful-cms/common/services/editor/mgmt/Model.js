import {model} from 'frontful-model'
import Field from './Field';

@model({
  autoExpandDepth: 1,
  showFullPath: false,
  showGlobal: true,
  showPageContext: true,
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
      showFullPath: new Field({
        get: () => this.showFullPath,
        set: (value) => {this.showFullPath = value},
      }),
    }
  }
}

export default Model
