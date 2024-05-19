import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Header from '../../components/Header';
import AddSchool from '../../pages/University/AddSchool';
import { Button, Modal } from 'antd';
// import FormAdd from '../../pages/University/formAddSchool';

const AddUniversity = () => {
    const [position, setPosition] = useState('start');
    //button add
    const [isModalVisible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };
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
