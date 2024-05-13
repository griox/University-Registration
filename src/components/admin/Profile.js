import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from '../../components/Header';
import Pr from '../../pages/Pr';

const Profile = () => {
    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="PROFILE" subtitle="Welcome to Profile Page" />
            </Box>
            <div>
                <Pr />
            </div>
        </Box>
    );
};

export default Profile;
