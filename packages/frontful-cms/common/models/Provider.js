import {observer} from 'mobx-react'
import React from 'react'

class Provider {
  constructor(content, prefix, mgmt) {
    this.content = content
    this.prefix = prefix
    this.mgmt = mgmt
    this.model = this.getModel()
  }

  getKey(key) {
    if (this.prefix) {
      return `${this.prefix}.${key}`
    }
    else {
      return key
    }
  }

  getModel() {
    const key = this.getKey('$model')
    const state = JSON.parse(this.content.keys.get(key) || 'null')
    const model = new this.mgmt.Model(state, this.content.context)
    return model
  }

  html = (key) => {
    key = this.getKey(key)
    @observer
    class Component extends React.Component {
      render() {
        return (
          <div className="cnt" dangerouslySetInnerHTML={{
            __html: this.model.hasOwnProperty('text') ? this.model.text : 'N/A'
          }} />
        )
      }
      UNSAFE_componentWillMount() {
        this.content.register(key, this.mgmt)
      }
    }
    return <Component />
  }
}

export default Provider
