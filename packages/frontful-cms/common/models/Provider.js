import {observer} from 'mobx-react'
import React from 'react'

class Provider {
  static sufix = '$model'

  constructor(content, key, globalCandidate) {
    this.content = content
    this.key = key
    this.prefix = globalCandidate.replace(Provider.sufix, '')
  }

  initialise(mgmt) {
    if (!this.mgmt && mgmt) {
      this.mgmt = mgmt
      const state = JSON.parse(this.resolveValue(this.key))
      this.model = new this.mgmt.Model(state, this.content.context)
    }
    else {
      if (mgmt && this.mgmt !== mgmt) {
        throw new Error('Content provider `mgmt` object mismatch')
      }
    }
  }

  static getKey(prefix, key) {
    if (prefix) {
      key = `${prefix}.${key}`
    }
    return key.replace(/[.!]{0,}![.!]{0,}/gi, '!').replace(/\.+(?=\.)|!+(?=!)/gi, '')
  }

  resolveValue(key) { 
    return this.content.keys.get(this.content.resolveKey(key))
  }

  html = (key, defaultValue) => {
    key = Provider.getKey(this.prefix, key)
    const provider = this
    @observer
    class Component extends React.Component {
      render() {
        return (
          <div className="cnt" dangerouslySetInnerHTML={{
            __html: provider.resolveValue(key)
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
