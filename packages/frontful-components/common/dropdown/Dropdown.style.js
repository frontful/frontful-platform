export default ({css}) => {
  css('.dropdown_wrapper', {
    whiteSpace: 'nowrap',
  })

  css('.dropdown', {
    backgroundColor: '#ffffff',
    lineHeight: '26px',
    width: '100%',
    height: '28px',
    padding: '0 5px',
    border: '1px solid #B8B8B8',
    borderRadius: '0',
    appearance: 'none',
    WebkitAppearance: 'none',
    outline: 'none',
    paddingRight: '28px',
    boxSizing: 'border-box',
  })

  css('.dropdown:focus', {
    borderColor: '#0261B8',
  })

  css('.dropdown::-ms-expand', {
    display: 'none',
  })

  css('.icon', {
    lineHeight: '26px',
    height: '26px',
    width: '14px',
    position: 'relative',
    left: '-21px',
    pointerEvents: 'none',
    cursor: 'pointer',
    fill: '#B8B8B8',
  })
}
