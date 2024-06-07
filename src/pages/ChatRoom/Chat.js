import React, { useEffect } from 'react';
import { Select } from 'antd';
import styled from 'styled-components';

// Define StyledSelect outside the component
const StyledSelect = styled.div`
  display: ${localStorage.getItem('selectedMenuItem') === 'ChatRoom' ? 'block' : 'none'};
`;

export const Chat = () => {
  // You can use useEffect to update the display style when localStorage changes
  useEffect(() => {
    // Optional: if you want to update the display style dynamically when localStorage changes
    const handleStorageChange = () => {
      // Force a re-render when localStorage changes
      window.location.reload();
    };

    window.addEventListener('storage', handleStorageChange);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
