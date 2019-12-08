import {Heading, Content as ContentComponent} from '@frontful/ape-components'
import {resolver} from 'frontful-resolver'
import {style} from 'frontful-style'
import ContentModel from 'frontful-cms'
import React from 'react'

@resolver.define(({models}) => ({
  cms: models.global(ContentModel).cms('cms.content'),
}))
@resolver((resolve) => {
  resolve(({cms}) => ({
    html: cms.html,
  }))
})
@style(require('./Content.style'))
class Content extends React.Component {
  render() {
    const {style} = this.props
    return false ? (
      <ContentComponent>
        <div className={style.css('content')}>
          <Heading accent title="CMS content" />
        </div>
      </ContentComponent>
    ) : null
  }
}

export default Content
