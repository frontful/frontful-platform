import {resolver} from 'frontful-resolver'
import {style} from 'frontful-style'
import {Textbox, Checkbox} from 'frontful-components'
import Content from '../../../models/Content'
import React from 'react'

@resolver.define(({models}) => ({
  cms: models.global(Content).cms('content!editor'),
}))
@resolver((resolve) => {
  resolve(({model, cms}) => ({
    fields: model.fields,
    html: cms.html,
  }))
})
@style(require('./Manager.style'))
class Manager extends React.Component {
  render() {
    const {style, fields, html} = this.props
    return (
      <div className={style.css('mgmt')}>
        <Checkbox field={fields.showGlobal} text={html('show_global')} />
        <Textbox field={fields.language} title={html('language')} />
      </div>
    )
  }
}

export default Manager
