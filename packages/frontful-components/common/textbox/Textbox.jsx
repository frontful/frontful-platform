import React from 'react'
import {observer} from 'mobx-react'
import {style} from 'frontful-style'

@style(require('./Textbox.style'))
@observer
class Textbox extends React.Component {
  render() {
    const {value, onChange} = this.props.field || this.props
    const {style, type} = this.props
    return (
      <div>
        <input
          className={style.css('textbox')}
          onChange={onChange}
          type={type || 'text'}
          value={value}
        />
      </div>
    )
  }
}

export default Textbox
