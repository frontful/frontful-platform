import {resolver} from 'frontful-resolver'
import {Checkbox, Dropdown} from 'frontful-components'
import Content from '../../../models/Content'
import React from 'react'

@resolver.define(({models}) => ({
  cms: models.global(Content).cms('content!editor'),
}))
@resolver((resolve) => {
  resolve(({model, cms}) => ({
    fields: model.fields,
    html: cms.html,
    textGroups: model.textGroups.slice(),
    configGroups: model.configGroups.slice(),
  }))
})
class Manager extends React.Component {
  render() {
    const {fields, html, textGroups, configGroups} = this.props
    return (
      <React.Fragment>
        <Dropdown field={fields.textGroup} html={html} options={textGroups.map((group) => ({
          value: group,
          key: `text_groups.${group}`,
        }))} />
        <Dropdown field={fields.configGroup} html={html} options={configGroups.map((group) => ({
          value: group,
          key: `config_groups.${group}`,
        }))} />
        <Checkbox field={fields.showGlobal} text={html('show_global')} />
      </React.Fragment>
    )
  }
}

export default Manager
