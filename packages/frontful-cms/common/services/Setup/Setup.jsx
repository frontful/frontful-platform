import {Heading, Content} from '@frontful/ape-components'
import {resolver} from 'frontful-resolver'
import {style} from 'frontful-style'
import ContentModel from 'frontful-cms'
import React from 'react'

@resolver.define(({models}) => ({
  cms: models.global(ContentModel).cms('cms.setup'),
}))
@resolver((resolve) => {
  resolve(({cms}) => ({
    html: cms.html,
  }))
})
@style(require('./Setup.style'))
class Setup extends React.Component {
  render() {
    const {style} = this.props
    return (
      <Content>
        <div className={style.css('setup')}>
          <Heading accent title="CMS setup" />
        </div>
      </Content>
    )
  }
}

export default Setup
