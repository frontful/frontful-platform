import queryString from 'query-string'
import {Exceptions} from './Exceptions'
import {model, formatter} from 'frontful-model'
import {untracked, action} from 'mobx'
import {isBrowser} from 'frontful-utils'

@model.define((context) => ({
  config: Object.assign({
    mapping: {},
    req: null,
    res: null,
  }, context.config['frontful-router']),
}))
@model.format({
  path: null,
  state: null,
  prevPath: null,
  status: null,
  injectionRegister: formatter.map(),
  params: null,
})
class Model {
  constructor() {
    this.initialize()
    this.cache = {}
    this['push'] = this.execute.bind(this, 'push')
    this['push']['state'] = (state) => this['push'](this.path, state)
    this['replace'] = this.execute.bind(this, 'replace')
    this['replace']['state'] = (state) => this['replace'](this.path, state)
    this['pop'] = this.execute.bind(this, 'pop')
  }

  stateContainer = null

  @action
  setParams = (params) => {
    this.params = {
      ...params,
      path: this.path,
    }
    this.___setState()
  }

  getState = (key, defaultValue = null) => {
    return (this.state && this.state[key]) || defaultValue
    // if (!this.state.has(key)) {
    //   this.state.set(key, defaultValue)
    // }
    // return this.state.get(key)
  }

  @action
  ___setState = (stateContainer = this.stateContainer || this.state) => {
    const type = typeof stateContainer
    // this.state.clear()
    if (stateContainer && type === 'object' && !Array.isArray(stateContainer)) {
      this.state = Object.assign({}, stateContainer)
      // this.state.replace(stateContainer)
      // Object.keys(stateContainer).forEach((key) => {
      //   this.state.set(key, stateContainer[key])
      // })

      // this.state.forEach((value, key) => {
      //   if (!stateContainer.hasOwnProperty(key)) {
      //     this.state.delete(key)
      //   }
      // })
    }
    if (stateContainer === this.stateContainer) {
      this.stateContainer = null
    }
  }

  @action
  _setState = (stateContainer) => {
    const type = typeof stateContainer
    if (stateContainer && type === 'object' && !Array.isArray(stateContainer)) {
      this.stateContainer = Object.assign({}, this.stateContainer, stateContainer)
    }
  }

  @action
  executeActionsAndReturnInjections(query) {
    let executed = false

    const injections = Object.keys(query).reduce((injections, key) => {
      let setupQuery = this.queries[key]
      if (setupQuery && !setupQuery.isInjection) {
        if (isBrowser()) {
          setupQuery.responder(query[key])
        }
        executed = true
      }
      else if (setupQuery && setupQuery.isInjection) {
        injections[key] = query[key]
      }
      else if (key[0] === '_') {
        setupQuery = this.queries[key.replace('_', '')]
        if (setupQuery) {
          injections[key] = null
        }
      }
      return injections
    }, {})

    return executed || injections
  }

  mergeWithInjectionRegister(injections) {
    const injectionKeys = Object.keys(injections)
    const injectionRegisterKeys = Array.from(this.injectionRegister.keys())

    let merged = injectionRegisterKeys.reduce((merged, injectionRegisterKey) => {
      if (injectionKeys.indexOf('_' + injectionRegisterKey) === -1) {
        merged[injectionRegisterKey] = this.injectionRegister.get(injectionRegisterKey)
      }
      return merged
    }, {})

    merged = injectionKeys.reduce((merged, injectionKey) => {
      if (injectionKey[0] !== '_') {
        merged[injectionKey] = injections[injectionKey]
      }
      return merged
    }, merged)

    return merged
  }

  execute(action, _path, _state) {
    return this._execute(action, _path, _state)
  }

