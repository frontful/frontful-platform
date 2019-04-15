import {computed, action} from 'mobx'

class Field {
  constructor(provider) {
    this.provider = provider
  }

  @action
  onChange = (event) => {
    if (event.target.type === 'checkbox') {
      this.value = event.target.checked
    }
    else {
      this.value = event.target.value
    }
  }

  @computed
  get value() {
    return this.provider.get()
  }

  set value(value) {
    this.provider.set(value)
  }

  toProps() {
    return {
      onChange: this.onChange,
      value: this.value,
    }
  }
}

export default Field
