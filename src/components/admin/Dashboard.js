import React from 'react';
import { Box } from '@mui/material';
// import Header from "../../components/Header";
import Header from '../../pages/Header';
import Chart from '../../pages/Chart';

const Dashboard = () => {
    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
            </Box>
            <div>
                <Chart />
            </div>
        </Box>
    );
};

export default Dashboard;
