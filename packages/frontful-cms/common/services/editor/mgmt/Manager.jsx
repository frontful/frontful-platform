import {resolver} from 'frontful-resolver'
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
class Manager extends React.Component {
  render() {
    const {fields, html} = this.props
    return (
      <React.Fragment>
        <Checkbox field={fields.showGlobal} text={html('show_global')} />
        <Textbox field={fields.language} title={html('language')} />
      </React.Fragment>
    )
  }
}

export default Manager
