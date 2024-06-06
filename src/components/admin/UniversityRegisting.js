import React from 'react';
import { Box } from '@mui/material';
import Pr from '../../pages/Pr';

const UniversityRegisting = () => {
    localStorage.setItem('Pages', JSON.stringify('PROFILE'));

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                {/* <Header title="PROFILE" subtitle="Welcome to Profile Page" /> */}
                {/* <Header title="PROFILE" /> */}
            </Box>
            <div>
                <Pr />
            </div>
        </Box>
    );
};

export default UniversityRegisting;
