import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from '../../components/Header';
import Pr from '../../pages/Pr';
import Student_List from '../../pages/Student Manage/Student_table';
const Profile = () => {
    localStorage.setItem('Pages', JSON.stringify('STUDENT'));

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                {/* <Header title="Student ManageMent" subtitle="List of Student" /> */}
                {/* <Header title="STUDENT MANAGERMENT" /> */}
            </Box>
            <div>
                <Student_List />
            </div>
        </Box>
    );
};

export default Profile;
