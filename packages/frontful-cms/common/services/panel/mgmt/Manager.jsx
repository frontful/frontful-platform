import {resolver} from 'frontful-resolver'
import {Checkbox} from 'frontful-components'
import React from 'react'

@resolver.define(() => ({
}))
@resolver((resolve) => {
  resolve(({model}) => ({
    fields: model.fields,
  }))
})
class Manager extends React.Component {
  render() {
    const {fields} = this.props
    return (
      <React.Fragment>
        <Checkbox field={fields.onTop} text={'Show on top'} />
      </React.Fragment>
    )
  }
}

export default Manager
