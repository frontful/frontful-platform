import Component from './Manager'
import Model from './Model'
import Service from '../.'

export default {
  Model,
  Component,
  get Service() {
    return Service
  },
}
