import {resolver} from 'frontful-resolver'
import {style} from 'frontful-style'
import Content from '../../models/Content'
import ManagerModel from '../../models/Manager'
import mgmt from './mgmt'
import React from 'react'

@resolver.define(({models}) => ({
  cms: models.global(Content).cms('content.editor', mgmt),
  manager: models.global(ManagerModel)
}))
@resolver((resolve) => {
  resolve(({cms}) => ({
    html: cms.html,
  }))
})
@style(require('./Editor.style'))
class Manager extends React.PureComponent {
  render() {
    const {style, html} = this.props
    return (
      <div className={style.css('editor')}>
        <h3>{html('title')}</h3>
      </div>
    )
  }
}

export default Manager
