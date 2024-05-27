import React from 'react';
import { Box } from '@mui/material';
import Pr from '../../pages/Pr';

const Profile = () => {
    localStorage.setItem('Pages', JSON.stringify('PROFILE'));

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center"></Box>
            <div>
                <Pr />
            </div>
        </Box>
    );
};

export default Profile;
