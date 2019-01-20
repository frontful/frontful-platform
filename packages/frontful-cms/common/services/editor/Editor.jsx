import {resolver} from 'frontful-resolver'
import {style} from 'frontful-style'
import Content from '../../models/Content'
import EditorModel from '../../models/Editor'
import mgmt from './mgmt'
import React from 'react'
import {observer} from 'mobx-react'

@resolver.define(({models}) => ({
  cms: models.global(Content).cms('content.editor', mgmt),
  editor: models.global(EditorModel)
}))
@resolver((resolve) => {
  resolve(({cms, editor}) => ({
    html: cms.html,
    json: editor.json,
    content: editor.content,
    managers: Promise.resolve().then(() => resolve.value(editor.managers)) ,
  }))
})
@style(require('./Editor.style'))
class Editor extends React.PureComponent {
  renderKeys(json, prefix) {
    const {managers, style, content: contentModel} = this.props
    const keys = Object.keys(json).sort()

    






    return keys.map((key) => {
      const contentKey = prefix ? `${prefix}.${key}` : key
      let content = null
      if (json[key].hasOwnProperty('$editor')) {
        if (managers[contentKey]) {
          const Manager = managers[contentKey]
          console.log(Manager)
          content = (
            <Manager />
          )
        }
        else {
          const Component = observer(() => (
            <div className={style.css('editable')}>
              <textarea value={contentModel.keys.get(contentKey)} onChange={(event) => {
                contentModel.keys.set(contentKey, event.target.value)
              }}></textarea>
            </div>
          ))
          content =  <Component />
        }
      }
      else {
        content = this.renderKeys(json[key], contentKey)
      }
      return (
        <div key={key} className={style.css('key')}>
          <div>{contentKey}</div>
          <div className={style.css('content')}>
            {content}
          </div>
        </div>
      )
    })
  }

  render() {
    const {style, html, json} = this.props
    return (
      <div className={style.css('editor')}>
        <h3>{html('title')}</h3>
        {this.renderKeys(json)}
      </div>
    )
  }
}

export default Editor
