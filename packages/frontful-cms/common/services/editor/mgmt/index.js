import Component from './Manager'
import Model from './Model'
import Service from '../.'

export default {
  name: 'content.text',
  Model,
  Component,
  get Service() {
    return Service
  },
}
