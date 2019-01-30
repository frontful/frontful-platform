import {resolver} from 'frontful-resolver'
import {Checkbox} from 'frontful-components'
import Content from '../../../models/Content'
import React from 'react'

@resolver.define(({models}) => ({
  cms: models.global(Content).cms('content!panel'),
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
        <Checkbox field={fields.onTop} text={html('show_on_top', 'Show on top')} />
      </React.Fragment>
    )
  }
}

export default Manager
