import {Heading, Content} from '@frontful/ape-components'
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
      <Content>
        <div className={style.css('settings')}>
          <Heading accent title="CMS settings" />
        </div>
      </Content>
    )
  }
}

export default Settings
