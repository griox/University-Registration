import React, { useState, useEffect, useRef } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme, Tooltip, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import { tokens } from '../../theme';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { LogoutOutlined, SignatureOutlined, SolutionOutlined } from '@ant-design/icons';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import SchoolIcon from '@mui/icons-material/School';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Item = ({ title, to, icon, selected, setSelected, tooltip }) => {
    // const theme = useTheme();
    // const colors = tokens(theme.palette.mode);
    return (
        <Tooltip title={tooltip} placement="right" arrow>
            <MenuItem
                active={selected === title}
                style={{
                    // color: selected === title ? '#4e57d4' : colors.grey[100],
                    backgroundColor: selected === title ? '#dfe4ea' : 'transparent',
                }}
                onClick={() => setSelected(title)}
                icon={icon}
            >
                <Typography>{title}</Typography>
                <Link to={to} />
            </MenuItem>
        </Tooltip>
    );
};

const Sidebar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { t } = useTranslation('sidebar');
    const [isCollapsed, setIsCollapsed] = useState(() => JSON.parse(localStorage.getItem('sidebarCollapsed')) || false);
    const [selected, setSelected] = useState(() => localStorage.getItem('selectedMenuItem') || 'Dashboard');

    const isInitialMountCollapsed = useRef(true);
    const isInitialMountSelected = useRef(true);

    useEffect(() => {
        if (isInitialMountCollapsed.current) {
            isInitialMountCollapsed.current = false;
        } else {
            localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
        }
    }, [isCollapsed]);

    useEffect(() => {
        if (isInitialMountSelected.current) {
            isInitialMountSelected.current = false;
        } else {
            localStorage.setItem('selectedMenuItem', selected);
        }
    }, [selected]);

    function stringToColor(string) {
        let hash = 0;
        for (let i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    }

    function stringAvatar(name = 'nth') {
        if (name === '') {
            name = 'nothing';
        }
        let words = name.split(' ');
        let firstChar = '';
        let lastChar = '';
        if (words.length === 1) {
            firstChar = words[0][0];
        } else {
            firstChar = words[0][0];
            lastChar = words[words.length - 1][0];
        }
        return {
            sx: {
                bgcolor: stringToColor(name[0]),
            },
            children: `${firstChar}${lastChar}`,
        };
    }

    const isAdminOrSuperAdmin =
        localStorage.getItem('Role') === 'admin' || localStorage.getItem('Role') === 'super_admin';

    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogout = () => {
        const confirm = window.confirm('Are you sure to logout of this system?');
        if (confirm) {
            localStorage.setItem('Infor', JSON.stringify(''));
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('selectedMenuItem');
            localStorage.setItem('Name', '');
            localStorage.setItem('Email', JSON.stringify(''));
            localStorage.setItem('Role', '');

            dispatch({ type: 'logout' });

            history.push('/');
        } else {
            return;
        }
    };

    return (
        <Box
            sx={{
                '& .pro-sidebar-inner': {
                    backgroundColor: `var(--body_background)`,
                    height: '100vh',
                    position: 'sticky',
                    top: '0',
                    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
                },
                '& .pro-icon-wrapper': {
                    backgroundColor: 'transparent !important',
                },
                '& .pro-inner-item': {
                    padding: '5px 35px 5px 20px !important',
                    color: 'var(--icon-color)',
                },
                '& .pro-inner-item:hover': {
                    color: '#868dfb !important',
                },
                '& .pro-menu-item.active': {
                    color: '#6870fa !important',
                },
            }}
        >
            <ProSidebar collapsed={isCollapsed}>
                <Menu iconShape="square">
                    <MenuItem
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                        style={{
                            margin: '10px 0 20px 0',
                            color: colors.grey[100],
                        }}
                    >
                        {!isCollapsed && (
                            <Box display="flex" justifyContent="space-between" alignItems="center" ml="15px">
                                <Typography variant="h3" color={colors.grey[100]}>
                                    <img
                                        alt="profile-user"
                                        width="100px"
                                        height="auto"
                                        src={`../../assets/fptnew.png`}
                                    />
                                </Typography>
                                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                                    <MenuOutlinedIcon />
                                </IconButton>
                            </Box>
                        )}
                    </MenuItem>
                    {!isCollapsed && (
                        <Box mb="25px">
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <Avatar
                                    alt="Remy Sharp"
                                    {...stringAvatar(localStorage.getItem('Name') || '')}
                                    sx={{ fontSize: 50, width: 120, height: 120 }}
                                />
                            </Box>
                            <Box textAlign="center">
                                <div>
                                    <Typography
                                        variant="h2"
                                        color={colors.grey[100]}
                                        fontWeight="bold"
                                        sx={{ m: '10px 0 0 0' }}
                                        className="username"
                                        title={localStorage.getItem('Name') || ''}
                                    >
                                        {localStorage.getItem('Name') || ''}
                                    </Typography>
                                </div>
                                <Typography variant="h5" color={colors.greenAccent[500]}>
                                    {localStorage.getItem('Role')}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    <Box paddingLeft={isCollapsed ? undefined : '1%'}>
                        <Item
                            title={t('title.dashboard')}
                            to="/admin/dashboard"
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            tooltip="Dashboard"
                        />
                        {isAdminOrSuperAdmin && (
                            <>
                                <Item
                                    title={t('title.university')}
                                    to="/admin/university"
                                    icon={<SchoolIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                    tooltip="University Managerment"
                                />
                                <Item
                                    title={t('title.student')}
                                    to="/admin/student"
                                    icon={<SolutionOutlined />}
                                    selected={selected}
                                    setSelected={setSelected}
                                    tooltip="Student Managerment"
                                />
                                <Item
                                    title={t('title.register')}
                                    to="/register"
                                    icon={<SignatureOutlined />}
                                    selected={selected}
                                    setSelected={setSelected}
                                    tooltip="Register Account"
                                />
                            </>
                        )}
                        {localStorage.getItem('Role') === 'user' && (
                            <>
                                <Item
                                    title="Profile"
                                    to="/admin/profile"
                                    icon={<ContactsOutlinedIcon />}
                                    selected={selected}
                                    setSelected={setSelected}
                                    tooltip="Profile"
                                />
                            </>
                        )}
                    </Box>
                    <MenuItem
                        onClick={handleLogout}
                        className="logout-item"
                        style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '0',
                            width: '100%',
                            borderTop: '1px solid #ccc',
                            padding: '10px 20px',
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1.2em"
                            height="1.2em"
                            color="crimson"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="#ff4d4f"
                                d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
                            />
                        </svg>
                        <span style={{ color: '#ff4d4f' }}> Logout</span>
                    </MenuItem>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default Sidebar;
