import React from 'react';
import { Switch } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
const DarkMode = () => {
    const dispatch = useDispatch();
    const setDarkMode = () => {
        document.querySelector('body').setAttribute('data-theme', 'dark');
        localStorage.setItem('selectedTheme', 'dark');
    };
    const setLightMode = () => {
        document.querySelector('body').setAttribute('data-theme', 'light');
        localStorage.setItem('selectedTheme', 'light');
    
    };
    const selectedTheme = localStorage.getItem('selectedTheme');
    if (selectedTheme === 'dark') {
        setDarkMode();
    }
    useEffect(() => {
        const Theme = localStorage.getItem('selectedTheme');
        if (Theme === 'dark') {
            dispatch({ type: 'theme', payload: true });
        }
        else{
            dispatch({ type: 'theme', payload: false });
        }
    }, [dispatch]);
    const toggleTheme = (checked) => {
        if (checked) {
            dispatch({ type: 'theme', payload: false });
            setLightMode();
        } else {
            dispatch({ type: 'theme', payload: true });
            setDarkMode();
        }
    };
    return (
        <>
            <Switch
                className="DarkMode"
                checkedChildren={<SunOutlined />}
                unCheckedChildren={<MoonOutlined />}
                defaultChecked={selectedTheme !== 'dark'}
                onChange={toggleTheme}
            />
        </>
    );
};
export default DarkMode;
