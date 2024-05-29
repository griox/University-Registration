import React from 'react';
import { Box } from '@mui/material';
import StudentList from '../../pages/Student Manage/Student_table';
const Profile = () => {
    localStorage.setItem('Pages', JSON.stringify('STUDENT'));

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                {/* <Header title="Student ManageMent" subtitle="List of Student" /> */}
            </Box>
            <div>
                <StudentList />
            </div>
        </Box>
    );
};

export default Profile;
