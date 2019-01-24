export default ({css}) => {
  css('.checkbox', {
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '24px',
    paddingTop: '4px',
  })

  css('.input', {
    position: 'absolute',
    left: '-50px',
  })

  css('.icon', {
    fill: '#666666',
    backgroundColor: '#ffffff',
    width: '16px',
    height: '16px',
    flex: '0 0 16px',
    cursor: 'pointer',
    marginRight: '5px',
  })

  css('.input + .icon', {
    display: 'inline',
  })

  css('.input + .icon + .icon', {
    display: 'none',
  })

  css('.input:checked + .icon', {
    display: 'none',
  })

  css('.input:checked + .icon + .icon', {
    display: 'inline',
  })

  // css('.checkbox:hover > .icon', {
  //   fill: '#0261B8',
  // })

  css('.content', {
    color: 'inherit',
    cursor: 'pointer',
    userSelect: 'none',
  })
}
