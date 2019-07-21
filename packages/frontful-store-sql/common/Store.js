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

  createExpression(object, replace = undefined, name = undefined) {
    const type = typeof object
    if (!replace || Array.isArray(replace)) {
      const replacements = replace || []
      return {
        replacements: replacements,
        sql: !object ? '1 = 1' : this.createExpression(object, (value) => {
          replacements.push(value)
          return '?'
        }, name),
      }
    }
    else {
      if (Array.isArray(object)) {
        if (object.length > 0) {
          return '(' + object.map((object) => this.createExpression(object, replace, name)).join(' OR ') + ')'
        }
        else {
          // return '0 = 1'
          return '1 = 1'
        }
      }
      else if (object && type === 'object') {
        if (Object.keys(object).length > 0) {
          const keys = Object.keys(object)
          return '(' + keys.map((name) => this.createExpression(object[name], replace, name)).join(' AND ') + ')'
        }
        else {
          // return '0 = 1'
          return '1 = 1'
        }
      }
      else {
        if (name) {
          let operation
          const nameParts = name.split('.').map((part) => part.replace(/\[|\]/gi, ''))
          if (object === null) {
            operation = 'IS'
          }
          else if (typeof object === 'number') {
            operation = '<='
          }
          else {
            operation = '='
          }
          return `${nameParts.map((value) => `[${value}]`).join('.')} ${operation} ${replace(object)}`
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
