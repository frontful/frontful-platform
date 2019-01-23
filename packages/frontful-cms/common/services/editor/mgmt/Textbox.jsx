import React from 'react'
import {observer} from 'mobx-react'

@observer
class Textbox extends React.Component {
  render() {
    const {value, onChange} = this.props.field || this.props
    const {placeholder, title} = this.props
    return (
      <div>
        <div>{title}</div>
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
      </div>
    )
  }
}

export default Textbox
