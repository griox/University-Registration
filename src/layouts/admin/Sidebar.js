import React, { useState, useEffect, useRef } from 'react';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme, Tooltip, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import 'react-pro-sidebar/dist/css/styles.css';
import { tokens } from '../../theme';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { SaveOutlined, SignatureOutlined, SolutionOutlined, UploadOutlined } from '@ant-design/icons';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import SchoolIcon from '@mui/icons-material/School';
import { storage } from '../../pages/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
    const [role, setRole] = useState(localStorage.getItem('Role') || '');
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState(null);
    const [username, setUsername] = useState(() => JSON.parse(localStorage.getItem('Infor')) || {});
    const [isCollapsed, setIsCollapsed] = useState(() => JSON.parse(localStorage.getItem('sidebarCollapsed')) || false);
    const [selected, setSelected] = useState(() => localStorage.getItem('selectedMenuItem') || 'Dashboard');

    const isInitialMountCollapsed = useRef(true);
    const isInitialMountSelected = useRef(true);

    const handleImgChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (!image) return;
        const imgRef = ref(storage, `images/${image.name}`);
        uploadBytes(imgRef, image)
            .then(() => getDownloadURL(imgRef))
            .then((downLoadUrl) => {
                setUrl(downLoadUrl);
                setImage(null);
            })
            .catch((error) => {
                console.log(error.message, 'Error');
            });
    };

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
                bgcolor: stringToColor(name),
            },
            children: `${firstChar}${lastChar}`,
        };
    }

    const isAdminOrSuperAdmin = role === 'admin' || role === 'super_admin';

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
                                    <img alt="profile-user" width="100px" height="auto" src={`../../assets/fptnew.png`} />
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
                                    src={url}
                                    {...stringAvatar(username.name)}
                                    sx={{ fontSize: 50, width: 120, height: 120 }}
                                />
                            </Box>
                            <Box textAlign="center">
                                <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ m: '10px 0 0 0' }}>
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
                        {isAdminOrSuperAdmin && (
                            <>
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
                                    title="Register Account"
                                    to="/register"
                                    icon={<SignatureOutlined />}
                                    selected={selected}
                                    setSelected={setSelected}
                                    tooltip="Register Account"
                                />
                            </>
                        )}
                        {role === 'user' && (
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
                </Menu>
            </ProSidebar>
        </Box>
    );
};

export default Sidebar;
