import React, { useState, useEffect, useRef, useContext } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme, Tooltip, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import { tokens } from '../../theme';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { SignatureOutlined, SolutionOutlined } from '@ant-design/icons';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import SchoolIcon from '@mui/icons-material/School';
import { MenuContext } from '../../pages/MenuContext';

const Item = ({ title, to, icon, selected, setSelected, tooltip }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { selectedMenuItem, setSelectedMenuItem } = useContext(MenuContext);
    return (
        <Tooltip title={tooltip} placement="right" arrow>
            <MenuItem
                active={selectedMenuItem === title}
                style={{
                    color: colors.grey[100],
                }}
                onClick={() => setSelectedMenuItem(title)}
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

    const [isCollapsed, setIsCollapsed] = useState(() => JSON.parse(localStorage.getItem('sidebarCollapsed')) || false);

    const isInitialMountCollapsed = useRef(true);

    useEffect(() => {
        if (isInitialMountCollapsed.current) {
            isInitialMountCollapsed.current = false;
        } else {
            localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
        }
    }, [isCollapsed]);

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
        let words = name[0].split(' ');
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

    return (
        <Box
            sx={{
                '& .pro-sidebar-inner': {
                    background: `${colors.primary[400]} !important`,
                    height: '100vh',
                    position: 'sticky',
                    top: '0',
                },
                '& .pro-icon-wrapper': {
                    backgroundColor: 'transparent !important',
                },
                '& .pro-inner-item': {
                    padding: '5px 35px 5px 20px !important',
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
                                <Typography
                                    variant="h2"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                    sx={{ m: '10px 0 0 0' }}
                                >
                                    {localStorage.getItem('Name') || ''}
                                </Typography>
                                <Typography variant="h5" color={colors.greenAccent[500]}>
                                    {localStorage.getItem('Role')}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                    <Box paddingLeft={isCollapsed ? undefined : '1%'}>
                        <Item title="Dashboard" to="/admin/dashboard" icon={<HomeOutlinedIcon />} tooltip="Dashboard" />
                        {isAdminOrSuperAdmin && (
                            <>
                                <Item
                                    title="University Managerment"
                                    to="/admin/university"
                                    icon={<SchoolIcon />}
                                    tooltip="University Managerment"
                                />
                                <Item
                                    title="Student Managerment"
                                    to="/admin/student"
                                    icon={<SolutionOutlined />}
                                    tooltip="Student Managerment"
                                />
                                <Item
                                    title="Register Account"
                                    to="/register"
                                    icon={<SignatureOutlined />}
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
                                    tooltip="Profile"
                                />
                            </>
                        )}
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default Sidebar;
