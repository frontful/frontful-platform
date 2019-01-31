import {style} from 'frontful-style'

style.manager.theme.add({
  name: 'grayscale',
  default: false,
  context: 'frontful',
  config: {
    color: {
      text: '#555555',
      white: '#FFFFFF',
      black: '#000000',
      blue: '#5c5c5c',
    },
  },
})
