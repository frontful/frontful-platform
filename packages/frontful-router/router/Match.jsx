import React from 'react'
import pathToRegexp from 'path-to-regexp'
import {resolver} from 'frontful-resolver'
import {Model} from '.'

function test(pattern, path) {
  if (pattern) {
    let keys = []
    const match = `${path}`.match(pattern instanceof RegExp ? pattern : pathToRegexp(pattern, keys))
    if (match) {
      return keys.reduce((result, key, idx) => {
        result[key.name] = decodeURI(match[idx + 1])
        return result
      }, {match})
    }
  }
  return null
}

function match(element, path, setParams) {
  const matched = test(element.props.pattern, path)

  if (matched) {
    const Item = element.type
    const {children, ...rest} = element.props // eslint-disable-line
    if (setParams) {
      setParams(matched)
    }
    return [<Item sourceElement={element} {...rest}/>]
  }
  else {
    let {children, ...rest} = element.props
    if (children) {
      children = [].concat(children)
      for (let i = 0, l = children.length; i < l; i++) {
        const result = match(children[i], path, setParams)
        if (result.length > 0) {
          const Item = element.type
          if (Item === 'void') {
            return result
          }
          else {
            return [<Item sourceElement={element} {...rest}/>].concat(result)
          }
        }
      }
    }
    return []
  }
}

@resolver.define(({models}) => ({
  router: models.global(Model)
}))
@resolver((resolve) => {
  resolve(({children, router: {cache, path, setParams}}) => {
    let __match = match(<void>{children}</void>, path, setParams)
    let __cachedMatch = __match
    if (cache.elementCache) {
      __cachedMatch = __match.map((element) => {
        const sourceElement = element.props.sourceElement
        if (cache.elementCache.has(sourceElement)) {
          // console.log('USE CACHED')
          return cache.elementCache.get(sourceElement)
        }
        else {
          return element
        }
      })
    }
    const items = resolve.value(__cachedMatch)
    return {
      elements: __match.map((element) => element.props.sourceElement),
      items,
      updateCache(elements, items) {
        cache.elementCache = new Map()
        elements.forEach((element, idx) => {
          cache.elementCache.set(element, items[idx])
        })
        // console.log(cache.elementCache)
      },
    }
  })
})
class Match extends React.PureComponent {
  hierarchify(items, props) {
    if (items.length === 0) {
      return null
    }
    else {
      let [Item, ...rest] = items
      let elementProps = {}
      if (React.isValidElement(Item)) {
        elementProps = {...Item.props}
        delete elementProps.sourceElement
        Item = Item.type
      }
      return (
        <Item {...elementProps} {...props}>
          {this.hierarchify(rest, null)}
        </Item>
      )
    }
  }

  render() {
    const {elements, items, updateCache, ...rest} = this.props
    // console.log(items)
    updateCache(elements, items)
    return this.hierarchify(items, rest)
  }
}

export {
  Match,
}
