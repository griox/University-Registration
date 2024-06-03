import React from 'react';
import { Box } from '@mui/material';
import StudentList from '../../pages/Student Manage/Student_table';
import '../../assets/css/fix-table.css';

const Profile = () => {
    localStorage.setItem('Pages', JSON.stringify('STUDENT'));

    return (
        <Box m="20px">
            <div className="fixed-container">
                <StudentList />
            </div>
        </Box>
    );
};

export default Profile;
