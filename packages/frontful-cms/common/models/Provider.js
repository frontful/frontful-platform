import {observer} from 'mobx-react'
import React from 'react'
import Content from './Content'

class Provider {
  constructor(content, key) {
    this.content = content
    this.prefix = key.replace('.' + Content.MODEL_KEY, '')
    if (key.length === this.prefix.length) {
      throw new Error(`Provider model key must be \`${Content.MODEL_KEY}\``)
    }
    this.key = Provider.getKey(this.prefix, Content.MODEL_KEY)
    this.html.createElement = this.createElement
  }

  reload() {
    if (this.model) {
      const state = JSON.parse(this.resolveValue(this.key))
      this.model = new this.mgmt.Model(state, this.content.context)
      if (this.$manager) {
        this.$manager.model.deserialize(state)
      }
    }
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

  getManager() {
    if (!this.$manager) {
      const model = new this.mgmt.Model(this.model.serialize(), this.model.context)
      this.$manager = this.$manager || {
        model: model,
        element: <this.mgmt.Component model={model} />
      }
    }
    return this.$manager
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
        const value = provider.resolveValue(key)
        return (
          <div className="cnt" style={{
            display: 'inline-block',
            color: value === Content.LINKED_VALUE ? 'red' : 'inherit',
          }} dangerouslySetInnerHTML={{
            __html: value
          }} />
        )
      }
      UNSAFE_componentWillMount() {
        provider.content.register(key, null, defaultValue)
      }
    }
    return <Component />
  }

  createElement = (element, props, key, defaultValue) => {
    key = Provider.getKey(this.prefix, key)
    const provider = this
    @observer
    class Component extends React.Component {
      render() {
        const value = provider.resolveValue(key)
        return React.createElement(element, {
          style: {
            color: value === Content.LINKED_VALUE ? 'red' : 'inherit',
          },
          ...this.props,
          children: value,
        })
      }
      UNSAFE_componentWillMount() {
        provider.content.register(key, null, defaultValue)
      }
    }
    return <Component {...props} />
  }
}

export default Provider
