import {resolver} from 'frontful-resolver'
import React from 'react'

@resolver((resolve) => {
  resolve(({model, Component}) => ({
    Component: <Component model={model} />,
  }))
})
class Manager extends React.PureComponent {
  render() {
    const {Component} = this.props
    return <Component />
  }
}

export default Manager
