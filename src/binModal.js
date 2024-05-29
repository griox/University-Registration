import React, { useState, useEffect } from 'react';
import { get, ref, child } from 'firebase/database';
import { Divider, Table, Descriptions, Spin, Modal } from 'antd';
import './css/modal_detail.css';
import { database } from '../firebaseConfig.js';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const ModalDetail = ({ visible, onClose, student, Loading, setLoading }) => {
    const columns = [
        {
            title: 'nameuni',
            dataIndex: 'nameU',
            key: 'nameU',
            width: '30%',
        },
        {
            title: 'unicode',
            dataIndex: 'uniCode',
            width: '13%',
            key: 'uniCode',
        },
        {
            title: 'address',
            dataIndex: 'address',
            filterSearch: true,
            editable: true,
            width: '20%',
            key: 'address',
        },
        {
            title: 'entrance',
            dataIndex: 'averageS',
            width: '15%',
            editable: true,
            sorter: (a, b) => a.averageS - b.averageS,
            key: 'averageS',
        },
    ];

    if (!visible) return null;
    const items = [
        {
            key: '1',
            label: 'id',
            children: student.id,
        },
        {
            key: '2',
            label: 'name',
            children: student.name,
        },
        {
            key: '3',
            label: 'gender',
            children: student.gender,
        },
        {
            key: '4',
            label: 'gender',
            children: student.dateObirth,
        },
        {
            key: '5',
            label: 'gender',
            children: student.placeOBirth,
        },
        {
            key: '6',
            label: 'gender',
            children: student.email,
        },
        {
            key: '7',
            label: 'gender',
            children: student.enthicity,
        },
    ];
    return (
        <Modal
            className="Modal"
            open={visible}
            width={970}
            height={400}
            title={'modal'}
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
            <h4>{'list'}</h4>
            <Spin spinning={Loading}>
                <Table
                    columns={columns}
                    dataSource={[]}
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
