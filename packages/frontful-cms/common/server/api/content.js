import express from 'express'
import getPreferences from '../../common/getPreferences'

export default function content(server) {
  const app = express()

  app.post('/content', (req, res, next) => {
    const {text, config} = req.body
    const preferences = getPreferences(req)
    Promise.all([
      server.updateKeys(preferences.text, text),
      server.updateKeys(preferences.config, config),
    ]).then(() => {
      res.json(true)
      return null
    }).catch(next)
  })

  app.get('/reload', (req, res, next) => {
    server.load().then(() => next()).catch(next)
  })

  app.get(['/content', '/reload'], (req, res) => {
    const keys = server.resolveKeys(req)
    res.json([...keys])
  })

  app.get('/content.js', (req, res) => {
    res.type('application/javascript').send(server.client(req).getScriptContent())
  })

  return app
}