  @action
  _execute(action, _path, _state) {
    if (action === 'pop') {
      this.history.goBack()
      return
    }

    const array = _path.split(/[?#]/gi)
    let path = array[0] || this.path

    const query = array[1] ? queryString.parse('?' + array[1]) : {}

    let injections = this.executeActionsAndReturnInjections(query)

    if (typeof injections === 'boolean' && injections) {
      return
    }

    injections = this.mergeWithInjectionRegister(injections)

    const queryStr = queryString.stringify(injections)

    const oqs = queryString.stringify(this.injectionRegister.toPOJO())
    const nqs = queryStr

    if (action === 'push' && this.path === path && oqs !== nqs) {
      return this.execute('replace', _path, _state)
    }

    let mappedPath = (this.config.mapping[path] || path) + (queryStr ? '?' + queryStr : '')

    path += queryStr ? '?' + queryStr : ''

    if (this.path !== path || oqs !== nqs || _state) {
      if (isBrowser()) {
        if (mappedPath) {
          mappedPath = mappedPath.replace(window.location.origin, '')
        }
        this.history[action](mappedPath, Object.assign({}, this.state, _state))
      }
      else {
        if (_state) {
          this.___setState(Object.assign({}, this.state, _state))
        }
        else {
          this.reload(mappedPath)
        }
      }
    }
  }

  @action
  resolved() {
    this.status = 'resolved'
    this.listeners.forEach((listener) => {
      listener(this)
    })
  }

  listeners = []

  addListener(listener) {
    if (this.listeners.indexOf(listener) === -1) {
      this.listeners.push(listener)
    }
  }

  removeListener(listener) {
    const index = this.listeners.indexOf(listener)
    if (index !== -1) {
      this.listeners.splice(index, 1)
    }
  }

  setup(queries) {
    untracked(() => {
      this.queries = Object.keys(queries || {}).reduce((result, key) => {
        const responder = queries[key]
        const isInjection = Array.isArray(responder)
        result[key] = {key, isInjection, responder}
        return result
      }, {})

      if (!isBrowser()) {
        const inject = Object.keys(this.queries).reduce((inject, key) => {
          const query = this.config.req.query
          if (query.hasOwnProperty(key) && this.queries[key].isInjection) {
            inject[key] = query[key]
          }
          return inject
        }, {})

        this.injectionRegister.clear()
        this.injectionRegister.merge(inject)
      }
    })
  }

  reverseMatchIfAny(path) {
    return Object.keys(this.config.mapping).reduce((reverseMatch, key) => {
      if (!reverseMatch && this.config.mapping[key] === path) {
        return key
      }
      return reverseMatch
    }, null) || path
  }

  getPath() {
    const path = (isBrowser() ? window.location.pathname : (this.config.req.originalUrl || '').split(/[?#]/gi)[0]) || '/'
    return (this.reverseMatchIfAny(path) || '/').replace(/\/{2,}/gi, '/')
  }

  reload(path) {
    path = path || this.path
    if (path === this.path) {
      if (isBrowser()) {
        window.location.reload()
      }
      else {
        this.config.res.redirect(path)
      }
    }
    else {
      if (isBrowser()) {
        window.location.href = path
      }
      else {
        this.config.res.redirect(path)
      }
    }

    throw new Exceptions.Reload()

    // if (!isBrowser()) {
    //   throw new Exceptions.Reload()
    // }
  }

  @action
  initialize() {
    this.path = this.getPath()
    // this.___setState(null)
    this.params = {}
    this.prevPath = '/'
    this.status = 'resolved'

    if (isBrowser()) {
      const createHistory = require('history').createBrowserHistory

      this.history = createHistory()
      this.history.listen(action((location, historyType) => {
        const query = queryString.parse(location.search)

        this.injectionRegister.clear()
        this.injectionRegister.merge(query)

        this.prevPath = this.path
        this.status = 'resolving'

        this.path = this.reverseMatchIfAny(location.pathname)

        // console.log(historyType)
        // console.log(JSON.stringify(location.state, null ,2))

        this.isPOP = historyType === 'POP'

        if (this.prevPath === this.path) {
          this.___setState(location.state)
        }
        else {
          this._setState(location.state)
        }
      }))
    }
  }
}

export {
  Model,
}
