import PropTypes from 'prop-types'
import React from 'react'
import {Style} from './Style.jsx'
import {isBrowser} from 'frontful-utils'
import {manager} from './Manager'

function style(definition) {
  return style.bind(definition)
}

style.manager = manager

style.bind = function (definition) {
  if (definition._styleDecorated) {
    return definition
  }
  else if (definition.default && definition.default._styleDecorated) {
    return definition.default
  }

  let style = manager.createStyle(definition)

  function decorator (Component) {
    class StyleComponent extends React.Component {
      static contextTypes = {
        'style.manager.session': PropTypes.any
      }

      UNSAFE_componentWillMount() {
        this.style = this.context['style.manager.session'].getInstance(style)
        if (super.UNSAFE_componentWillMount) {
          super.UNSAFE_componentWillMount.apply(this, arguments)
        }
      }

      render() {
        if (isBrowser()) {
          this.style.clearConfiguration()
        }
        return (
          <Component {...this.props} style={this.style}/>
        )
      }

      componentDidMount() {
        if (isBrowser()) {
          this.style.applyConfiguration()
        }
        if (super.componentDidMount) {
          super.componentDidMount.apply(this, arguments)
        }
      }

      componentDidUpdate() {
        if (isBrowser()) {
          if (this.style.configurations.length > 0) {
            this.style.applyConfiguration()
          }
        }
        if (super.componentDidUpdate) {
          super.componentDidUpdate.apply(this, arguments)
        }
      }

      componentWillUnmount() {
        if (super.componentWillUnmount) {
          super.componentWillUnmount.apply(this, arguments)
        }
        this.style.dispose()
        // setTimeout(() => {
        //   this.style.dispose()
        // })
      }
    }

    // StyleComponent.__component__ = Component

    return Object.assign(StyleComponent, Component)
  }

  decorator.with = function(...args) {
    style = style.with(...args)
    return decorator
  }

  decorator._styleDecorated = true

  return decorator
}

const reset = manager.reset

const rerender = () => {
  style.manager.rerender()
}

export {
  Style,
  reset,
  rerender,
  style,
}
