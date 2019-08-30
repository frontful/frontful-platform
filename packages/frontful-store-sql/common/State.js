import extend from 'deep-extend'

export default class State {
  constructor(state) {
    Object.assign(this, state)
  }

  extend(update) {
    if (update) {
      return extend(this, update)
    }
    else {
      return this
    }
  }

  clear() {
    for (let key in this) {
      if (this.hasOwnProperty(key)) {
        delete this[key]
      }
    }
  }

  toJS() {
    const state = {}
    for (let key in this) {
      if (this.hasOwnProperty(key)) {
        if (typeof this[key] !== 'undefined' && key !== 'store' && key !== 'integrator') {
          state[key] = this[key]
        }
      }
    }
    return state
  }

  save(update) {
    this.extend(update)
  }
}
