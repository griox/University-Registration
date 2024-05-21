import { get, ref, child, getDatabase, remove, update, push, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import React, { useEffect, useState } from 'react';
import { Descriptions, Divider, Table, Form } from 'antd';
export const Form_Detail = ({ university }) => {
    const [student, setStudents] = useState(null);
    const [form] = Form.useForm();
   const student_regist = university.registeration;
    // console.log(student_regist);
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
          const uniRef = child(ref(db), 'Detail');
          try {
            const snapshot = await get(uniRef);
            if (snapshot.exists()) {
              const data = snapshot.val();
              const studentArray = Object.values(data).map((item) => ({ ...item, key: item.id }));
              console.log('studentArray:', studentArray);
    
              // Convert student_regist object to an array
              if (student_regist && typeof student_regist === 'object') {
                const studentList = Object.keys(student_regist).map((key) => ({
                  id: key,
                  ...student_regist[key]
                }));
                setStudents(studentList);
              } else {
                console.error('student_regist is not a valid object');
              }
            }
          } catch (error) {
            console.error('Cannot fetch University data', error);
          }
        };
        fetchData();
      }, [student_regist, db]);
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
            <Form form={form} component={false}>
                <Table
                    bordered
                    dataSource={student}
                    columns={colums}
                    scroll={{
                        x: 900,
                        y: 'calc(100vh - 580px)',
                    }}
                    style={{ height: '100%', marginRight: '-20px' }}
                    showSorterTooltip={{
                        target: 'sorter-icon',
                    }}
                    pagination={{
                        onChange: cancel,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                />
            </Form>
        </>
    );
};
export default Form_Detail;
