import express from 'express'
import getPreferences from '../../common/getPreferences'

export default function content(content) {
  const app = express()

  app.post('/', (req, res, next) => {
    const {text, config} = req.body
    const preferences = getPreferences(req)
    Promise.all([
      content.updateKeys(preferences.text, text),
      content.updateKeys(preferences.config, config),
    ]).then(() => {
      res.json(true)
      return null
    }).catch(next)
  })

  app.get('/reload', (req, res, next) => {
    content.load().then(() => next()).catch(next)
  })

  app.get(['/', '/reload'], (req, res) => {
    const keys = content.resolveKeys(req)
    res.json([...keys])
  })

  app.get('/script.js', (req, res) => {
    res.type('application/javascript').send(content.getScriptContent(req))
  })

  return app
}
