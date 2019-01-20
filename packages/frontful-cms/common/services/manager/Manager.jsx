import {resolver} from 'frontful-resolver'
import {style} from 'frontful-style'
import Content from '../../models/Content'
import ManagerModel from '../../models/Manager'
import React from 'react'

@resolver.define(({models}) => ({
  cms: models.global(Content).cms('content.manager'),
  manager: models.global(ManagerModel)
}))
@resolver((resolve) => {
  resolve(({cms, model, Component, save}) => ({
    html: cms.html,
    Component: <Component model={model} />,
    save: save,
  }))
})
@style(require('./Manager.style'))
class Manager extends React.PureComponent {
  render() {
    const {style, html, Component, save} = this.props

    return (
      <div className={style.css('manager')}>
        <Component />
        <div className={style.css('action')} onClick={save}>
          {html('save')}
        </div>
      </div>
    )
  }
}

export default Manager
