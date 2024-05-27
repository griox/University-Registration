import React, { useState, useEffect } from 'react';
import { get, ref, child, getDatabase } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { Divider, Table, Descriptions, Spin, Modal } from 'antd';
import './css/modal_detail.css'
import { toast } from 'react-toastify';
const ModalDetail = ({ visible, onClose, student, Loading, setLoading }) => {
    const [university, setUniversity] = useState([]);
    const firebaseConfig = {
        apiKey: 'AIzaSyD2_evQ7Wje0Nza4txsg5BE_dDSNgmqF3o',
        authDomain: 'mock-proeject-b.firebaseapp.com',
        databaseURL: 'https://mock-proeject-b-default-rtdb.firebaseio.com',
        projectId: 'mock-proeject-b',
        storageBucket: 'mock-proeject-b.appspot.com',
        messagingSenderId: '898832925665',
        appId: '1:898832925665:web:bb28598e7c70a0d73188a0',
    };
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    useEffect(() => {
        const fetchData = async () => {
            if (visible && student && student.uniCode) {
                const uniRegist = student.uniCode;
                const uniDatas = [];
                for (const uniId of uniRegist) {
                    const uniRef = child(ref(db), `University/${uniId}`);
                    try {
                        const snapshot = await get(uniRef);
                        if (snapshot.exists()) {
                            const uniData = snapshot.val();
                            uniDatas.push({ uniCode: uniId, ...uniData });
                        }
                    } catch (error) {
                        toast.error('Cannot fetch data');
                    }
                }
                setLoading(false);
                setUniversity(uniDatas);
            }
        };
        fetchData();
    }, [visible, student, db, setLoading]);
    const columns = [
        {
            title: 'Name',
            dataIndex: 'nameU',
            key: 'nameU',
            width: '30%',
        },
        {
            title: 'UniCode',
            dataIndex: 'uniCode',
            width: '13%',
            key:'uniCode'
        },
        {
            title: 'Address',
            dataIndex: 'address',
            filterSearch: true,
            editable: true,
            width: '20%',
            key:'address'
        },
        {
            title: 'Entrance score',
            dataIndex: 'averageS',
            width: '15%',
            editable: true,
            sorter: (a, b) => a.averageS - b.averageS,
            key:'averageS'
        },
    ];
    if (!visible) return null;
    const items = [
        {
            key: '1',
            label: 'ID',
            children: student.id,
        },
        {
            key: '2',
            label: 'Name',
            children: student.name,
        },
        {
            key: '3',
            label: 'Gender',
            children: student.gender,
        },
        {
            key: '4',
            label: 'Date of Birth',
            children: student.dateObirth,
        },
        {
            key: '5',
            label: 'Place Of Birth',
            children: student.placeOBirth,
        },
        {
            key: '6',
            label: 'Email',
            children: student.email,
        },
        {
            key: '7',
            label: 'Enthicity',
            children: student.enthicity,
        },
        {
            key: '8',
            label: 'Address',
            children: student.Address,
        },
        {
            key: '9',
            label: 'Indentify Number',
            children: student.idenNum,
        },
    ];
    return (
        <Modal
            className="Modal"
            open={visible}
            width={1000}
            title="Student's Information"
            onCancel={onClose}
            footer={null}
        >
            <Descriptions column={3}>
                {items.map((item) => (
                    <Descriptions.Item key={item.key} label={item.label}>
                        {item.children}
                    </Descriptions.Item>
                ))}
            </Descriptions>
            <Divider />
            <h4>University Registered</h4>
            <Spin spinning={Loading}>
                <Table
                    columns={columns}
                    dataSource={university}
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
            </Spin>
        </Modal>
    );
};

export default ModalDetail;
