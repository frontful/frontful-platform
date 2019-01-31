import PropTypes from 'prop-types'
import React from 'react'
import {manager} from './Manager'

class Style extends React.Component {
  UNSAFE_componentWillMount() {
    this.initialize()
  }

  initialize = () => {
    this.session = this.props.session || manager.getSession()

    if (process.env.IS_BROWSER) {
      manager.setRerenderHandler(this.rerender)
    }

    if (this.props.globalStyle) {
      this.style = this.session.getInstance(this.props.globalStyle)
    }
  }

  rerender = () => {
    this.rootElement = React.cloneElement(this.rootElement, {
      key: Math.random(),
    })
    this.initialize()
    this.forceUpdate()
  }

  static childContextTypes = {
    'style.manager.session': PropTypes.any
  }

  getChildContext() {
    return {
      'style.manager.session': this.session
    }
  }

  render() {
    this.rootElement = this.rootElement || React.Children.only(this.props.children)
    return this.rootElement
  }

  componentWillUnmount() {
    if (this.props.globalStyle && this.style) {
      this.style.dispose()
    }
  }
}

export {
  Style,
}
