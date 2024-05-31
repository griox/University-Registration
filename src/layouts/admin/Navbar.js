import React, { useContext, useState } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { tokens, ColorModeContext } from '../../theme';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Dropdown, Space, Typography, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { locales } from '../../translation/i18n';
import DarkMode from '../../components/Darkmode/Darkmode';

const Navbar = () => {
    const { t, i18n } = useTranslation('navbar');
    const currentLanguage = locales[i18n.language === 'vi' ? 'vi' : 'en'];
    const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage === 'Tiếng anh' ? 'Tiếng anh' : 'English');
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLanguage = (lng, label) => {
        i18n.changeLanguage(lng);
        setSelectedLanguage(label);
    };
    const items_lng = [
                {
                    key: '1',
                    label: currentLanguage === 'Tiếng việt' ? 'Tiếng anh' : 'English',
                    icon: (
                        <img width="20" height="20" src="https://img.icons8.com/color/48/usa.png" alt="usa" />
                    ),
                    onclick: () => handleLanguage('en',currentLanguage === 'VietNam' ? 'English' : 'English'),
                },
                {
                    key: '2',
                    label: currentLanguage === 'Tiếng việt' ? 'Tiếng việt' : 'Vietnam',
                    icon: (
                        <img
                            width="20"
                            height="20"
                            src="https://img.icons8.com/color/48/vietnam.png"
                            alt="vietnam"
                        />
                    ),
                    onclick: () => handleLanguage('vi',currentLanguage === 'Tiếng việt' ? 'Tiếng việt' : 'Vietnam' ),
                },
            ]
    const items = [
        {
            label: t('title.setting'),
            key: '3',
            icon: <SettingsOutlinedIcon />,
        },
        {
            key: '3.1',
                    label: t('button.change password'),
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 32 32" bgcolor='var(--body_background)' >
                            <path
                                fill="currentColor"
                                d="M21 2a8.998 8.998 0 0 0-8.612 11.612L2 24v6h6l10.388-10.388A9 9 0 1 0 21 2m0 16a7 7 0 0 1-2.032-.302l-1.147-.348l-.847.847l-3.181 3.181L12.414 20L11 21.414l1.379 1.379l-1.586 1.586L9.414 23L8 24.414l1.379 1.379L7.172 28H4v-3.172l9.802-9.802l.848-.847l-.348-1.147A7 7 0 1 1 21 18"
                            />
                            <circle cx="22" cy="10" r="2" fill="currentColor" />
                        </svg>),
        },
        {
            label: t('button.log out'),
            key: 'logout',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                    <path
                        fill="#ff4d4f"
                        d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
                    />
                </svg>
            ),
            danger: true,
        },
    ];

    const handleLogout = () => {
        const confirm = window.confirm(t('title.confirm'));
        if (confirm) {
            localStorage.setItem('Infor', JSON.stringify(''));
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('selectedMenuItem');
            localStorage.setItem('Name', '');
            localStorage.setItem('Email', JSON.stringify(''));
            localStorage.setItem('Role', '');

            dispatch({ type: 'logout' });

            history.push('/Login');
        } else {
            return;
        }
    };

    const handleMenuClick = (e) => {
        if (e.key === '3.1') {
            history.push('/changepass');
        } else if (e.key === 'logout') {
            handleLogout();
        } else {
            toast.error('Your reques is failed');
        }
    };

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    return (
        <Box
            display="flex"
            position="sticky"
            bgcolor="var(--navbar-color)"
            width="100%"
            zIndex={1000}
            top="0"
            left="0"
            justifyContent="space-between"
            boxShadow=" 0 7px 25px 0 rgba(0, 0, 0, 0.1)"
            p={2}
            color= "var(--body_color)"
        >
            <Box display="flex" alignItems="center">
            </Box>
            {/* <Box>
                <button onClick={() => handleLanguage('vi')}>
                    {currentLanguage === 'Tiếng việt' ? 'Tiếng việt' : 'Vietnamese'}
                </button>
                <button onClick={() => handleLanguage('en')}>
                    {currentLanguage === 'Tiếng việt' ? 'Tiếng anh' : 'Egnlish'}
                </button>
            </Box> */}
            <Box display="flex" alignItems="center"></Box>
            <Box display="flex">
            <Space wrap>
                    <Dropdown
                        className='drop-lng'
                        overlay={
                            <Menu>
                                {items_lng.map(item => (
                                    <Menu.Item key={item.key} onClick={item.onclick}>
                                        {item.icon}&nbsp;{item.label}
                                    </Menu.Item>
                                ))}
                            </Menu>
                        }
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Typography.Link>
                            <Space className='title-drop'>
                                {selectedLanguage}
                            </Space>
                        </Typography.Link>    
                    </Dropdown>
                    <DarkMode/>
                    <Dropdown overlay={
                            <Menu onClick={handleMenuClick}>
                                {items.map(item => (
                                    <Menu.Item key={item.key} danger={item.danger}>
                                        {item.icon}&nbsp;{item.label}
                                    </Menu.Item>
                                ))}
                            </Menu>
                        }
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <IconButton>
                            <UserOutlined style={{color:'var(--body_color)'}} />
                        </IconButton>
                    </Dropdown>
                </Space>
            </Box>
        </Box>
    );
};

export default Navbar;
