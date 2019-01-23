import {resolver} from 'frontful-resolver'
import React from 'react'

@resolver((resolve) => {
  resolve(({model, View}) => ({
    View: <View model={model} />,
  }))
})
class Manager extends React.PureComponent {
  render() {
    const {View} = this.props
    return <div>
      <div>aaaa</div>
      <View />
    </div>
  }
}

export default Manager
