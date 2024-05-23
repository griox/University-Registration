import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Select, Space, Table, Modal, Skeleton, Spin, Form, Tooltip } from 'antd';
import '../assets/admin/css/profile.css';
import 'firebase/auth';
import { ref, child, getDatabase, get, set, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {
    CameraOutlined,
    DownOutlined,
    InfoCircleOutlined,
    MailOutlined,
    SaveOutlined,
    SearchOutlined,
    UploadOutlined,
    UserOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { calc } from 'antd/es/theme/internal';
import { Avatar } from '@mui/material';
import { storage } from './firebaseConfig';
import { getDownloadURL, uploadBytes, ref as storageRef } from 'firebase/storage';

const { Option } = Select;
const MAX_COUNT = 5;
function Pr() {
    const [gender, setGender] = useState([
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
    ]);
    const [suitableSchoolList, setSuitableSchoolList] = useState([]);
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
    const detail = useSelector((state) => state);
    const dispatch = useDispatch();
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingTable, setLoadingTable] = useState(true);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button type="link" size="small" onClick={() => close()}>
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const suffix = (
        <>
            <span>
                {detail.uniCode.length} / {MAX_COUNT}
            </span>
            <DownOutlined />
        </>
    );
    useEffect(() => {
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

                            const school = {
                                code: item.uniCode,
                                name: item.nameU,
                                score: item.averageS,
                                capacity: item.target,
                                isRegistered: item.isRegistered,
                            };
                            setArr((pre) => [...pre, element]);
                            setSuitableSchoolList((pre) => [...pre, school]);
                        }
                    });
                setLoadingTable(false);
            } else {
                console.log('No data available');
            }
        });
        dispatch({ type: 'user', payload: personal });
        setLoading(false);
    }, [db, dispatch]);

    const [size, setSize] = useState('middle');

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

    const handleChange = (e, propertyName) => {
        console.log(e);
        const newValue = e.target.value;
        // setEmail(newValue);
        dispatch({ type: 'update', payload: { propertyName, newValue } });
    };
    const handleSelect = (e, propertyName) => {
        const newValue = e;
        dispatch({ type: 'update', payload: { propertyName, newValue } });
    };

    const columns = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            ...getColumnSearchProps('code'),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Entrance Score',
            dataIndex: 'score',
            key: 'score',
            ...getColumnSearchProps('score'),
        },
        {
            title: 'Target',
            dataIndex: 'capacity',
            key: 'capacity',
            ...getColumnSearchProps('capacity'),
        },
        // các cột khác của bạn ở đây
        {
            title: 'Number of students registered',
            dataIndex: 'isRegistered',
            key: 'isRegistered',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button
                    onClick={() => addUniversity(record.code)}
                    disabled={detail.uniCode.includes(record.code) || detail.uniCode.length === 5}
                >
                    Add
                </Button>
            ),
        },
    ];

    const addUniversity = (uniCode) => {
        dispatch({ type: 'pushUniCode', newValue: uniCode });
    };
    const [image, setImage] = useState(null);
    // const [url, setUrl] = useState(null);

    const handleImgChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
            const reader = new FileReader();
            reader.onload = (event) => {
                const imgUrl = event.target.result;
                document.getElementById('avatarImg').src = imgUrl;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (!image) return;
        const imgRef = storageRef(storage, `images/${image.name}`);
        uploadBytes(imgRef, image)
            .then(() => getDownloadURL(imgRef))
            .then((downLoadUrl) => {
                const per = JSON.parse(localStorage.getItem('Infor'));
                update(ref(db, 'Detail/' + per.id), {
                    img: downLoadUrl,
                })
                    .then(() => {})
                    .catch((error) => {
                        alert('lỗi' + error);
                    });
                get(child(ref(db), `Detail/${per.id}/`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        const x = snapshot.val();

                        localStorage.setItem('Infor', JSON.stringify(x));
                        dispatch({ type: 'user', payload: x });
                    } else {
                        console.log('No data available');
                    }
                });

                handleSelect(downLoadUrl, 'img');

                // setUrl(downLoadUrl);
                setImage(null);
            })
            .catch((error) => {
                console.log(error.message, 'Error');
            })
            .catch((error) => {
                console.log(error.message, 'Error');
            });
    };
    const save = () => {
        setLoadingSave(true);
        const per = JSON.parse(localStorage.getItem('Infor'));
        update(ref(db, 'Detail/' + per.id), {
            name: detail.name,
            gender: detail.gender,
            placeOBirth: detail.placeOBirth,
            Address: detail.Address,
            enthicity: detail.enthicity,
            idenNum: detail.idenNum,
            email: detail.email,
            uniCode: detail.uniCode,
        })
            .then(() => handleSubmit())
            .then(() => {
                detail.uniCode.forEach((item) => {
                    if (per.uniCode.includes(item) === false) {
                        get(child(ref(db), `University/` + item)).then((snapshot) => {
                            if (snapshot.exists()) {
                                const x = snapshot.val();

                                let m = x.registeration;
                                m[detail.email.replace(/\./g, ',')] = { email: detail.email, id: detail.id };
                                console.log(m);
                                update(ref(db, 'University/' + item), {
                                    isRegistered: x.isRegistered + 1,
                                    registeration: m,
                                });
                            }
                        });
                    }
                });
                per.uniCode.forEach((item) => {
                    if (detail.uniCode.includes(item) === false) {
                        get(child(ref(db), `University/` + item)).then((snapshot) => {
                            if (snapshot.exists()) {
                                const x = snapshot.val();
                                for (let k in x.registeration) {
                                    if (x.registeration[k].email === detail.email) {
                                        delete x.registeration[k];
                                    }
                                }

                                update(ref(db, 'University/' + item), {
                                    isRegistered: x.isRegistered - 1,
                                    registeration: x.registeration,
                                });
                            }
                        });
                    }
                });
            });
        get(child(ref(db), `Detail/${per.id}/`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();

                    localStorage.setItem('Infor', JSON.stringify(x));
                    dispatch({ type: 'user', payload: x });
                } else {
                    console.log('No data available');
                }
            })
            .then(() => setLoadingSave(false));

        toast.success('Updated sucessfully');
    };

    return (
        <div className="container">
            {loading ? (
                <Skeleton active />
            ) : (
                <>
                    <div className="pr-content">
                        {/* <div className="avartar">
                            <Avatar alt="Remy Sharp" src={detail.img} sx={{ fontSize: 50, width: 150, height: 150 }} />
                            <div>
                                <input type="file" onChange={handleImgChange} id="fileInput" />
                                <input type="button" onClick={handleSubmit} id="btn-fileSubmit" />
                                <div className="pr-btn">
                                    <label htmlFor="btn-fileSubmit">
                                        <SaveOutlined style={{ fontSize: '20px' }} />
                                    </label>
                                    <label htmlFor="fileInput">
                                        <UploadOutlined style={{ fontSize: '20px' }} />
                                    </label>
                                </div>
                            </div>
                        </div> */}
                        <div className="avatar">
                            <div className="avatar-container">
                                <Avatar
                                    alt="Avatar"
                                    src={image ? URL.createObjectURL(image) : detail.img}
                                    sx={{ width: 200, height: 200 }}
                                    id="avatarImg"
                                />
                                <div className="avatar-overlay">
                                    <label htmlFor="fileInput">
                                        <CameraOutlined style={{ fontSize: '50px', color: 'white' }} />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <input
                                    type="file"
                                    onChange={handleImgChange}
                                    id="fileInput"
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>

                        <div className="input">
                            <div className="detail-item">
                                <h1>Student Name: </h1>
                                <Space.Compact size="large">
                                    <Input
                                        className="g-s size-input"
                                        value={detail.name}
                                        onChange={(e) => handleChange(e, 'name')}
                                    />
                                </Space.Compact>
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
                                        />
                                    </Space.Compact>
                                </Space.Compact>
                            </div>

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
                                    />
                                </Space.Compact>
                            </div>
                            <div className="detail-item">
                                <h1>Address: </h1>

                                <Space.Compact size="large">
                                    <Input
                                        className="g-s addr size-input"
                                        value={detail.Address}
                                        onChange={(e) => handleChange(e, 'Address')}
                                        style={{ width: '300px' }}
                                    />
                                </Space.Compact>
                            </div>
                            <div className="detail-item">
                                <h1>Ethnicity: </h1>
                                <Select
                                    defaultValue="Kinh"
                                    options={ethnicities}
                                    onChange={(e) => handleSelect(e, 'enthicity')}
                                    showSearch
                                    style={{ width: 200 }}
                                    className="g-s"
                                />
                            </div>
                            <div className="detail-item">
                                <h1>CCCD: </h1>

                                <Space.Compact size="large">
                                    <Input
                                        className="g-s size-input"
                                        value={detail.idenNum}
                                        onChange={(e) => handleChange(e, 'idenNum')}
                                    />
                                </Space.Compact>
                            </div>

                            <div className="detail-item">
                                <h1>Email: </h1>
                                <Space.Compact size="large">
                                    <Input
                                        className="g-s size-input"
                                        value={detail.email}
                                        onChange={(e) => handleChange(e, 'email')}
                                        suffix={
                                            <Tooltip title="Private Email">
                                                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                            </Tooltip>
                                        }
                                    />
                                </Space.Compact>
                            </div>
                            <div className="detail-item">
                                <h1>MathScore: </h1>
                                <Space.Compact size="large">
                                    <Input
                                        className="g-s size-input"
                                        value={detail.MathScore}
                                        onChange={(e) => handleChange(e, 'email')}
                                        disabled={true}
                                    />
                                </Space.Compact>
                            </div>
                            <div className="detail-item">
                                <h1>EnglishScore: </h1>
                                <Space.Compact size="large">
                                    <Input
                                        className="g-s size-input"
                                        value={detail.EnglishScore}
                                        onChange={(e) => handleChange(e, 'email')}
                                        disabled={true}
                                    />
                                </Space.Compact>
                            </div>
                            <div className="detail-item">
                                <h1>LiteratureScore: </h1>
                                <Space.Compact size="large">
                                    <Input
                                        className="g-s size-input"
                                        value={detail.LiteratureScore}
                                        onChange={(e) => handleChange(e, 'email')}
                                        disabled={true}
                                    />
                                </Space.Compact>
                            </div>
                        </div>
                    </div>
                    <div className="detail-item">
                        <h1>University: </h1>
                        <Space size="large">
                            <Select
                                mode="multiple"
                                maxCount={MAX_COUNT}
                                value={detail.uniCode}
                                options={arr}
                                style={{ width: '800px', cursor: 'pointer' }}
                                onChange={(e) => handleSelect(e, 'uniCode')}
                                suffixIcon={suffix}
                                placeholder="Selected universities"
                                showSearch
                                className="g-s"
                            />
                        </Space>
                        <Spin spinning={loadingSave}>
                            <Button type="primary" onClick={() => save()} className="btn-save">
                                {'Save'}
                            </Button>
                        </Spin>
                    </div>
                    <Spin spinning={loadingTable}>
                        <Table
                            dataSource={suitableSchoolList}
                            columns={columns}
                            rowKey="code"
                            style={{ marginTop: '20px' }}
                            scroll={{ x: 190, y: 'calc(100vh - 590px)' }}
                            pagination={{
                                defaultPageSize: '10',
                                pageSizeOptions: ['10', '20', '40', '100'],
                                total: suitableSchoolList.length,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total) => `Total ${total} items`,
                            }}
                        />
                    </Spin>
                </>
            )}
        </div>
    );
}
export default Pr;
