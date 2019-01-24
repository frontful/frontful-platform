import React from 'react'
import {observer} from 'mobx-react'
import {style} from 'frontful-style'
import IconCheckboxChecked from '../assets/icons/checkboxChecked.jsx.svg'
import IconCheckboxUnchecked from '../assets/icons/checkboxUnchecked.jsx.svg'
import IconRadioChecked from '../assets/icons/radioChecked.jsx.svg'
import IconRadioUnchecked from '../assets/icons/radioUnchecked.jsx.svg'

@style(require('./Checkbox.style'))
@observer
class Checkbox extends React.Component {
  render() {
    const {value, onChange} = this.props.field || this.props
    const {style, text, type="checkbox", name} = this.props

    let Checked, Unchecked

    if (type === 'checkbox') {
      Checked = IconCheckboxChecked
      Unchecked = IconCheckboxUnchecked
    }
    else {
      Checked = IconRadioChecked
      Unchecked = IconRadioUnchecked
    }

    return (
      <div>
        <label className={style.css('checkbox')}>
          <input
            name={name}
            className={style.css('input')}
            type={type}
            onChange={onChange}
            checked={value}
          />
          <Unchecked className={style.css('icon')} />
          <Checked className={style.css('icon')} />
          <div className={style.css('content')}>
            {text}
          </div>
        </label>
      </div>
    )
  }
}

export default Checkbox
