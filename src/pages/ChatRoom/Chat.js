import React from 'react'
import {Collapse,Typography} from 'antd'
const {Panel} = Collapse;
export const Chat = () => {
  return (
      <Collapse ghost>
        <Panel header="Rooms List" >
          <Typography.Link>Room 1</Typography.Link>
          <Typography.Link>Room 2</Typography.Link>
          <Typography.Link>Room 3</Typography.Link>
        </Panel>
      </Collapse>
  )
}
export default Chat;