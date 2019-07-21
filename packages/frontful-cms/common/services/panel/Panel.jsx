import {resolver} from 'frontful-resolver'
import {style} from 'frontful-style'
import Editor from '../editor'
import React from 'react'
import {Resizable} from 're-resizable'
import Content from '../../models/Content'
import mgmt from './mgmt'
import PanelModel from './Panel.model'

@resolver.define(({models}) => ({
  cms: models.global(Content).cms('cms.panel', mgmt),
  panel: models.global(PanelModel),
}))
@resolver((resolve) => {
  resolve(
    () => ({
      Editor: <Editor />,
    }),
    ({cms, panel}) => ({
      onTop: cms.model.onTop,
      toggle: panel.toggle,
      expanded: panel.expanded,
    })
  )
})
@style(require('./Panel.style'))
class Panel extends React.PureComponent {
  state = {
    width: 375,
  }

  componentDidMount() {
    const {toggle} = this.props
    document.addEventListener('keydown', toggle, false)
  }

  componentWillUnmount() {
    const {toggle} = this.props
    document.removeEventListener('keydown', toggle, false)
  }

  render() {
    const {style, onTop, Editor, expanded, children} = this.props
    const child = React.Children.only(children)
    if (expanded) {
      return (
        <React.Fragment>
          <div style={{
            marginRight: `${onTop ? 0 : this.state.width}px`,
          }}>
            {child}
          </div>
          <div className={style.css('positioner')}>
            <Resizable
              onResizeStop={(event, direction, ref, delta) => {
                this.setState({
                  width: this.state.width + delta.width,
                })
              }}
              defaultSize={{
                width: this.state.width,
                height: '100%',
              }}
              enable={{
                top:false,
                right:true,
                bottom:false,
                left:true,
                topRight:false,
                bottomRight:false,
                bottomLeft:false,
                topLeft:false,
              }}
              className={style.css('panel', onTop && 'ON_TOP')}
              children={
                <Editor />
              }
            />
          </div>
        </React.Fragment>
      )
    }
    else {
      return child
    }
  }
}

export default Panel
