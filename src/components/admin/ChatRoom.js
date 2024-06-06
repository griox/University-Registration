import React from 'react';
import { Box } from '@mui/material';
import Chat from '../../pages/ChatRoom/Chat';
// import { tokens } from '../../theme';

const ChatRoom = () => {
    // const theme = useTheme();
    // const colors = tokens(theme.palette.mode);
    localStorage.setItem('ChatRoom', JSON.stringify('CHATROOM'));

    return (
        <Box m="20px">
            {/* backgroundColor={colors.primary[400]} borderRadius="10px" */}
            <div>
                <Chat />
            </div>
        </Box>
    );
};

export default ChatRoom;