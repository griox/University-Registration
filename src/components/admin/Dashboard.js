import React from 'react';
import { Box } from '@mui/material';
import Chart from '../../pages/Chart';

const Dashboard = () => {
    localStorage.setItem('Pages', JSON.stringify('DASHBOARD'));

    return (
        <Box m="20px">
            <div>
                <Chart />
            </div>
        </Box>
    );
};

export default Dashboard;
