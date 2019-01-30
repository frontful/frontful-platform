export default ({css}) => {
  css('.positioner', {
    position: 'fixed',
    top: '0',
    bottom: '0',
    right: '0',
  })

  css('.panel', {
    boxShadow: '0px 0px 6px rgba(0, 0, 0, 0.075)',
    backgroundColor: '#F8F8F8',
    overflowY: 'auto',
    overflowX: 'hidden',
  })

  css('.panel.ON_TOP', {
    backgroundColor: 'hsla(0, 0%, 97%, 0.85)',
  })
}
