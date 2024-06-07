import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import { Dropdown, Space, Menu } from 'antd';
import { UserOutlined, BellOutlined } from '@ant-design/icons';
import { Badge, Modal, Table } from 'antd';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { locales } from '../../translation/i18n';
import DarkMode from '../../components/Darkmode/Darkmode';
import '../css/navbar.css';
import { collection, doc, getFirestore, onSnapshot, orderBy, updateDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../constants/constants';
import { query } from 'firebase/database';
import { Chat } from '../../pages/ChatRoom/Chat';
const Navbar = () => {
    const [iconLoading, setIconLoading] = useState(false);
    const { t, i18n } = useTranslation('navbar');
    const currentLanguage = locales[i18n.language === 'vi' ? 'vi' : 'en'];
    const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage === 'Tiếng anh' ? 'Tiếng anh' : 'English');
    const history = useHistory();
    const userRole = localStorage.getItem('Role');
    const handleLanguage = (lng, label) => {
        i18n.changeLanguage(lng);
        setSelectedLanguage(label);
    };
    const items_lng = [
        {
            key: '1',
            label: currentLanguage === 'Tiếng việt' ? 'Tiếng anh' : 'English',
            icon: <img width="20" height="20" src="https://img.icons8.com/color/48/usa.png" alt="usa" />,
            onClick: () => handleLanguage('en', currentLanguage === 'VietNam' ? 'English' : 'English'),
        },
        {
            key: '2',
            label: currentLanguage === 'Tiếng việt' ? 'Tiếng việt' : 'Vietnam',
            icon: <img width="20" height="20" src="https://img.icons8.com/color/48/vietnam.png" alt="vietnam" />,
            onClick: () => handleLanguage('vi', currentLanguage === 'Tiếng việt' ? 'Tiếng việt' : 'Vietnam'),
        },
    ];
    const items = [
        {
            key: '3.1',
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
    ];

    const handleMenuClick = (e) => {
        if (e.key === '3.1') {
            history.push('/changepass');
        } else {
            toast.error('Your request is failed');
        }
    };

    const [l, setL] = useState([]);
    const [e, setE] = useState([]);
    const [ino, setIno] = useState(null);

    const [open, setOpen] = useState(false);
    const showModal = () => {
        setIconLoading(true);
        setOpen(true);
        if (l.length !== 0) {
            l.forEach((item) => {
                updateDoc(doc(db, 'cities', item.id), {
                    seen: true,
                }).then(() => setIconLoading(false));
            });
        } else {
            setIconLoading(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    useEffect(() => {
        const g = () => {
            onSnapshot(query(collection(db, 'cities'), orderBy('time', 'desc')), (snapshot) => {
                const x = snapshot.docs.map((doc) => doc);
                setE(x.map((item) => item.data()));
                setL(x.filter((item) => item.data().seen === false));
            });
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

    const handleCance = () => {
        setLoad(false);
    };

    const languageMenu = (
        <Menu>
            {items_lng.map((item) => (
                <Menu.Item key={item.key} onClick={item.onClick}>
                    {item.icon}&nbsp;{item.label}
                </Menu.Item>
            ))}
        </Menu>
    );

    const userMenu = (
        <Menu onClick={handleMenuClick}>
            {items.map((item) => (
                <Menu.Item key={item.key} danger={item.danger}>
                    {item.icon}&nbsp;{item.label}
                </Menu.Item>
            ))}
        </Menu>
    );

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
            boxShadow=" 0 7px 25px 0 rgba(0, 0, 0, 0.4)"
            p={2}
            color="var(--body_color)"
        >
            <Box display="flex" alignItems="center">
                <span style={{ color: 'var(--body-color)', fontSize: '1.5rem' }}>Student Management</span>
            </Box>

            <Box display="flex">
                <Space wrap>
                    {userRole !== 'user' ? (
                        ''
                    ) : (
                        <div style={{ cursor: 'pointer' }}>
                            <Modal
                                open={open}
                                title={t('title.noti')}
                                onCancel={handleCancel}
                                footer={null}
                                width={800}
                            >
                                <Modal title="basic_modal" open={load} onCancel={handleCance} footer={null} width={600}>
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

                            <Badge count={l.length}>
                                <Space>
                                    <BellOutlined
                                        style={{ fontSize: '30px', color: 'var(--body_color)' }}
                                        spin={iconLoading}
                                        onClick={showModal}
                                    ></BellOutlined>
                                </Space>
                            </Badge>
                        </div>
                    )}
                    <Chat />
                    <Dropdown overlay={languageMenu} trigger={['click']} placement="bottomRight">
                        <Space className="title-drop1" style={{ cursor: 'pointer', padding: '15px' }}>
                            {selectedLanguage}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1em"
                                height="1em"
                                fontSize="17px"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="white"
                                    d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2m6.93 6h-2.95a15.65 15.65 0 0 0-1.38-3.56A8.03 8.03 0 0 1 18.92 8M12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96M4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2c0 .68.06 1.34.14 2zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 0 1 5.08 16m2.95-8H5.08a7.987 7.987 0 0 1 4.33-3.56A15.65 15.65 0 0 0 8.03 8M12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96M14.34 14H9.66c-.09-.66-.16-1.32-.16-2c0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2c0 .68-.07 1.34-.16 2m.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M16.36 14c.08-.66.14-1.32.14-2c0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2z"
                                />
                            </svg>
                        </Space>
                    </Dropdown>
                    <DarkMode />
                    <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
                        <IconButton>
                            <UserOutlined style={{ color: 'var(--body_color)', fontSize: '30px' }} />
                        </IconButton>
                    </Dropdown>
                </Space>
            </Box>
        </Box>
    );
};

export default Navbar;
