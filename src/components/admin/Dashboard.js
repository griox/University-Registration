import React from 'react';
import { Box } from '@mui/material';
import Chart from '../../pages/Chart';
// import { tokens } from '../../theme';

const Dashboard = () => {
    // const theme = useTheme();
    // const colors = tokens(theme.palette.mode);
    localStorage.setItem('Pages', JSON.stringify('DASHBOARD'));

    return (
        <Box m="20px">
            {/* backgroundColor={colors.primary[400]} borderRadius="10px" */}
            <div>
                <Chart />
            </div>
        </Box>
    );
};

export default Dashboard;
