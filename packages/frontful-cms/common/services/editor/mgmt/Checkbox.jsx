import React from 'react'
import {observer} from 'mobx-react'

@observer
class Checkbox extends React.Component {
  render() {
    const {value, onChange} = this.props.field || this.props
    const {text} = this.props
    return (
      <div>
        <input
          type="checkbox"
          checked={value}
          onChange={onChange}
        />
        <span>{text}</span>
      </div>
    )
  }
}

export default Checkbox
