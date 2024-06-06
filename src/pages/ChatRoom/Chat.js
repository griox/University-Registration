import React from 'react';
import { Select } from 'antd';
import styled from 'styled-components';

const StyledSelect = styled.div`
  display: ${localStorage.getItem('selectedMenuItem') === 'ChatRoom' ? 'none' : 'block'};
`;

export const Chat = () => {
  return (
    <StyledSelect>
      <Select
        defaultValue="lucy"
        style={{
          width: 120,
        }}
        options={[
          {
            value: 'jack',
            label: 'Room 1',
          },
          {
            value: 'lucy',
            label: 'Room 2',
          },
          {
            value: 'Yiminghe',
            label: 'Room 2',
          },
          {
            value: 'disabled',
            label: 'Room 3',
          },
        ]}
      />
    </StyledSelect>
  );
};

export default Chat;
