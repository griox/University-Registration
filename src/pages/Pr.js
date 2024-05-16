import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Space, Label, Cascader } from 'antd';
import '../assets/admin/css/profile.css';
import { Typography } from 'antd';
import 'firebase/auth';
import { ref, child, getDatabase, get, set, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { Calendar } from 'antd';
import { DatePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import UniOfStudent from './UniOfStudent';
import { DownOutlined } from '@ant-design/icons';

const onChange = (date, dateString) => {
    console.log(date, dateString);
};
const MAX_COUNT = 5;
function Pr() {
    const [gt, setGt] = useState(false);
    const [gender, setGender] = useState([
        { value: 'Male', label: 'Male' },
        { value: 'Femail', label: 'Femail' },
    ]);
    const [temp, setTemp] = useState('');
    const [allowInput, setAllowInput] = useState(true);
    const [a, setA] = useState({});
    const [email, setEmail] = useState('');
    const getPopupContainer = (triggerNode) => triggerNode.parentNode;
    const firebaseConfig = {
        apiKey: 'AIzaSyD2_evQ7Wje0Nza4txsg5BE_dDSNgmqF3o',
        authDomain: 'mock-proeject-b.firebaseapp.com',
        databaseURL: 'https://mock-proeject-b-default-rtdb.firebaseio.com',
        projectId: 'mock-proeject-b',
        storageBucket: 'mock-proeject-b.appspot.com',
        messagingSenderId: '898832925665',
        appId: '1:898832925665:web:bb28598e7c70a0d73188a0',
    };
    const detail = useSelector((state) => state);
    const dispatch = useDispatch();
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const [arr, setArr] = useState([]);
    const [value, setValue] = React.useState([]);
    const suffix = (
        <>
            <span>
                {value.length} / {MAX_COUNT}
            </span>
            <DownOutlined />
        </>
    );
    useEffect(() => {
        // get(child(ref(db), `Detail/minhquang`))
        //     .then((snapshot) => {
        //         if (snapshot.exists()) {
        //             const x = snapshot.val();
        //             dispatch({ type: 'user', payload: x });
        //         } else {
        //             console.log('No data available');
        //         }
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //     });
        const personal = JSON.parse(localStorage.getItem('Infor'));

        const averageScore = personal.EnglishScore + personal.LiteratureScore + personal.MathScore;
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

        dispatch({ type: 'user', payload: personal });
        const emailEncode = JSON.parse(localStorage.getItem('Email'));
        get(child(ref(db), 'Infor/' + emailEncode.replace(/\./g, ','))).then((snapshot) => {
            if (snapshot.exists()) {
                const x = snapshot.val();
                // if (x.uniCode !== undefined) {
                const o = x.uniCode;

                localStorage.setItem('ListUni', JSON.stringify(o));
                // }
            }
        });
        const k = JSON.parse(localStorage.getItem('ListUni'));
        if (Array.isArray(k)) {
            setValue(() => [...k]);
        } else {
            setValue(() => []);
        }
    }, [db, dispatch]);
    const save = () => {
        if (allowInput !== true) {
            localStorage.setItem('Infor', JSON.stringify(detail));
            const emailEncode = JSON.parse(localStorage.getItem('Email'));
            update(ref(db, 'Infor/' + emailEncode.replace(/\./g, ',')), {
                name: detail.name,
                gender: detail.gender,
                placeOBirth: detail.placeOBirth,
                Address: detail.Address,
                enthicity: detail.enthicity,
                idenNum: detail.idenNum,
                email: detail.email,

                // EnglishScore: parseFloat(detail.EnglishScore),
                // MathScore: parseFloat(detail.MathScoreScore),
                // LiteratureScore: parseFloat(detail.LiteratureScore),
            })
                .then(() => {
                    toast.success('Updated sucessfully');
                })
                .catch((error) => {
                    alert('lỗi' + error);
                });
            update(ref(db, 'SinhVien/SV004/'), {
                uniCodes: value,
            });
            setAllowInput(!allowInput);
        } else {
            setAllowInput(!allowInput);
        }
    };
    const [size, setSize] = useState('middle');
    // const handleChange = (value) => {
    //   console.log(`Selected: ${value}`);
    // };
    const [provinces, setProvinces] = useState([
        { value: 'Hà Nội', label: 'Hà Nội' },
        { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
        { value: 'Đà Nẵng', label: 'Đà Nẵng' },
        { value: 'Hải Phòng', label: 'Hải Phòng' },
        { value: 'Cần Thơ', label: 'Cần Thơ' },
        { value: 'An Giang', label: 'An Giang' },
        { value: 'Bà Rịa-Vũng Tàu', label: 'Bà Rịa-Vũng Tàu' },
        { value: 'Bạc Liêu', label: 'Bạc Liêu' },
        { value: 'Bắc Kạn', label: 'Bắc Kạn' },
        { value: 'Bắc Giang', label: 'Bắc Giang' },
        { value: 'Bắc Ninh', label: 'Bắc Ninh' },
        { value: 'Bến Tre', label: 'Bến Tre' },
        { value: 'Bình Dương', label: 'Bình Dương' },
        { value: 'Bình Định', label: 'Bình Định' },
        { value: 'Bình Phước', label: 'Bình Phước' },
        { value: 'Bình Thuận', label: 'Bình Thuận' },
        { value: 'Cà Mau', label: 'Cà Mau' },
        { value: 'Cao Bằng', label: 'Cao Bằng' },
        { value: 'Đắk Lắk', label: 'Đắk Lắk' },
        { value: 'Đắk Nông', label: 'Đắk Nông' },
        { value: 'Điện Biên', label: 'Điện Biên' },
        { value: 'Đồng Nai', label: 'Đồng Nai' },
        { value: 'Đồng Tháp', label: 'Đồng Tháp' },
        { value: 'Gia Lai', label: 'Gia Lai' },
        { value: 'Hà Giang', label: 'Hà Giang' },
        { value: 'Hà Nam', label: 'Hà Nam' },
        { value: 'Hà Tĩnh', label: 'Hà Tĩnh' },
        { value: 'Hải Dương', label: 'Hải Dương' },
        { value: 'Hậu Giang', label: 'Hậu Giang' },
        { value: 'Hòa Bình', label: 'Hòa Bình' },
        { value: 'Hưng Yên', label: 'Hưng Yên' },
        { value: 'Khánh Hòa', label: 'Khánh Hòa' },
        { value: 'Kiên Giang', label: 'Kiên Giang' },
        { value: 'Kon Tum', label: 'Kon Tum' },
        { value: 'Lai Châu', label: 'Lai Châu' },
        { value: 'Lâm Đồng', label: 'Lâm Đồng' },
        { value: 'Lạng Sơn', label: 'Lạng Sơn' },
        { value: 'Lào Cai', label: 'Lào Cai' },
        { value: 'Long An', label: 'Long An' },
        { value: 'Nam Định', label: 'Nam Định' },
        { value: 'Nghệ An', label: 'Nghệ An' },
        { value: 'Ninh Bình', label: 'Ninh Bình' },
        { value: 'Ninh Thuận', label: 'Ninh Thuận' },
        { value: 'Phú Thọ', label: 'Phú Thọ' },
        { value: 'Quảng Bình', label: 'Quảng Bình' },
        { value: 'Quảng Nam', label: 'Quảng Nam' },
        { value: 'Quảng Ngãi', label: 'Quảng Ngãi' },
        { value: 'Quảng Ninh', label: 'Quảng Ninh' },
        { value: 'Quảng Trị', label: 'Quảng Trị' },
        { value: 'Sóc Trăng', label: 'Sóc Trăng' },
        { value: 'Sơn La', label: 'Sơn La' },
        { value: 'Tây Ninh', label: 'Tây Ninh' },
        { value: 'Thái Bình', label: 'Thái Bình' },
        { value: 'Thái Nguyên', label: 'Thái Nguyên' },
        { value: 'Thanh Hóa', label: 'Thanh Hóa' },
        { value: 'Thừa Thiên Huế', label: 'Thừa Thiên Huế' },
        { value: 'Tiền Giang', label: 'Tiền Giang' },
        { value: 'Trà Vinh', label: 'Trà Vinh' },
        { value: 'Tuyên Quang', label: 'Tuyên Quang' },
        { value: 'Vĩnh Long', label: 'Vĩnh Long' },
        { value: 'Vĩnh Phúc', label: 'Vĩnh Phúc' },
        { value: 'Yên Bái', label: 'Yên Bái' },
    ]);
    const [ethnicities, setEthnicities] = useState([
        { value: 'Kinh', label: 'Kinh' },
        { value: 'Tày', label: 'Tày' },
        { value: 'Thái', label: 'Thái' },
        { value: 'Mường', label: 'Mường' },
        { value: 'Khơ Mú', label: 'Khơ Mú' },
        { value: "H'Mông", label: "H'Mông" },
        { value: 'Dao', label: 'Dao' },
        { value: 'Gia Rai', label: 'Gia Rai' },
        { value: 'Ê Đê', label: 'Ê Đê' },
        { value: 'Ba Na', label: 'Ba Na' },
        { value: 'Xơ Đăng', label: 'Xơ Đăng' },
        { value: 'Sán Dìu', label: 'Sán Dìu' },
        { value: 'Chăm', label: 'Chăm' },
        { value: 'Cơ Ho', label: 'Cơ Ho' },
        { value: 'Ra Glai', label: 'Ra Glai' },
        { value: 'Mnông', label: 'Mnông' },
        { value: 'Hà Nhì', label: 'Hà Nhì' },
        { value: 'Chu Ru', label: 'Chu Ru' },
        { value: 'Lào', label: 'Lào' },
        { value: 'La Chí', label: 'La Chí' },
        { value: 'Kháng', label: 'Kháng' },
        { value: 'Lự', label: 'Lự' },
        { value: 'Pà Thẻn', label: 'Pà Thẻn' },
        { value: 'Cờ Lao', label: 'Cờ Lao' },
        { value: 'Brâu', label: 'Brâu' },
        { value: 'Bru-Vân Kiều', label: 'Bru-Vân Kiều' },
        { value: 'Co', label: 'Co' },
        { value: 'Tà Ôi', label: 'Tà Ôi' },
        { value: 'Giáy', label: 'Giáy' },
        { value: 'Cơ Tu', label: 'Cơ Tu' },
        { value: 'Giẻ Triêng', label: 'Giẻ Triêng' },
        { value: 'Mạ', label: 'Mạ' },
        { value: 'Khơ Me', label: 'Khơ Me' },
        { value: 'Xinh Mun', label: 'Xinh Mun' },
        { value: 'Hrê', label: 'Hrê' },
        { value: 'Cơ Lao', label: 'Cơ Lao' },
        { value: 'Co Tu', label: 'Co Tu' },
        { value: 'Chơ Ro', label: 'Chơ Ro' },
        { value: 'Sơ rá', label: 'Sơ rá' },
        { value: 'Ơ Đu', label: 'Ơ Đu' },
        { value: 'Rơ Măm', label: 'Rơ Măm' },
        { value: 'Ngái', label: 'Ngái' },
        { value: 'Khơ Pă', label: 'Khơ Pă' },
        { value: 'Mạ', label: 'Mạ' },
        { value: 'Ơ Ơ', label: 'Ơ Ơ' },
        { value: 'Xinh Mun', label: 'Xinh Mun' },
        { value: 'Ba Na', label: 'Ba Na' },
        { value: 'Giẻ Triêng', label: 'Giẻ Triêng' },
        { value: 'Chăm', label: 'Chăm' },
    ]);
    const [day, setDay] = useState([
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' },
        { value: 6, label: '6' },
        { value: 7, label: '7' },
        { value: 8, label: '8' },
        { value: 9, label: '9' },
        { value: 10, label: '10' },
        { value: 11, label: '11' },
        { value: 12, label: '12' },
        { value: 13, label: '13' },
        { value: 14, label: '14' },
        { value: 15, label: '15' },
        { value: 16, label: '16' },
        { value: 17, label: '17' },
        { value: 18, label: '18' },
        { value: 19, label: '19' },
        { value: 20, label: '20' },
        { value: 21, label: '21' },
        { value: 22, label: '22' },
        { value: 23, label: '23' },
        { value: 24, label: '24' },
        { value: 25, label: '25' },
        { value: 26, label: '26' },
        { value: 27, label: '27' },
        { value: 28, label: '28' },
        { value: 29, label: '29' },
        { value: 30, label: '30' },
        { value: 31, label: '31' },
    ]);
    const [month, setMonth] = useState([
        { value: 'January', label: 'January' },
        { value: 'February', label: 'February' },
        { value: 'March', label: 'March' },
        { value: 'April', label: 'April' },
        { value: 'May', label: 'May' },
        { value: 'June', label: 'June' },
        { value: 'July', label: 'July' },
        { value: 'August', label: 'August' },
        { value: 'September', label: 'September' },
        { value: 'October', label: 'October' },
        { value: 'November', label: 'November' },
        { value: 'December', label: 'December' },
    ]);
    const handleChange = (e, propertyName) => {
        console.log(e);
        const newValue = e.target.value;
        // setEmail(newValue);
        dispatch({ type: 'update', payload: { propertyName, newValue } });
    };
    const handleSelect = (e, propertyName) => {
        console.log(e);
        const newValue = e;
        // setEmail(newValue);
        dispatch({ type: 'update', payload: { propertyName, newValue } });
    };
    const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <div className="container">
            {/* {console.log(detail)} */}
            <div className="input">
                <div className="full-name">
                    <h1>Student Name: </h1>
                    <Space.Compact size="large">
                        {/* <div>{a.email}</div> */}
                        <Input
                            readOnly={allowInput}
                            className="g-s"
                            value={detail.name}
                            onChange={(e) => handleChange(e, 'name')}
                            disabled={allowInput}
                            options={gender}
                        />
                    </Space.Compact>
                    {/* <Space.Compact size="large">
                    <Input
                        addonBefore={'Middlename:'}
                        placeholder="large size"
                        readOnly={allowInput}
                        className="label-input"
                        value={detail.middlename}
                        onChange={(e) => handleChange(e, 'middlename')}
                        disabled={allowInput}
                    />
                </Space.Compact>
                <Space.Compact size="large">
                    <Input
                        addonBefore={'Lastname:'}
                        placeholder="large size"
                        className="label-input"
                        value={detail.lastname}
                        onChange={(e) => handleChange(e, 'lastname')}
                        disabled={allowInput}
                    />
                </Space.Compact> */}
                </div>
                <div className="detail-item">
                    <h1>Gender: </h1>
                    <Space.Compact size="large">
                        <Space.Compact>
                            <Select
                                showSearch
                                placeholder="Choose your gender"
                                options={gender}
                                className="g-s"
                                value={detail.gender}
                                onChange={(e) => handleSelect(e, 'gender')}
                                disabled={allowInput}
                            />
                        </Space.Compact>
                    </Space.Compact>
                </div>
                {/* <div className="detail-item">
                <h1>Date of birth: </h1>
                <div className="date-detail">
                    <Space.Compact className="date">
                        <Select
                            className="g-s"
                            options={day}
                            value={detail.}
                            onChange={(e) => handleSelect(e, 'day')}
                            placeholder="Day"
                            disabled={allowInput}
                        />
                    </Space.Compact> */}
                {/* <Space.Compact className="date">
                        <Select
                            className="g-s"
                            options={month}
                            value={detail.month}
                            onChange={(e) => handleSelect(e, 'month')}
                            placeholder="Month"
                            disabled={allowInput}
                        />
                    </Space.Compact>
                    <Space.Compact className="date">
                        <Select
                            className="g-s"
                            options={day}
                            placeholder="Year"
                            value={detail.year}
                            onChange={(e) => handleSelect(e, 'year')}
                            disabled={allowInput}
                        />
                    </Space.Compact>
                </div> */}
                {/* </div> */}
                <div className="detail-item">
                    <h1>Place of birth: </h1>

                    <Space.Compact size="large">
                        <Select
                            size={size}
                            showSearch
                            options={provinces}
                            className="g-s"
                            value={detail.placeOBirth}
                            onChange={(e) => handleSelect(e, 'placeOBirth')}
                            disabled={allowInput}
                        />
                    </Space.Compact>
                </div>
                <div className="detail-item">
                    <h1>Address: </h1>

                    <Space.Compact size="large">
                        <Input
                            className="g-s addr"
                            value={detail.Address}
                            onChange={(e) => handleChange(e, 'Address')}
                            disabled={allowInput}
                        />
                    </Space.Compact>
                </div>
                <div className="detail-item">
                    <h1>Ethnicity: </h1>

                    <Space.Compact size="large">
                        <Select
                            size={size}
                            value={detail.enthicity}
                            showSearch
                            onChange={(e) => handleSelect(e, 'enthicity')}
                            options={ethnicities}
                            className="g-s"
                            disabled={allowInput}
                        />
                    </Space.Compact>
                </div>
                <div className="detail-item">
                    <h1>CCCD: </h1>

                    <Space.Compact size="large">
                        <Input
                            className="g-s"
                            value={detail.idenNum}
                            onChange={(e) => handleChange(e, 'idenNum')}
                            disabled={allowInput}
                        />
                    </Space.Compact>
                </div>
                {/* <div className="detail-item">
                <h1>School: </h1>
                <Space.Compact size="large">
                    <Input
                        placeholder="large size"
                        value={detail.CCCD}
                        className="g-s"
                        disabled={allowInput}
                        onChange={(e) => handleChange(e, 'CCCD')}
                    />
                </Space.Compact>
            </div> */}
                <div className="detail-item">
                    <h1>Email: </h1>
                    <Space.Compact size="large">
                        <Input
                            className="g-s"
                            value={detail.email}
                            onChange={(e) => handleChange(e, 'email')}
                            disabled={true}
                        />
                    </Space.Compact>
                </div>
            </div>
            <div className="detail-item">
                <h1>University: </h1>
                <Space.Compact size="large">
                    <Select
                        mode="multiple"
                        maxCount={MAX_COUNT}
                        disabled={allowInput}
                        value={value}
                        style={{
                            width: '300px',
                            height: 'auto',
                            cursor: 'pointer',
                        }}
                        onChange={setValue}
                        suffixIcon={suffix}
                        placeholder="Only 5 universities"
                        options={arr}
                        showSearch
                    />
                </Space.Compact>
            </div>

            <Button type="primary" onClick={() => save()} className="btn-save">
                {allowInput ? 'Sửa' : 'Lưu'}
            </Button>
        </div>
    );
}
export default Pr;
