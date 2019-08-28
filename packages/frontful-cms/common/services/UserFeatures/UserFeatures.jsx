import {CheckboxField, GroupField} from '@frontful/ape-fields'
import {Heading} from '@frontful/ape-components'
import {resolver} from 'frontful-resolver'
import {style} from 'frontful-style'
import Field from 'frontful-field'
import React from 'react'

@resolver.define(() => ({
}))
@resolver((resolve) => {
  resolve(
    ({features}) => ({
      fields: {
        manage: new Field(features.get('cms', 'manage').value$),
        manageSetup: new Field(features.get('cms', 'manageSetup').value$),
        manageSettings: new Field(features.get('cms', 'manageSettings').value$),
        manageContent: new Field(features.get('cms', 'manageContent').value$),
      }
    })
  )
})
@style(require('./UserFeatures.style'))
class UserFeatures extends React.Component {
  render() {
    const {style, fields} = this.props
    return (
      <div className={style.css('user_features')}>
        <Heading accent title="CMS features" />
        <GroupField>
          <CheckboxField medium text={'Manage'} field={fields.manage} />
          <CheckboxField medium text={'Manage Setup'} field={fields.manageSetup} />
          <CheckboxField medium text={'Manage Settings'} field={fields.manageSettings} />
          <CheckboxField medium text={'Manage Content'} field={fields.manageContent} />
        </GroupField>
      </div>
    )
  }
}

export default UserFeatures
