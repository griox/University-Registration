import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import AddSchool from '../../pages/University/AddSchool';
import '../../assets/css/fix-table.css';

const AddUniversity = () => {
    useEffect(() => {
        localStorage.setItem('Pages', JSON.stringify('UNIVERSITY'));
    }, []);

    return (
        <Box m="20px">
            <div className="fixed-container">
                <AddSchool></AddSchool>
            </div>
        </Box>
    );
};

export default AddUniversity;
