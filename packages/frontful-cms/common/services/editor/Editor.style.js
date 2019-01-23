export default ({css}) => {
  css('.editor', {
    padding: '15px 15px 5px 0px',
  })

  css('.filter', {
    paddingLeft: '15px',
  })

  css('.filter > input', {
    padding: '5px',
    margin: '0',
    width: '100%',
    border: '1px solid #B8B8B8',
  })

  css('.filter > input.FILTERED', {
    border: '1px solid #0261B8',
  })

  css('.manager_wrapper', {
    display: 'flex',
    margin: '4px 0',
  })

  css('.manager_wrapper:first-child', {
    marginTop: '0',
  })

  css('.manager_wrapper:last-child', {
    marginBottom: '0',
  })

  css('.manager_icon', {
    width: '30px',
    flexGrow: '0',
    flexShrink: '0',
    flexBasis: '30px',
    textAlign: 'right',
    paddingRight: '5px',
    height: '25px',
    cursor: 'pointer',
    fill: '#555555',
    opacity: '0.5',
  })

  css('.manager_icon.EXPANDED', {
    fill: '#0261B8',
    opacity: '1',
  })

  css('.manager_icon > svg', {
    width: '10px',
    height: '25px',
  })

  css('.manager_content', {
    flexGrow: '1',
    border: '1px solid transparent',
  })

  css('.manager_content.KEY', {
  })

  css('.manager_content.MANAGER.EXPANDED, .manager_content.FULL_CONTROL.EXPANDED', {
    borderColor: '#0261B8',
  })

  css('.name_wrapper', {
    display: 'flex',
    alignItems: 'center',
    minHeight: '25px',
    cursor: 'pointer',
    userSelect: 'none',
  })

  css('.name_wrapper.KEY', {
  })

  css('.name_wrapper.KEY.EXPANDED', {
    color: '#0261B8',
  })

  css('.name_wrapper.MANAGER.EXPANDED, .name_wrapper.FULL_CONTROL.EXPANDED', {
    backgroundColor: '#ffffff',
  })

  css('.manager_accent', {
    width: '10px',
    height: '25px',
    backgroundColor: '#ffffff',
    border: '1px solid #E7E7E7',
    // border: '1px solid #0261B8',
    marginRight: '5px',
  })

  css('.EXPANDED > .manager_accent', {
    borderColor: 'transparent'
  })

  css('.manager_name', {
    flexGrow: '1',
  })

  css('.link_manager', {
    paddingRight: '7px',
  })

  css('.link_manager > svg', {
    height: '25px',
    width: '17px',
    fill: '#555555',
  })

  css('.link_manager > svg.LINKED', {
    fill: '#0261B8',
  })

  css('.link_manager > svg.UNLINKED', {
    opacity: '0.5',
  })

  css('.manager_component', {
    borderTop: '1px solid #E7E7E7',
    padding: 0,
    
  })

  css('.manager_component.MANAGER', {
    padding: '10px 15px',
  })

  css('.manager_component.KEY', {
    borderLeft: '1px solid #B8B8B8',
    borderTop: '0',
  })

  css('.manager_controls', {
    backgroundColor: '#ffffff',
    padding: '0 15px',
    textAlign: 'right',
    borderTop: '1px solid #E7E7E7',
    lineHeight: '25px',
  })

  css('.manager_controls > *', {
    display: 'inline-block',
    color: '#0261B8',
    paddingLeft: '10px',
    textDecoration: 'underline',
  })

  css('.text_manager', {
    backgroundColor: 'inherit',
    border: '0',
    margin: '0',
    display: 'block',
    padding: '10px 15px',
    width: '100%',
  })
}
