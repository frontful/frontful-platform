const NAME = 'cms'

export default class Content {
  constructor(req, params, server = null) {
    if (req) {
      this.server = server || req.res.locals[NAME].server
      this.req = req
      this.params = {
        isHosted: this.server.isHosted,
        key: this.server.setup.key,
        name: this.server.setup.name,
        host: this.server.setup.host || this.server.environment.setup.host,
        ...params,
      }
    }
    else {
      this.params = {
        ...window[`app-state-${NAME}`],
        ...params,
      }
    }
  }

  getScript() {
    return `<script src="${this.params.host}/api/content/script.js"></script>`
  }

  getScriptContent() {
    return `window['app-state-${NAME}'] = ${JSON.stringify({
      ...this.params,
      keys: [
        ...this.server.resolveKeys(this.req),
      ],
    })};`
  }
}
