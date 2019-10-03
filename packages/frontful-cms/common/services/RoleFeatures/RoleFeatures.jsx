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
      }
    })
  )
})
@style(require('./RoleFeatures.style'))
class RoleFeatures extends React.Component {
  render() {
    const {style, fields} = this.props
    return (
      <div className={style.css('role_features')}>
        <Heading accent title="CMS features" />
        <GroupField>
          <CheckboxField medium text={'Manager'} field={fields.manage} />
        </GroupField>
      </div>
    )
  }
}

export default RoleFeatures
