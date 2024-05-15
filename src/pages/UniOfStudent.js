import React, { useEffect, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { child, get, getDatabase, ref } from 'firebase/database';
import { initializeApp } from 'firebase/app';
const MAX_COUNT = 5;
const UniOfStudent = (allowInput) => {
    const [value, setValue] = React.useState(['Ava Swift']);
    const suffix = (
        <>
            <span>
                {value.length} / {MAX_COUNT}
            </span>
            <DownOutlined />
        </>
    );
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
    const [arr, setArr] = useState([]);
    useEffect(() => {
        const grade = JSON.parse(localStorage.getItem('Infor'));
        const averageScore = grade.EnglishScore + grade.LiteratureScore + grade.MathScore;
        get(child(ref(db), `University/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const x = snapshot.val();
                // setDd(x.length);
                Object.values(x)
                    .map((user) => user)
                    .forEach((item) => {
                        if (item.averageS <= averageScore) {
                            const element = { value: item.uniCode, label: item.uniCode };
                            setArr((pre) => [...pre, element]);
                        }
                    });
            } else {
                console.log('No data available');
            }
        });
    }, []);

    return (
        <Select
            mode="multiple"
            maxCount={MAX_COUNT}
            disabled={allowInput}
            // value={value}
            style={{
                width: '300px',
                height: 'auto',
            }}
            onChange={setValue}
            suffixIcon={suffix}
            placeholder="Please select"
            options={arr}
        />
    );
};
export default UniOfStudent;
