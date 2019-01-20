import {resolver} from 'frontful-resolver'
import {style} from 'frontful-style'
import React from 'react'

@resolver((resolve) => {
  resolve(() => ({
  }))
})
@style(require('./Blank.style'))
class Blank extends React.Component {
  render() {
    const {style} = this.props
    return (
      <div className={style.css('mgmt')}>
        {'Blank'}
      </div>
    )
  }
}

export default Blank
