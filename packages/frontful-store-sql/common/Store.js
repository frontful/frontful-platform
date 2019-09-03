import Sequelize from 'sequelize'

process['fronfutl-store-sql'] = process['fronfutl-store-sql'] || {}

export default class Store {
  constructor(name, connectionParams) {
    if (process['fronfutl-store-sql'][name]) {
      process['fronfutl-store-sql'][name].dispose()
    }
    process['fronfutl-store-sql'][name] = this
    this.connectionParams = connectionParams
    this.connection = this.createConnection()
    this.verifyConnection()
  }

  createConnection() {
    return new Sequelize({
      logging: process.env.NODE_ENV !== 'production',
      ...this.connectionParams,
    })
  }

  execute(query) {
    return Promise.resolve(query)
  }

  createValue(value, replacements) {
    replacements.push(value)
    return '?'
  }

  createExpression(object, replace = undefined, name = undefined, prevName = undefined, group = undefined) {
    console.log(object)
    const type = typeof object
    if (!replace || Array.isArray(replace)) {
      const replacements = replace || []
      const result = {
        replacements: replacements,
        sql: !object ? '1 = 1' : this.createExpression(object, (value) => {
          replacements.push(value)
          return '?'
        }, name, prevName, group),
      }
      console.log(result)
      return result
    }
    else {
      if (typeof object === 'undefined') {
        if (group === 'OR') {
          return '1 = 0'
        }
        else {
          return '1 = 1'
        }
      }
      if (Array.isArray(object)) {
        if (object.length > 0) {
          return '(' + object.map((object) => this.createExpression(object, replace, name, prevName, 'OR')).join(' OR ') + ')'
        }
        else {
          // return '0 = 1'
          // return '1 = 1'
          if (group === 'OR') {
            return '1 = 0'
          }
          else {
            return '1 = 1'
          }
        }
      }
      else if (object && type === 'object') {
        if (Object.keys(object).length > 0) {
          const keys = Object.keys(object)
          const prevName = name
          return '(' + keys.map((name) => this.createExpression(object[name], replace, name, prevName, 'AND')).join(' AND ') + ')'
        }
        else {
          // return '0 = 1'
          // return '1 = 1'
          if (group === 'OR') {
            return '1 = 0'
          }
          else {
            return '1 = 1'
          }
        }
      }
      else {
        if (name) {
          let operation
          const nameParts = name.split('.').map((part) => part.replace(/\[|\]/gi, ''))
          const columnName = nameParts.map((value) => `[${value}]`).join('.')
          const prevNameParts = prevName && prevName.split('.').map((part) => part.replace(/\[|\]/gi, ''))
          const prevColumnName = prevName && prevNameParts.map((value) => `[${value}]`).join('.')
          switch (name) {
            case 'STARTS':
              return `${prevColumnName} LIKE ${replace((object || '') + '%')}`
            case 'ENDS':
                return `${prevColumnName} LIKE ${replace('%' + (object || ''))}`
            case 'CONTAINS':
                return `${prevColumnName} LIKE ${replace('%' + (object || '') + '%')}`
            default: {
              if (object === null) {
                return `${columnName} IS ${replace(object)}`
              }
              else if (typeof object === 'number') {
                operation = '<='
              }
              else {
                operation = '='
              }
              return `${columnName} ${operation} ${replace(object)}`
            }
          }
        }
        else {
          return '0 = 1'
        }
      }
    }
  }

  verifyConnection() {
    this.timeout = setTimeout(() => {
      this.connection.authenticate().then(() => {
        this.verifyConnection()
      }).catch((error) => {
        try {
          console.error(error)
          this.connection.close()
          this.connection = this.createConnection()
        }
        catch(error) {}
        this.verifyConnection()
      })
    }, 1000 * 60 * 1)
  }

  dispose() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    delete this.timeout
    this.verifyConnection = () => {}
  }
}
