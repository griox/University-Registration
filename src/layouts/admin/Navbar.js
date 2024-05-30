import React, { useEffect, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Badge, Button, Dropdown, Modal, Space, Spin, Table } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { locales } from '../../translation/i18n';
import DarkMode from '../../components/Darkmode/Darkmode';
import { addDoc, collection, doc, getFirestore, onSnapshot, orderBy, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../constants/constants';
import { query } from 'firebase/database';

const Navbar = () => {
    const { t, i18n } = useTranslation('navbar');
    const currentLanguage = locales[i18n.language === 'vi' ? 'vi' : 'en'];
    const dispatch = useDispatch();
    const history = useHistory();
    const userRole = localStorage.getItem('Role');
    const [tableLoading, setTableLoading] = useState(false);
    // const currentLanguage = locales[i18n.language];
    const handleLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    const items = [
        {
            label: t('title.setting'),
            key: '1',
            icon: <SettingsOutlinedIcon />,
            children: [
                {
                    key: '1.1',
                    label: t('button.change password'),
                    icon: (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="1.2em"
                            height="1.2em"
                            viewBox="0 0 32 32"
                            bgcolor="var(--body_background)"
                        >
                            <path
                                fill="currentColor"
                                d="M21 2a8.998 8.998 0 0 0-8.612 11.612L2 24v6h6l10.388-10.388A9 9 0 1 0 21 2m0 16a7 7 0 0 1-2.032-.302l-1.147-.348l-.847.847l-3.181 3.181L12.414 20L11 21.414l1.379 1.379l-1.586 1.586L9.414 23L8 24.414l1.379 1.379L7.172 28H4v-3.172l9.802-9.802l.848-.847l-.348-1.147A7 7 0 1 1 21 18"
                            />
                            <circle cx="22" cy="10" r="2" fill="currentColor" />
                        </svg>
                    ),
                },
                {
                    key: '1.2',
                    label: 'Language',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2m6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8M12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96M4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2c0 .68.06 1.34.14 2zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16m2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8M12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96M14.34 14H9.66c-.09-.66-.16-1.32-.16-2c0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2c0 .68-.07 1.34-.16 2m.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M16.36 14c.08-.66.14-1.32.14-2c0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2z"
                            />
                        </svg>
                    ),
                    children: [
                        {
                            key: '1.2.1',
                            label: currentLanguage === 'Tiếng việt' ? 'Tiếng việt' : 'Vietnamese',
                            icon: (
                                <img
                                    width="20"
                                    height="20"
                                    src="https://img.icons8.com/color/48/vietnam.png"
                                    alt="vietnam"
                                />
                            ),
                        },
                        {
                            key: '1.2.2',
                            label: currentLanguage === 'Tiếng việt' ? 'Tiếng anh' : 'Egnlish',
                            icon: (
                                <img width="20" height="20" src="https://img.icons8.com/color/48/usa.png" alt="usa" />
                            ),
                        },
                    ],
                },
            ],
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
        if (e.key === '1.1') {
            history.push('/changepass');
        } else if (e.key === 'logout') {
            handleLogout();
        } else if (e.key === '1.2.1') {
            handleLanguage('vi');
        } else if (e.key === '1.2.2') {
            handleLanguage('en');
        } else {
            toast.error('Your reques is failed');
        }
    };

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    const [l, setL] = useState([]);
    const [e, setE] = useState([]);
    const [ino, setIno] = useState(null);

    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
        if (l.length !== 0) {
            l.forEach((item) => {
                updateDoc(doc(db, 'cities', item.id), {
                    seen: true,
                });
            });
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    useEffect(() => {
        const g = () => {
            setTableLoading(true);
            onSnapshot(query(collection(db, 'cities'), orderBy('time', 'desc')), (snapshot) => {
                const x = snapshot.docs.map((doc) => doc);
                setE(x.map((item) => item.data()));
                setL(x.filter((item) => item.data().seen === false));
            });
            setTableLoading(false);
        };
        g();
    }, [db, e]);

    const handleIdClick = (record) => {
        setIno(record);
        setLoad(!load);
    };
    const columns = [
        {
            title: 'name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            render: (_, record) => (
                <span onClick={() => handleIdClick(record)} className="idOnClick">
                    {record.name}
                </span>
            ),
        },
    ];
    const [load, setLoad] = useState(false);
    const handleO = () => {
        setLoad(false);
    };

    const handleCance = () => {
        setLoad(false);
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
            color="var(--body_color)"
        >
            <Box display="flex" alignItems="center"></Box>

            <Box display="flex">
                <Space wrap>
                    {userRole !== 'user' ? (
                        ''
                    ) : (
                        <div style={{ cursor: 'pointer' }}>
                            <Modal open={open} title="Title" onCancel={handleCancel} footer={null}>
                                <Modal title="Basic Modal" open={load} onCancel={handleCance} footer={null}>
                                    {ino && (
                                        <div>
                                            <p>Name: {ino.name}</p>
                                            <p>Country: {ino.country}</p>
                                            <p>State:{ino.state}</p>
                                        </div>
                                    )}
                                </Modal>
                                <Table
                                    columns={columns}
                                    dataSource={e}
                                    pagination={{
                                        defaultPageSize: '10',
                                        pageSizeOptions: ['10', '20', '40', '100'],
                                        showSizeChanger: true,
                                        showQuickJumper: true,
                                        showTotal: (total) => `Total ${total} items`,
                                    }}
                                    scroll={{ x: false, y: 'calc(100vh - 580px)' }}
                                    bordered
                                />
                            </Modal>

                            <Badge count={l.length} onClick={showModal}>
                                <Space>
                                    <BellOutlined style={{ fontSize: '30px' }} />
                                </Space>
                            </Badge>
                        </div>
                    )}

                    <DarkMode />
                    <Dropdown menu={menuProps}>
                        <IconButton>
                            <Space>
                                <UserOutlined style={{ color: 'var(--body_color)' }} />
                            </Space>
                        </IconButton>
                    </Dropdown>
                </Space>
            </Box>
        </Box>
    );
};

export default Navbar;
