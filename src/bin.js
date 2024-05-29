import { Avatar, Badge, Button, Dropdown, Menu, Modal, Space } from 'antd';
import { BellOutlined, DownOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { firebaseConfig } from './constants/constants';
import { initializeApp } from 'firebase/app';
import { child, get, getDatabase, ref } from 'firebase/database';

const menu = (
    <Menu>
        <Menu.Item key="1">Notification 1</Menu.Item>
        <Menu.Item key="2">Notification 2</Menu.Item>
        <Menu.Item key="3">Notification 3</Menu.Item>
    </Menu>
);

const Bin = () => {
    const [ino, setIno] = useState({});
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 3000);
    };
    const handleCancel = () => {
        setOpen(false);
    };
    const menu = (
        <Menu>
            <Menu.Item key="1" onClick={showModal}>
                Option 1
            </Menu.Item>
            <Menu.Item key="2">Option 2</Menu.Item>
            <Menu.Item key="3">Option 3</Menu.Item>
        </Menu>
    );
    const items = [
        {
            label: <h1 onClick={showModal}>quang</h1>,
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            label: '3rd menu item',
            key: '3',
        },
    ];
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    useEffect(() => {
        const g = () => {
            get(child(ref(db), `Detail/SV398`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    // Object.values(x)
                    //     .map((item) => item)
                    //     .forEach((item) => {
                    //         setIno((prev) => [...prev, item]);
                    //     });
                    setIno(x.inotification.nb1 === undefined ? [] : x.inotification.nb1);
                } else {
                    console.log('No data available');
                }
            });
        };
        const timer = setTimeout(g, 100);
        return () => clearTimeout(timer);
    }, [db]);
    return (
        <div style={{ marginTop: '50px', cursor: 'pointer' }}>
            <Modal
                open={open}
                title="Title"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Return
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                        Submit
                    </Button>,
                    <Button key="link" href="https://google.com" type="primary" loading={loading} onClick={handleOk}>
                        Search on Google
                    </Button>,
                ]}
            >
                {/* {console.log(ino)} */}
                <p>Date: {ino.date === undefined ? 'trong' : ino.date}</p>
                <p>Date: {ino.from === undefined ? 'trong' : ino.from}</p>
                <p>Date: {ino.type === undefined ? 'trong' : ino.type}</p>

                {/* <p>From: {ino.nb1.from !== undefined ? ino.nb1.date : 'trống'}</p>
                <p>Type: {ino.nb1.type !== undefined ? ino.nb1.type : 'trống'}</p> */}
            </Modal>
            <Dropdown
                menu={{
                    items,
                }}
                trigger={['click']}
            >
                <Badge count={items.length}>
                    <Space>
                        <BellOutlined style={{ fontSize: '50px' }} />
                    </Space>
                </Badge>
            </Dropdown>
        </div>
    );
};

export default Bin;
