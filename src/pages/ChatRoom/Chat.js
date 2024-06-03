import React from 'react'
import {Collapse,Typography} from 'antd'

const {Panel} = Collapse;
export const Chat = () => {
  return (
      <Collapse defaultActiveKey={[1]}>
        <Panel header="Room Lists" key='1'>
          <Typography.Link></Typography.Link>
          <Typography.Link></Typography.Link>
          <Typography.Link></Typography.Link>
        </Panel>
      </Collapse>
  )
}
export default Chat;