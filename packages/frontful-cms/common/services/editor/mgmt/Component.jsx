import {resolver} from 'frontful-resolver'
import {style} from 'frontful-style'
import React from 'react'

@resolver((resolve) => {
  resolve(() => ({
  }))
})
@style(require('./Component.style'))
class Component extends React.Component {
  render() {
    const {style} = this.props
    return (
      <div className={style.css('mgmt')}>
        <div>{'Language'}</div>
        <div>{'Language preset'}</div>
        <div>{'Services preset'}</div>
      </div>
    )
  }
}

export default Component
