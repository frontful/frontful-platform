import {resolver} from 'frontful-resolver'
import {style} from 'frontful-style'
import React from 'react'
import Textbox from './Textbox'
import Checkbox from './Checkbox'
import Content from '../../../models/Content'

@resolver.define(({models}) => ({
  cms: models.global(Content).cms('content.editor')
}))
@resolver((resolve) => {
  resolve(({model}) => ({
    fields: model.fields,
  }))
})
@style(require('./Component.style'))
class Component extends React.Component {
  render() {
    const {style, fields} = this.props
    return (
      <div className={style.css('mgmt')}>
        <Checkbox field={fields.showFullPath} />
        <Textbox field={fields.language} />
      </div>
    )
  }
}

export default Component
