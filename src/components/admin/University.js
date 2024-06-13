import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import AddSchool from '../../pages/University/AddSchool';
import '../../assets/css/fix-table.css';
import vi_VN from 'antd/locale/vi_VN';
import en_US from 'antd/locale/en_US';
import { ConfigProvider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
const AddUniversity = () => {
    const dispatch = useDispatch();
    const [lng, setLng] = useState('vi');
    const detail = useSelector((state) => state);
    useEffect(() => {
        const personal = localStorage.getItem('language');
        dispatch({ type: 'user', payload: personal });
        setLng(detail.language);
    }, [detail.language, dispatch]);
    useEffect(() => {
        localStorage.setItem('Pages', JSON.stringify('UNIVERSITY'));
    }, []);

    return (
        <ConfigProvider locale={vi_VN}>
            <Box m="20px">
                <div className="fixed-container">
                    <AddSchool></AddSchool>
                </div>
            </Box>
        </ConfigProvider>
    );
};

export default AddUniversity;
