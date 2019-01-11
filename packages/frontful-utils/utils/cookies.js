import cookie from 'cookie'
import {isBrowser} from './isBrowser'

export function cookies(req = null) {
  if (isBrowser()) {
    return {
      set: function (name, value, options) {
        const cookieStr = cookie.serialize(name, value, options)
        document.cookie = cookieStr
        return cookieStr
      },
      get: function (name) {
        return cookie.parse(document.cookie)[name]
      },
      remove: function (name, options) {
        let opts = options || {}
        opts.expires = new Date(0)
        return !!(document.cookie = cookie.serialize(name, '', opts))
      },
      all: function () {
        return cookie.parse(document.cookie)
      }
    }
  }
  else {
    return {
      set: function (name, value, options) {
        const cookieStr = cookie.serialize(name, value, options)
        req.cookies[name] = value
        req.res.cookie.call(req.res, name, value, options)
        return cookieStr
      },
      get: function (name) {
        return req.cookies[name]
      },
      remove: function (name, options) {
        let opts = options || {}
        opts.expires = new Date(0)
        req.cookies[name] = null
        return !!(req.res.cookie(name, '', opts))
      },
      all: function () {
        return req.cookies
      }
    }
  }
}
