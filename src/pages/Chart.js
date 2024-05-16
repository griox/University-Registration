import React, { useEffect, useRef, useState } from 'react';
import { ArrowDownOutlined, ArrowUpOutlined, ManOutlined, WomanOutlined } from '@ant-design/icons';
import { Column, Pie } from '@ant-design/plots';
import '../assets/admin/css/chart.css';
import { child, get, getDatabase, ref } from 'firebase/database';
import { initializeApp } from 'firebase/app';

const Chart = () => {
    const [studentTotal, setStudentTotal] = useState(0);
    const [stMoreThanF, setStMoreThanF] = useState(0);
    const [stLessThanF, setStLessThanF] = useState(0);
    const [allUni, setAllUni] = useState(0);
    const [mathAS, setMathAS] = useState(0);
    const [literatureAS, setLiteratureAS] = useState(0);
    const [englishAS, setEnglishAS] = useState(0);
    const [male, setMale] = useState(0);
    const [female, setFemale] = useState(0);
    const [registOne, setRegistOne] = useState(0);
    const [registTwo, setRegistTwo] = useState(0);
    const [registThree, setRegistThree] = useState(0);
    const [registFour, setRegistFour] = useState(0);
    const [registFive, setRegistFive] = useState(0);
    const [registZero, setRegistZero] = useState(0);

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
        const timer = setTimeout(updateUniversity, 10);

        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        aRef.current = studentTotal;
    }, [studentTotal]);
    useEffect(() => {
        const regist = () => {
            get(child(ref(db), 'Detail/')).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    var a = 0;
                    var b = 0;
                    var c = 0;
                    var d = 0;
                    var e = 0;
                    var f = 0;
                    for (let i in x) {
                        if (x[i].uniCode === undefined) {
                            f += 1;
                        } else if (x[i].uniCode.length === 5) {
                            a += 1;
                        } else if (x[i].uniCode.length === 4) {
                            b += 1;
                        } else if (x[i].uniCode.length === 3) {
                            c += 1;
                        } else if (x[i].uniCode.length === 2) {
                            d += 1;
                        } else {
                            e += 1;
                        }
                    }
                }
                // localStorage.setItem('UniOfStudent', JSON.stringify([a, b, c, d, e, f]));
                setRegistZero(f);
                setRegistOne(e);
                setRegistTwo(d);
                setRegistThree(c);
                setRegistFour(b);
                setRegistFive(a);
            });
        };
        const timer = setTimeout(regist, 10);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const updateStudent = () => {
            get(child(ref(db), 'Detail/')).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    const listItem = Object.values(x).map((item) => item);
                    var y = 0;
                    var k = 0;
                    var mas = 0;
                    var eas = 0;
                    var las = 0;
                    let m = 0;
                    let f = 0;
                    listItem.forEach((item) => {
                        if (item.gender === 'Female') {
                            f += 1;
                        } else {
                            m += 1;
                        }
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
                    setMale(m);
                    setFemale(f);

                    localStorage.setItem('NumberOfStudentGradeThan5', JSON.stringify(y));
                }
            });
        };
        const timer = setTimeout(updateStudent, 10);

        return () => clearTimeout(timer);
    }, []);

    const config = {
        data: [
            { subject: 'Math', score: mathAS },
            { subject: 'Enghlish', score: englishAS },
            { subject: 'Literature', score: literatureAS },
        ],
        width: 1000,
        height: 400,
        xField: 'subject',
        yField: 'score',
        scale: {
            x: { padding: 0.8 },
            y: {
                domainMax: 10,
                domainMin: 0,
            },
        },
        label: {
            text: (d) => `${d.score.toFixed(2)}`,
            textBaseline: 'bottom',
        },
        style: {
            width: 50,
        },
    };
    const con = {
        data: [
            { type: 'Không có trường nào', value: registZero },
            { type: 'Một trường', value: registOne },
            { type: 'Hai trường', value: registTwo },
            { type: 'Ba trường', value: registThree },
            { type: 'Bốn trường', value: registFour },
            { type: 'Năm trường', value: registFive },
        ],
        angleField: 'value',
        colorField: 'type',
        width: 1100,
        height: 650,
        marginTop: 100,
        label: {
            text: (d) => `${d.type}\n${d.value}`,
            position: 'spider',
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
        style: {
            fontSize: 14, // Kích thước chữ của nhãn
            textAlign: 'center', // Căn giữa nhãn
        },
    };

    return (
        <div className="container">
            <div className="mainer">
                <div className="cards">
                    <div className="carder">
                        <div className="card-name">All students </div>
                        <div className="number" title={'Total students: ' + studentTotal}>
                            {studentTotal}
                        </div>
                        <div className="card-content">
                            <div className="content-chart">
                                <ArrowUpOutlined style={{ fontSize: '30px', color: 'green' }} />
                                <div
                                    className="number-below"
                                    title={'Students scores more than 5: ' + stMoreThanF}
                                    style={{ color: 'green' }}
                                >
                                    {stMoreThanF}
                                </div>
                            </div>
                            <div className="content-chart">
                                <ArrowDownOutlined style={{ fontSize: '30px', color: 'red' }} />
                                <div
                                    className="number-below"
                                    title={'Students scores less than 5: ' + stLessThanF}
                                    style={{ color: 'red' }}
                                >
                                    {stLessThanF}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="carder">
                        <div className="card-name">All students </div>
                        <div className="number" title={studentTotal}>
                            {studentTotal}
                        </div>
                        <div className="card-content">
                            <div className="content-chart">
                                <ArrowUpOutlined style={{ fontSize: '30px', color: 'green' }} />
                                <div className="number-below" title={stMoreThanF} style={{ color: 'green' }}>
                                    {stMoreThanF}
                                </div>
                            </div>
                            <div className="content-chart">
                                <ArrowDownOutlined style={{ fontSize: '30px', color: 'red' }} />
                                <div className="number-below" title={stLessThanF} style={{ color: 'red' }}>
                                    {stLessThanF}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="carder">
                        <div className="card-name">Gender </div>

                        <div className="card-content">
                            <div className="content-chart">
                                <ManOutlined style={{ fontSize: '30px', color: 'green' }} />
                                <div
                                    className="number-below"
                                    title={'Number of male: ' + male}
                                    style={{ color: 'green' }}
                                >
                                    {male}
                                </div>
                            </div>
                            <div className="content-chart">
                                <WomanOutlined style={{ fontSize: '30px', color: 'red' }} />
                                <div
                                    className="number-below"
                                    title={'Number of female: ' + female}
                                    style={{ color: 'red' }}
                                >
                                    {female}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="charts">
                <div className="charter">
                    <h2>Demo</h2>
                    <Column {...config} />
                </div>
                <div className="charter" style={{ height: '700px' }}>
                    <h2>Demo</h2>
                    <Pie {...con} />
                </div>
            </div>
        </div>
    );
};

export default Chart;
