import {observer} from 'mobx-react'
import React from 'react'

class Provider {
  constructor(content, prefix, mgmt) {
    this.content = content
    this.prefix = prefix
    this.mgmt = mgmt
    this.model = this.getModel()
  }

  static getKey(prefix, key) {
    if (prefix) {
      return `${prefix}.${key}`
    }
    else {
      return key
    }
  }

  getModel() {
    const key = Provider.getKey(this.prefix, '$model')
    const state = JSON.parse(this.content.keys.get(key) || 'null')
    const model = new this.mgmt.Model(state, this.content.context)
    this.content.register(key, this.mgmt)
    return model
  }

  html = (key, defaultValue) => {
    key = Provider.getKey(this.prefix, key)
    const provider = this
    @observer
    class Component extends React.Component {
      render() {
        return (
          <div className="cnt" dangerouslySetInnerHTML={{
            __html: provider.content.keys.get(key)
          }} />
        )
      }
      UNSAFE_componentWillMount() {
        provider.content.register(key, null, defaultValue)
      }
    }
    return <Component />
  }
}

export default Provider
