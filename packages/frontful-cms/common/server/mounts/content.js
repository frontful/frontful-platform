import express from 'express'
import getPreferences from '../../common/getPreferences'

export default function content(content) {
  const app = express()

  app.post('/', (req, res) => {
    const {text, config} = req.body
    const preferences = getPreferences(req)
    content.updateKeys(preferences.text, text)
    content.updateKeys(preferences.config, config)
    res.json(true)
  })

  app.get('/', (req, res) => {
    const keys = content.resolveKeys(req)
    res.json([...keys])
  })

  app.get('/script.js', (req, res) => {
    res.type('application/javascript').send(content.getScriptContent(req))
  })

  return app
}
