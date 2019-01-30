import {action} from 'mobx'
import {model} from 'frontful-model'

@model({
  expanded: false,
})
class Panel {
  toggle = action((event) => {
    if (event.ctrlKey && event.shiftKey && event.keyCode === 69) {
      this.expanded = !this.expanded
    }
  })
}

export default Panel
