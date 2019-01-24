export default ({css}) => {
  css('.textbox', {
    backgroundColor: '#ffffff',
    lineHeight: '28px',
    width: '100%',
    height: '28px',
    padding: '0 5px',
    borderRadius: '0px',
    border: '1px solid #B8B8B8',
  })

  css('.textbox:focus', {
    border: '1px solid #0261B8',
  })
}
