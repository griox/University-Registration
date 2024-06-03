import { get, ref, child } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Descriptions, Divider, Table, Form,Spin } from 'antd';
import { database } from '../firebaseConfig.js';
import './css/Modal_detail.css';
import { useTranslation } from 'react-i18next';

export const Form_Detail = ({ university,loading,setLoading }) => {
    const [student, setStudents] = useState([]);
    const [ form] = Form.useForm();
    const student_regist = university.registeration;
    const { t } = useTranslation('detailuniversity');

    const cancel = () => {
        form.resetFields();
    };
    const items = [
        {
            key: '1',
            label: t('label.unicode'),
            children: university.uniCode,
        },
        {
            key: '2',
            label: t('label.entrance'),
            children: university.averageS,
        },
        {
            key: '3',
            label: t('label.regis'),
            children: university.isRegistered,
        },
        {
            key: '4',
            label: t('label.target'),
            children: university.target,
        },
        {
            key: '5',
            label: t('label.address'),
            children: university.address,
        },
        {
            key: '6 ',
            label: t('label.uniname'),
            children: university.nameU,
        },
    ];
    const colums = [
        {
            title: t('title.id'),
            dataIndex: 'id',
            width: '10%',
            fixed: 'left',
        },

        {
            title: t('title.name'),
            dataIndex: 'name',
            width: '19%',
            editable: true,
            fixed: 'left',
            key: 'name',
        },
        {
            title: t('title.email'),
            dataIndex: 'email',
            width: '15%',
        },
        {
            title: t('title.math'),
            dataIndex: 'MathScore',
            width: '10%',
            editable: true,

            sorter: (a, b) => a.MathScore - b.MathScore,
        },
        {
            title: t('title.literature'),
            dataIndex: 'LiteratureScore',
            width: '11%',
            editable: true,

            sorter: (a, b) => a.LiteratureScore - b.LiteratureScore,
        },
        {
            title: t('title.english'),
            dataIndex: 'EnglishScore',
            width: '10%',
            editable: true,

            sorter: (a, b) => a.EnglishScore - b.EnglishScore,
        },
        {
            title: t('title.average'),
            dataIndex: 'AverageScore',
            width: '10%',
            sorter: (a, b) => a.AverageScore - b.AverageScore,
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (student_regist && typeof student_regist === 'object') { 
                const studentList = Object.values(student_regist).map((student) => student.id);
                const studentsData = [];
                for (const studentId of studentList) {
                    const studentRef = child(ref(database), `Detail/${studentId}`);
                    try {
                        const snapshot = await get(studentRef);
                        if (snapshot.exists()) {
                            const studentData = snapshot.val();
                            studentsData.push({ id: studentId, ...studentData });
                        }
                    } catch (error) {
                        toast.error('Cannot fetch student details')
                    }
                }
                setLoading(false);
                setStudents(studentsData);
            } else {
                toast.error('There are not any students in this school')
            }
        };
        fetchData();
    }, [student_regist, setLoading]);
    
    return (
        <>
            <Descriptions title={t('title.uniinf')} column={2}>
                {items.map((item) => (
                    <Descriptions.Item key={item.key} label={item.label}>
                        {item.children}
                    </Descriptions.Item>
                ))}
            </Descriptions>
            <Divider />
            <h4>{t('title.list')}</h4>
            <Form form={form} component={false}>
                <Spin spinning={loading} >
                <Table className='table'
                    bordered
                    dataSource={student}
                    columns={colums}
                    scroll={{
                        x: 900,
                        y: 'calc(100vh - 580px)',
                    }}
                    showSorterTooltip={{
                        target: 'sorter-icon',
                    }}
                    pagination={{
                        onChange: cancel,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                />
                </Spin>
                
            </Form>
        </>
    );
};
export default Form_Detail;
