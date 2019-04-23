import PropTypes from 'prop-types'
import React from 'react'

class Link extends React.PureComponent {
  static contextTypes = {
    'frontful-router': PropTypes.object
  }

  onClick = (event) => {
    this.context['frontful-router'].push(this.props.href)
    event.preventDefault()
    return false
  }

  render() {
    const {onClick, ...rest} = this.props
    return <a onClick={onClick || this.onClick} {...rest}></a>
  }
}

export {
  Link,
}
