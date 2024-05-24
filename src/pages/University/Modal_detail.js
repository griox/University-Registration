import { get, ref, child } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Descriptions, Divider, Table, Form,Spin } from 'antd';
import { database } from '../firebaseConfig.js';
import './css/Modal_detail.css';

export const Form_Detail = ({ university,loading,setLoading }) => {
    const [student, setStudents] = useState([]);
    const [form] = Form.useForm();
    const student_regist = university.registeration;
    const cancel = () => {
        form.resetFields();
    };
    const items = [
        {
            key: '1',
            label: 'Unicode',
            children: university.uniCode,
        },
        {
            key: '2',
            label: 'Entrance Score',
            children: university.averageS,
        },
        {
            key: '3',
            label: 'Number of Registration',
            children: university.isRegistered,
        },
        {
            key: '4',
            label: 'Target',
            children: university.target,
        },
        {
            key: '5',
            label: 'Address',
            children: university.address,
        },
        {
            key: '6 ',
            label: 'Name',
            children: university.nameU,
        },
    ];
    const colums = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '10%',
            fixed: 'left',
        },

        {
            title: 'Name',
            dataIndex: 'name',
            width: '19%',
            editable: true,
            fixed: 'left',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '15%',
        },
        {
            title: 'Math',
            dataIndex: 'MathScore',
            width: '10%',
            editable: true,

            sorter: (a, b) => a.MathScore - b.MathScore,
        },
        {
            title: 'Literature',
            dataIndex: 'LiteratureScore',
            width: '11%',
            editable: true,

            sorter: (a, b) => a.LiteratureScore - b.LiteratureScore,
        },
        {
            title: 'EngLish',
            dataIndex: 'EnglishScore',
            width: '10%',
            editable: true,

            sorter: (a, b) => a.EnglishScore - b.EnglishScore,
        },
        {
            title: 'Average',
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
            <Descriptions title="University Infomation" column={2}>
                {items.map((item) => (
                    <Descriptions.Item key={item.key} label={item.label}>
                        {item.children}
                    </Descriptions.Item>
                ))}
            </Descriptions>
            <Divider />
            <h4>List Of Student</h4>
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
