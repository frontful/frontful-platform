import {resolver} from 'frontful-resolver'
import {style} from 'frontful-style'
import React from 'react'

@resolver((resolve) => {
  resolve(({model}) => ({
    text: model.text,
    onChange: (event) => {
      model.text = event.target.value
    },
  }))
})
@style(require('./Component.style'))
class Component extends React.Component {
  render() {
    const {style, text, onChange} = this.props
    return (
      <div className={style.css('mgmt')}>
        <input type="text" value={text} onChange={onChange} />
      </div>
    )
  }
}

export default Component
