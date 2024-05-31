import React, { useState, useEffect } from 'react';
import { get, ref, child } from 'firebase/database';
import { Divider, Table, Descriptions, Spin, Modal } from 'antd';
import './css/modal_detail.css';
import { database } from '../firebaseConfig.js';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
<<<<<<< HEAD

=======
>>>>>>> b42f746a830f8e11ded97461f0bb003eee446eaa
const ModalDetail = ({ visible, onClose, student, Loading, setLoading }) => {
    const [university, setUniversity] = useState([]);
    const { t } = useTranslation('detailstudent');
    useEffect(() => {
        const fetchData = async () => {
            if (visible && student && student.uniCode) {
                const uniRegist = student.uniCode;
                const uniDatas = [];
                for (const uniId of uniRegist) {
                    const uniRef = child(ref(database), `University/${uniId}`);
                    try {
                        const snapshot = await get(uniRef);
                        if (snapshot.exists()) {
                            const uniData = snapshot.val();
                            uniDatas.push({ uniCode: uniId, ...uniData });
                        }
                    } catch (error) {
                        toast.error('Cannot fetch data');
                        toast.error('Cannot fetch data');
                    }
                }
                setLoading(false);
                setUniversity(uniDatas);
            }
        };
        fetchData();
    }, [visible, student, setLoading]);
    const columns = [
        {
            title: t('title.nameuni'),
            dataIndex: 'nameU',
            key: 'nameU',
            width: '30%',
        },
        {
            title: t('title.unicode'),
            dataIndex: 'uniCode',
            width: '13%',
            key: 'uniCode',
        },
        {
            title: t('title.address'),
            dataIndex: 'address',
            filterSearch: true,
            editable: true,
            width: '20%',
            key: 'address',
        },
        {
            title: t('title.entrance'),
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
            label: t('label.id'),
            children: student.id,
        },
        {
            key: '2',
            label: t('label.name'),
            children: student.name,
        },
        {
            key: '3',
            label: t('label.gender'),
            children: student.gender,
        },
        {
            key: '4',
            label: t('label.dofb'),
            children: student.dateObirth,
        },
        {
            key: '5',
            label: t('label.pofb'),
            children: student.placeOBirth,
        },
        {
            key: '6',
            label: t('label.email'),
            children: student.email,
        },
        {
            key: '7',
            label: t('label.enthicity'),
            children: student.enthicity,
        },
        {
            key: '8',
            label: t('label.addressuni'),
            children: student.Address,
        },
        {
            key: '9',
            label: t('label.identify'),
            children: student.idenNum,
        },
    ];
    return (
        <Modal
            className="Modal"
            open={visible}
            width={970}
            height={400}
            title={t('title.modal')}
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
            <h4>{t('title.list')}</h4>
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
                    rowHoverable={false}
                />
            </Spin>
        </Modal>
    );
};

export default ModalDetail;
