import {model} from 'frontful-model'
import Field from 'frontful-field'

@model({
  onTop: false,
})
class Model {
  constructor() {
    this.fields = {
      onTop: new Field({
        get: () => this.onTop,
        set: (value) => {this.onTop = value},
      }),
    }
  }
}

export default Model
