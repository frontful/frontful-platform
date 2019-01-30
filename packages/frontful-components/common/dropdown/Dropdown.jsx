import React from 'react'
import {observer} from 'mobx-react'
import {style} from 'frontful-style'
import IconDropdown from '../assets/icons/dropdown.jsx.svg'

@style(require('./Dropdown.style'))
@observer
class Dropdown extends React.Component {
  render() {
    const {value, onChange} = this.props.field || this.props
    const {style, placeholder, options, children, html} = this.props
    return (
      <div className={style.css('dropdown_wrapper')}>
        <select
          className={style.css('dropdown')}
          onChange={onChange}
          value={value}>
          {typeof placeholder !== 'undefined' &&
            <option value="">
              {placeholder}
            </option>
          }
          {children || options.map((option) => {
            const value = option.value || option
            if (html && html.createElement && option.key) {
              return html.createElement('option', {
                key: value,
                value: value,
              }, option.key)
            }
            return (
              <option key={value} value={value}>
                {option.text || option}
              </option>
            )
          })}
        </select>
        <IconDropdown className={style.css('icon')} />
      </div>
    )
  }
}

export default Dropdown
