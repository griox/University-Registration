import React from 'react';
import { Box } from '@mui/material';
// import Header from "../../components/Header";
import Header from '../../pages/Header';
import Chart from '../../pages/Chart';
import { Link, Redirect } from 'react-router-dom';

const Dashboard = () => {
    function checkLoginState() {
        const state = JSON.parse(localStorage.getItem('LoginState'));
        // console.log(state);
        if (state) {
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
        } else {
            return (<Link to="/Login" />), (<Redirect to="/Login" />);
        }
    }
    return checkLoginState();
};

export default Dashboard;
