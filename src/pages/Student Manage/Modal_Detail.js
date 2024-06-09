import React, { useState, useEffect } from 'react';
import { WarningFilled } from '@ant-design/icons';
import { get, ref, child } from 'firebase/database';
import { Table, Descriptions, Spin, Modal } from 'antd';
import './css/modal_detail.css';
import 'antd/dist/reset.css';
import { database } from '../firebaseConfig.js';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
const ModalDetail = ({ visible, onClose, student, studentUnicode }) => {
    const [university, setUniversity] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation('detailstudent');
    useEffect(() => {
        const fetchData = async () => {
            if (visible && student && student.uniCode) {
                setLoading(true);
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
                    }
                }
                setLoading(false);

                setUniversity(uniDatas);
            } else {
                setLoading(false);
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
            onCancel={() => {
                setLoading(true);
                onClose();
            }}
            footer={null}
        >
            <Descriptions column={3}>
                {items.map((item) => (
                    <Descriptions.Item key={item.key} label={item.label}>
                        {item.children}
                    </Descriptions.Item>
                ))}
            </Descriptions>
            <Spin spinning={loading}>
                {studentUnicode ? (
                    <>
                        <h4>{t('title.list')}</h4>
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
                            scroll={{ x: false, y: 'calc(100vh - 480px)' }}
                            rowHoverable={false}
                        />
                    </>
                ) : (
                    <h4 className="description">
                        {t('title.notRegist')}
                        <WarningFilled style={{ marginLeft: '5px' }} />
                    </h4>
                )}
            </Spin>
        </Modal>
    );
};

export default ModalDetail;
