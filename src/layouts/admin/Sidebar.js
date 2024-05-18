import React, { useState, useEffect } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import { tokens } from '../../theme';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
// import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import {SignatureOutlined, SolutionOutlined} from '@ant-design/icons' 
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import SchoolIcon from '@mui/icons-material/School';
import { SignatureOutlined, SolutionOutlined } from '@ant-design/icons';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { merge } from '@mui/system';
// import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
// import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
// import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
// import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
// import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
// import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";

const Item = ({ title, to, icon, selected, setSelected, tooltip }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Tooltip title={tooltip} placement="right" arrow>
            <MenuItem
                active={selected === title}
                style={{
                    color: colors.grey[100],
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
    const [role, setRole] = useState('');
    // const us=JSON.parse(localStorage.getItem('Infor'))
    const [username, setUsername] = useState(JSON.parse(localStorage.getItem('Infor')));
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const collapsedState = localStorage.getItem('sidebarCollapsed');
        return collapsedState ? JSON.parse(collapsedState) : false;
    });
    const [selected, setSelected] = useState(() => {
        const storedSelected = localStorage.getItem('selectedMenuItem');
        return storedSelected ? storedSelected : 'Dashboard';
    });
    useEffect(() => {
        setUsername(JSON.parse(localStorage.getItem('Infor')));
    }, [username]);
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
    }, [isCollapsed]);

    useEffect(() => {
        localStorage.setItem('selectedMenuItem', selected);
    }, [selected]);
    useEffect(() => {
        setRole(localStorage.getItem('Role'));
    }, [role]);
    return (
        <Box
            sx={{
                '& .pro-sidebar-inner': {
                    background: `${colors.primary[400]} !important`,
                    height: '100vh',
                    // boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.5)',
                    // position: 'relative',
                    position: '-webkit-sticky',
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
                    {/* LOGO AND MENU ICON */}
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
                                <img
                                    alt="profile-user"
                                    width="100px"
                                    height="100px"
                                    src={`../../assets/avatar.png`}
                                    style={{ cursor: 'pointer', borderRadius: '50%' }}
                                />
                            </Box>
                            <Box textAlign="center">
                                <Typography
                                    variant="h2"
                                    color={colors.grey[100]}
                                    fontWeight="bold"
                                    sx={{ m: '10px 0 0 0' }}
                                >
                                    {username.name}
                                </Typography>
                                <Typography variant="h5" color={colors.greenAccent[500]}>
                                    {role}
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    <Box paddingLeft={isCollapsed ? undefined : '1%'}>
                        <Item
                            title="Dashboard"
                            to="/admin/dashboard"
                            icon={<HomeOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            tooltip="Dashboard"
                        />
                        <Item
                            title="University Managerment"
                            to="/admin/university"
                            icon={<SchoolIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            tooltip="University Managerment"
                        />
                        <Item
                            title="Student Managerment"
                            to="/admin/student"
                            icon={<SolutionOutlined />}
                            selected={selected}
                            setSelected={setSelected}
                            tooltip="Student Managerment"
                        />
                        <Item
                            title="Profile"
                            to="/admin/profile"
                            icon={<ContactsOutlinedIcon />}
                            selected={selected}
                            setSelected={setSelected}
                            tooltip="Profile"
                        />
                        <Item
                            title="Register Account"
                            to="/register"
                            icon={<SignatureOutlined />}
                            selected={selected}
                            setSelected={setSelected}
                            tooltip="Register Account"
                        />
                    </Box>
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default Sidebar;
