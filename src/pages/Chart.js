import React, { useEffect, useRef, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { DualAxes } from '@ant-design/plots';
import '../assets/admin/css/chart.css';
import { child, get, getDatabase, ref } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { list } from 'firebase/storage';

const Chart = () => {
    const [studentTotal, setStudentTotal] = useState(0);
    const [stMoreThanF, setStMoreThanF] = useState(0);
    const [stLessThanF, setStLessThanF] = useState(0);
    const [allUni, setAllUni] = useState(0);
    const [mathAS, setMathAS] = useState(0);
    const [literatureAS, setLiteratureAS] = useState(0);
    const [englishAS, setEnglishAS] = useState(0);

    const aRef = useRef(studentTotal);
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
        // Cập nhật giá trị của aRef mỗi khi a thay đổi
        aRef.current = allUni;
    }, [allUni]);
    useEffect(() => {
        const updateUniversity = () => {
            get(child(ref(db), 'University/')).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    const listItem = Object.values(x).map((item) => item);

                    setAllUni(listItem.length);
                }
            });
        };
        // console.log(studentTotal);
        const timer = setTimeout(updateUniversity, 10);

        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        // Cập nhật giá trị của aRef mỗi khi a thay đổi
        aRef.current = studentTotal;
    }, [studentTotal]);
    useEffect(() => {
        const updateStudent = () => {
            get(child(ref(db), 'Infor')).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    const listItem = Object.values(x).map((item) => item);
                    var y = 0;
                    var k = 0;
                    var mas = 0;
                    var eas = 0;
                    var las = 0;
                    listItem.forEach((item) => {
                        mas += item.MathScore;
                        eas += item.EnglishScore;
                        las += item.LiteratureScore;
                        if ((item.EnglishScore + item.MathScore + item.LiteratureScore) / 3 > 5) {
                            y += 1;
                        } else {
                            k += 1;
                        }
                    });
                    mas /= listItem.length;
                    eas /= listItem.length;
                    las /= listItem.length;
                    setEnglishAS(eas);
                    setLiteratureAS(las);
                    setMathAS(mas);
                    setStudentTotal(listItem.length);
                    setStLessThanF(k);
                    setStMoreThanF(y);

                    localStorage.setItem('NumberOfStudentGradeThan5', JSON.stringify(y));
                }
            });
        };
        // console.log(studentTotal);
        const timer = setTimeout(updateStudent, 10);

        return () => clearTimeout(timer);
    }, []);

    // useEffect(() => {
    //     const fetchDataAndUpdateTotal = async () => {
    //         const snapshot = await get(child(ref(db), 'Infor'));
    //         if (snapshot.exists()) {
    //             const data = snapshot.val();
    //             const listItem = Object.values(data);
    //             let count = 0;
    //             listItem.forEach((item) => {
    //                 if ((item.EnglishScore + item.MathScore + item.LiteratureScore) / 3 > 5) {
    //                     count += 1;
    //                 }
    //             });
    //             setStudentTotal((prevTotal) => prevTotal + count);
    //         }
    //     };

    //     fetchDataAndUpdateTotal();
    // }, []);
    console.log(studentTotal);
    const data = [
        { year: '1991', value: 3, count: 10 },
        { year: '1992', value: 4, count: 4 },
        { year: '1993', value: 3.5, count: 5 },
        { year: '1994', value: 5, count: 5 },
        { year: '1995', value: 4.9, count: 4.9 },
        { year: '1996', value: 6, count: 35 },
        { year: '1997', value: 7, count: 7 },
        { year: '1998', value: 9, count: 1 },
        { year: '1999', value: 13, count: 20 },
    ];
    const config = {
        data,
        xField: 'year',
        legend: true,
        children: [
            {
                type: 'line',
                yField: 'value',
                style: {
                    stroke: '#5B8FF9',
                    lineWidth: 2,
                },
                axis: {
                    y: {
                        title: 'value',
                        style: { titleFill: '#5B8FF9' },
                    },
                },
            },
            {
                type: 'line',
                yField: 'count',
                style: {
                    stroke: '#5AD8A6',
                    lineWidth: 2,
                },
                axis: {
                    y: {
                        position: 'right',
                        title: 'count',
                        style: { titleFill: '#5AD8A6' },
                    },
                },
            },
        ],
    };

    return (
        <div className="container">
            {console.log(mathAS, englishAS, literatureAS)}
            <div className="mainer">
                <div className="cards">
                    <div className="carder">
                        <div className="card-content">
                            <div className="number">{studentTotal}</div>
                            <div className="card-name">All students participate in the exam</div>
                        </div>
                        <UserOutlined className="icon-box" />
                    </div>
                    <div className="carder">
                        <div className="card-content">
                            <div className="number">{stMoreThanF}</div>
                            <div className="card-name">Students have average scores more than 5</div>
                        </div>
                        <UserOutlined className="icon-box" />
                    </div>
                    <div className="carder">
                        <div className="card-content">
                            <div className="number">{stLessThanF}</div>
                            <div className="card-name">Students have average scores less than 5 </div>
                        </div>
                        <UserOutlined className="icon-box" />
                    </div>
                    <div className="carder">
                        <div className="card-content">
                            <div className="number">{allUni}</div>
                            <div className="card-name">University</div>
                        </div>
                        <UserOutlined className="icon-box" />
                    </div>
                </div>
            </div>
            <div className="charts">
                <div className="charter">
                    <h2>Demo</h2>
                    <DualAxes {...config} />
                </div>
                <div className="charter" id="donut">
                    <h2>Demo 2</h2>
                    <DualAxes {...config} />
                </div>
            </div>
        </div>
    );
};

export default Chart;
