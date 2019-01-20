import {resolver} from 'frontful-resolver'
import {style} from 'frontful-style'
import Content from '../../models/Content'
import EditorModel from '../../models/Editor'
import mgmt from './mgmt'
import React from 'react'
import {observer} from 'mobx-react'
import IconPlus from '../../assets/icons/plus.jsx.svg'
import IconMinus from '../../assets/icons/minus.jsx.svg'

@resolver.define(({models}) => ({
  cms: models.global(Content).cms('content.editor', mgmt),
  editor: models.global(EditorModel)
}))
@resolver((resolve) => {
  resolve(({cms, editor}) => ({
    html: cms.html,
    config: cms.model,
    json: editor.json,
    editor: editor,
    contentModel: editor.content,
    managers: Promise.resolve().then(() => resolve.value(editor.managers)) ,
  }))
})
@style(require('./Editor.style'))
@observer
class Editor extends React.Component {
  renderKeys(json, prefix, depth = 1) {
    const {managers, style, html, config, editor, contentModel} = this.props
    const keys = Object.keys(json).sort()
    return keys.map((key) => {
      const contentKey = prefix ? `${prefix}.${key}` : key
      let type
      if (!json[key].hasOwnProperty('$editor')) {
        type = 'KEY'
      }
      else if (managers[contentKey]) {
        type = 'MANAGER'
      }
      else {
        type = 'FULL_CONTROL'
      }
      const autoExpand = depth <= config.autoExpandDepth && type === 'KEY'
      const expanded = (autoExpand ? !editor.expanded.has(contentKey) : editor.expanded.has(contentKey)) ? 'EXPANDED' : null
      let content = null
      if (type === 'KEY') {
        content = {
          type,
          element: expanded && this.renderKeys(json[key], contentKey, depth + 1),
        }
      }
      else if (type === 'MANAGER') {
        const Manager = managers[contentKey]
        content = {
          type,
          Component: expanded && Manager,
        }
      }
      else if (type === 'FULL_CONTROL') {
        content =  {
          type,
          Component: expanded && observer(() => (
            <textarea
              className={style.css('text_manager')}
              value={contentModel.keys.get(contentKey)}
              onChange={(event) => {
                contentModel.keys.set(contentKey, event.target.value)
              }}
            ></textarea>
          ))
        }
      }
      return !content ? null : (
        <div key={key} className={style.css('manager_wrapper')}>
          <div onClick={() => editor.toggle(contentKey)} className={style.css('manager_icon', expanded)}>
            {expanded ? <IconMinus /> : <IconPlus />}
          </div>
          <div className={style.css('manager_content', content.type, expanded)}>
            <div onClick={() => editor.toggle(contentKey)} className={style.css('name_wrapper', content.type, expanded)}>
              {content.type !== 'KEY' &&
                <div className={style.css('manager_accent')}></div>
              }
              <div className={style.css('manager_name')}>
                {key}
              </div>
            </div>
            {expanded && (
              <React.Fragment>
                <div className={style.css('manager_component', content.type)}>
                  {content.element || <content.Component />}
                </div>
                {content.type === 'MANAGER' &&
                  <div className={style.css('manager_controls')}>
                    <span>{html('discard', 'Discard')}</span>
                    <span>{html('save', 'Save')}</span>
                  </div>
                }
              </React.Fragment>
            )}
          </div>
        </div>
      )
    })
  }

  render() {
    const {style, json} = this.props
    return (
      <div className={style.css('editor')}>
        {this.renderKeys(json)}
      </div>
    )
  }
}

export default Editor
