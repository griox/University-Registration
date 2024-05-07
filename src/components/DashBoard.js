import React, { useState } from 'react';
import logo from '../img/FPTnew.png';
import '../style/main.css';
import { Link, NavLink } from 'react-router-dom';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    DashboardOutlined,
    BankOutlined,
    LogoutOutlined,
    PlusCircleOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Button, Layout, Menu, theme, Avatar } from 'antd';
const { Header, Sider, Content, Footer } = Layout;
const DashBoard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState('dashboard'); // Trạng thái mặc định khi trang được tải là dashboard
    const [openKeys, setOpenKeys] = useState([]); // Danh sách các menu cha mở ra
    const handleMenuClick = ({ key }) => {
        setSelectedMenu(key);
    };

    const handleMenuOpenChange = (keys) => {
        setOpenKeys(keys);
    };

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [userInfo, setUserInfo] = useState({
        username: 'Demo User',
        avatar: 'https://obs.multicampus.vn/wp-content/uploads/avatars/1/5c2ecfd10c228-bpfull.png',
    });
    return (
        <Layout>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    left: 0,
                }}
            >
                <div className="logo">
                    <img src={logo} alt="logo" style={{ width: '150px', height: 'auto' }} />
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['dashboard']}
                    selectedKeys={[selectedMenu]}
                    openKeys={openKeys}
                    onSelect={handleMenuClick}
                    onOpenChange={handleMenuOpenChange}
                >
                    <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                        <Link to="/">Bảng Điều Khiển</Link>
                    </Menu.Item>
                    <Menu.SubMenu key="school" icon={<BankOutlined />} title="Quản lý trường">
                        <Menu.Item key="addSchool">
                            <NavLink to="/addSchool">Thêm trường</NavLink>
                        </Menu.Item>
                        <Menu.Item key="listSchool">
                            <NavLink to="/listSchool">Danh sách trường</NavLink>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.SubMenu key="student" icon={<UserOutlined />} title="Quản lý học sinh">
                        <Menu.Item key="addStudent">
                            <NavLink to="/addStudent">Thêm học sinh</NavLink>
                        </Menu.Item>
                        <Menu.Item key="listStudent">
                            <NavLink to="/listStudent">Danh sách học sinh</NavLink>
                        </Menu.Item>
                    </Menu.SubMenu>
                    <Menu.Item key="studentDetail" icon={<UserOutlined />}>
                        <NavLink to="/studentDetail">Chi tiết học sinh</NavLink>
                    </Menu.Item>
                    <Menu.Item key="register" icon={<PlusCircleOutlined />}>
                        <NavLink to="/Register">Đăng ký tài khoản</NavLink>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header
                    className="site-layout-background"
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            float: 'right',
                            marginRight: '16px',
                        }}
                    >
                        <Button
                            type="text"
                            icon={<HomeOutlined />}
                            style={{
                                float: 'left',
                                marginRight: '680px',
                                color: '#333',
                            }}
                        >
                            <Link to="/">Home</Link>
                        </Button>
                        <Avatar src={userInfo.avatar} style={{ marginRight: '8px' }} />
                        <span style={{ color: '#333' }}>{userInfo.username}</span>
                        <Button
                            type="text"
                            icon={<LogoutOutlined />}
                            style={{
                                marginLeft: '16px',
                                color: 'crimson',
                            }}
                        >
                            LogOut
                        </Button>
                    </div>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>{selectedMenu}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {selectedMenu === 'dashboard' && 'Dashboard Page'}
                        {selectedMenu === 'addSchool' && 'Add School Page'}
                        {selectedMenu === 'listSchool' && 'List School Page'}
                        {selectedMenu === 'addStudent' && 'Add Student Page'}
                        {selectedMenu === 'listStudent' && 'List Student Page'}
                        {selectedMenu === 'studentDetail' && 'Student Detail Page'}
                        {selectedMenu === 'register' && 'Register Page'}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                        background: 'lightcyan',
                    }}
                >
                    System School Managerment ©{new Date().getFullYear()} Design By Group B
                </Footer>
            </Layout>
        </Layout>
    );
};
export { DashBoard };
