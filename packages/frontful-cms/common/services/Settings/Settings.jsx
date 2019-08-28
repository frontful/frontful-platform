import {GroupField} from '@frontful/ape-fields'
import {Heading, Content, Toolbar} from '@frontful/ape-components'
import {resolver} from 'frontful-resolver'
import {style} from 'frontful-style'
import ContentModel from 'frontful-cms'
import React from 'react'

@resolver.define(({models}) => ({
  cms: models.global(ContentModel).cms('cms.settings'),
}))
@resolver((resolve) => {
  resolve(({cms}) => ({
    html: cms.html,
  }))
})
@style(require('./Settings.style'))
class Settings extends React.Component {
  render() {
    const {style} = this.props
    return (
      <div className={style.css('settings')}>
        <Toolbar accent
          left={[
            {
              text: 'Save',
              action: () => {},
            },
          ]}
        />
        <Content>
          <Heading accent title={'Settings'} subtitle={'CMS provider'} />
          <GroupField>
          </GroupField>
        </Content>
      </div>
    )
  }
}

export default Settings
