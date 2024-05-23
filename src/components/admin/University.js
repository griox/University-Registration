import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import AddSchool from '../../pages/University/AddSchool';
// import FormAdd from '../../pages/University/formAddSchool';

const AddUniversity = () => {
    useEffect(() => {
        localStorage.setItem('Pages', JSON.stringify('UNIVERSITY'));
    }, []);

    return (
        <Box m="20px">
            {/* <Header title="ADD UNIVERSITY" subtitle="List of University" /> */}
            {/* <Header title="UNIVERSITY MANAGERMENT" /> */}

            <div>
                    <AddSchool></AddSchool>
            </div>
        </Box>
    );
};

export default AddUniversity;
