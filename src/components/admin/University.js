import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Header from '../../components/Header';
import AddSchool from '../../pages/University/AddSchool';
import { Button, Modal } from 'antd';
import FormAdd from '../../pages/University/formAddSchool';

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
            <Header title="UNIVERSITY MANAGERMENT" />

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                }}
            >
                <span style={{ fontWeight: 'bold', fontSize: '20px' }}>{/* List of University{" "} */}</span>
                <Button style={{ width: '120px', marginRight: '30px' }} type="primary" onClick={showModal}>
                    Add
                </Button>
                <Modal
                    title="Add the University"
                    visible={isModalVisible}
                    onOk={handleOk}
                    okText="Add"
                    onCancel={handleCancel}
                    style={{ top: '50px', left: '50px' }}
                >
                    <FormAdd></FormAdd>
                </Modal>
            </div>
            <div>
                <>
                    <AddSchool></AddSchool>
                </>
            </div>
        </Box>
    );
};

export default AddUniversity;
