import {resolver} from 'frontful-resolver'
import {style} from 'frontful-style'
import Content from '../../models/Content'
import EditorModel from '../../models/Editor'
import mgmt from './mgmt'
import React from 'react'
import {observer} from 'mobx-react'
import IconPlus from '../../assets/icons/plus.jsx.svg'
import IconMinus from '../../assets/icons/minus.jsx.svg'
import IconLink from '../../assets/icons/link.jsx.svg'
import IconUnlink from '../../assets/icons/unlink.jsx.svg'
import {untracked} from 'mobx'

@resolver.define(({models}) => ({
  cms: models.global(Content).cms('content!editor', mgmt),
  editor: models.global(EditorModel)
}))
@resolver((resolve) => {
  resolve(({cms, editor}) => ({
    editor,
    html: cms.html,
    config: cms.model,
    managers: resolve.value(editor.managers),
  }))
})
@style(require('./Editor.style'))
@observer
class Editor extends React.Component {
  renderKeys(json, prefix, depth = 1) {
    const {managers, style, html, config, editor} = this.props
    const keys = Object.keys(json).sort((a, b) => {
      if (!json[a].hasOwnProperty('$editor')) a = '%' + a
      if (!json[b].hasOwnProperty('$editor')) b = '%' + b
      if (a < b) return -1
      if (a > b) return 1
      return 0
    })
    return keys.map((key) => {
      const contentKey = prefix ? `${prefix}.${key}` : key
      const isLinkable = editor.content.relations.has(contentKey)
      const resolvedKey = untracked(() => editor.content.resolveKey(contentKey))
      let type
      if (!json[key].hasOwnProperty('$editor')) {
        type = 'KEY'
      }
      else if (managers[resolvedKey]) {
        type = 'MANAGER'
      }
      else {
        type = 'FULL_CONTROL'
      }
      const autoExpand = (depth <= config.autoExpandDepth && type === 'KEY') || (editor.filter && keys.length === 1)
      const expanded = (autoExpand ? !editor.expanded.has(contentKey) : editor.expanded.has(contentKey)) ? 'EXPANDED' : null
      let content = null
      if (type === 'KEY') {
        content = {
          type,
          element: expanded && this.renderKeys(json[key], contentKey, depth + 1),
        }
      }
      else if (type === 'MANAGER') {
        const Manager = managers[resolvedKey]
        content = {
          type,
          Component: expanded && Manager,
        }
      }
      else if (type === 'FULL_CONTROL') {
        content =  {
          type,
          Component: expanded && observer(() => {
            return (
              <textarea
                className={style.css('text_manager')}    
                value={editor.content.keys.get(resolvedKey)}
                onChange={(event) => {
                  const value = event.target.value
                  editor.content.keys.set(resolvedKey, value)
                  editor.content.addToQueue(resolvedKey, value)
                }}
              ></textarea>
            )
          })
        }
      }
      return !content ? null : (
        <div key={key} className={style.css('manager_wrapper')}>
          <div onClick={() => editor.toggle(contentKey)} className={style.css('manager_icon', expanded)}>
            {expanded ? <IconMinus /> : <IconPlus />}
          </div>
          <div className={style.css('manager_content', content.type, expanded)}>
            <div className={style.css('name_wrapper', content.type, expanded)}>
              {content.type !== 'KEY' &&
                <div className={style.css('manager_accent')}></div>
              }
              <div onClick={() => editor.toggle(contentKey)} className={style.css('manager_name')}>
                {key}
              </div>
              {expanded && isLinkable &&
                <div onClick={() => {editor.toggleLink(contentKey); this.forceUpdate()}} className={style.css('link_manager')}>
                  {untracked(() => editor.content.keys.get(contentKey) === ':resolve') ?
                    <IconLink className={style.css('LINKED')}/> : <IconUnlink className={style.css('UNLINKED')}/>
                  }
                </div>
              }
            </div>
            {expanded && (
              <React.Fragment>
                <div className={style.css('manager_component', content.type)}>
                  {content.element || <content.Component />}
                </div>
                {content.type === 'MANAGER' &&
                  <div className={style.css('manager_controls')}>
                    <span>{html('action.discard', 'Discard')}</span>
                    <span>{html('action.save', 'Save')}</span>
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
    const {style, editor} = this.props
    return (
      <div className={style.css('editor')}>
        <div className={style.css('filter')}>
          <input
            type="text"
            placeholder="Filter keys and values"
            value={editor.filter}
            onChange={(event) => {
              editor.filter = event.target.value
            }}
            className={style.css(editor.filter && 'FILTERED')}
          ></input>
        </div>
        {this.renderKeys(editor.json)}
      </div>
    )
  }
}

export default Editor
