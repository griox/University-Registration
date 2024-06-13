import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Select, Space, Table, Skeleton, Spin, DatePicker, Tooltip, Modal, Form } from 'antd';
import '../assets/admin/css/profile.css';
import 'firebase/auth';
import { ref, child, getDatabase, get, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import {
    CameraOutlined,
    DownOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { Avatar, colors } from '@mui/material';
import { storage } from './firebaseConfig';
import { getDownloadURL, uploadBytes, ref as storageRef } from 'firebase/storage';
import { ethnicities, firebaseConfig, gender, provinces } from '../constants/constants';
import { useTranslation } from 'react-i18next';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';
import '../commonFunctions.css';
const { TextArea } = Input;
const MAX_COUNT = 5;

function Pr() {
    const { t } = useTranslation('profile');
    const [suitableSchoolList, setSuitableSchoolList] = useState([]);
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const [arr, setArr] = useState([]);
    const detail = useSelector((state) => state);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingTable, setLoadingTable] = useState(true);
    const size = 'middle';
    const [image, setImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorCCCD, setErrorCCCD] = useState('');
    const [errorDateOBirth, setErrorDateOBirth] = useState('');
    const [errorName, setErrorName] = useState('');
    const [errorEmail, setErrorEmail] = useState('');

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div onKeyDown={(e) => e.stopPropagation()} className="getColumnSearchProps">
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    className="getColumnSearchProps-Input"
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        className="getColumnSearchProps-Button"
                    >
                        {t('button.search')}
                    </Button>

                    <Button type="link" size="small" onClick={() => close()} className="getColumnClose-Button">
                        {t('button.close')}
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined className={filtered ? 'getColumnSearchProps-filterIcon' : undefined} />
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
    const columns = [
        {
            title: t('table.Code'),
            dataIndex: 'code',
            key: 'code',
            ...getColumnSearchProps('code'),
            fixed: 'left',
            width: 100,
        },
        {
            title: t('table.Name'),
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            width: 500,
        },
        {
            title: t('table.Entrance Score'),
            dataIndex: 'score',
            key: 'score',
            sorter: (a, b) => a.score - b.score,
            width: 150,
        },
        {
            title: t('table.Number of students registered'),
            dataIndex: 'isRegistered',
            key: 'isRegistered',
            width: 150,

            sorter: (a, b) => a.isRegistered - b.isRegistered,
        },
        {
            title: t('table.Target'),
            dataIndex: 'capacity',
            key: 'capacity',
            width: 150,

            sorter: (a, b) => a.capacity - b.capacity,
        },

        {
            title: t('table.Action'),
            key: 'action',
            render: (text, record) => (
                <Button
                    title={
                        detail.uniCode.includes(record.code) ||
                        detail.uniCode.length === 5 ||
                        record.capacity === record.isRegistered
                            ? 'Ready to add'
                            : 'Your grade is enough to add'
                    }
                    onClick={() => addUniversity(record.code, record)}
                    disabled={
                        detail.uniCode.includes(record.code) ||
                        detail.uniCode.length === 5 ||
                        record.capacity === record.isRegistered
                    }
                >
                    {t('button.Add')}
                </Button>
            ),
            fixed: 'right',
            width: 90,
        },
    ];
    useEffect(() => {
        const role = localStorage.getItem('Role');
        const personal = JSON.parse(localStorage.getItem('Infor'));
        dispatch({ type: 'user', payload: personal });
        if (role === 'user') {
            const averageScore = (personal.EnglishScore + personal.LiteratureScore + personal.MathScore) / 3;
            get(child(ref(db), `University/`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
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
                    toast.error('No data available');
                }
            });

            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [db, dispatch]);
    const addUniversity = (uniCode, record) => {
        dispatch({ type: 'pushUniCode', newValue: uniCode });
    };

    const suffix = (
        <>
            <span>
                {detail.uniCode.length} / {MAX_COUNT}
            </span>
            <DownOutlined />
        </>
    );

    const handleChange = (e, propertyName) => {
        let newValue = e.target.value;
        if (propertyName === 'email') {
            if (newValue === '' || newValue === null || newValue.trim().replace(/\s{2,}/g, ' ') === '') {
                setErrorEmail('Please input');
                return;
            }
            if (
                (/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(newValue) ||
                    /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/.test(newValue)) === false
            ) {
                setErrorEmail('Format is not correct');
                return;
            } else {
                setErrorEmail('');
                return;
            }
        }
        if (propertyName === 'idenNum') {
            if (newValue === '' || newValue === null || newValue.trim().replace(/\s{2,}/g, ' ') === '') {
                setErrorCCCD('Please input');
                return;
            }

            if (/^\d+$/.test(newValue) === false) {
                setErrorCCCD('Only input number');
                return;
            }
            if (newValue.length < 12) {
                setErrorCCCD('Iden number must contain 12');
                return;
            }

            get(child(ref(db), `Detail/`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    for (let i in x) {
                        if (x[i].idenNum === detail.idenNum && x[i].id !== detail.id) {
                            setErrorCCCD('IdenNum has existed');
                            return;
                        }
                    }
                }
            });
            get(child(ref(db), `Admin/`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    for (let i in x) {
                        if (x[i].idenNum === detail.idenNum && x[i].id !== detail.id) {
                            setErrorCCCD('IdenNum has existed');

                            return;
                        }
                    }
                }
            });
            get(child(ref(db), `Super_Admin/`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    for (let i in x) {
                        if (x[i].idenNum === detail.idenNum && x[i].id !== detail.id) {
                            setErrorCCCD('IdenNum has existed');

                            return;
                        }
                    }
                }
            });

            setErrorCCCD('');
        }

        if (propertyName === 'name') {
            if (newValue === '' || newValue === null || newValue.trim().replace(/\s{2,}/g, ' ') === '') {
                setErrorName('Please input');
                return;
            }
            if (/^[a-zA-Z\u00C0-\u017F\s]*$/.test(newValue) === false) {
                setErrorName('Name only contain A-Z a-z and space');
                return;
            }
            newValue = newValue.trim().replace(/\s{2,}/g, ' ');
            setErrorName('');
        }
        dispatch({ type: 'update', payload: { propertyName, newValue } });
    };
    const handleSelect = (e, propertyName) => {
        const newValue = e;
        if (propertyName === 'dateObirth') {
            var today = new Date();
            var birthDate = new Date(e);
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 18) {
                setErrorDateOBirth('You are not enough 18');
                return;
            } else {
                setErrorDateOBirth('');
            }
        }
        dispatch({ type: 'update', payload: { propertyName, newValue } });
    };

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

    const handleSubmit = (id) => {
        if (!image) return;
        const imgRef = storageRef(storage, `images/${image.name}`);
        uploadBytes(imgRef, image)
            .then(() => getDownloadURL(imgRef))
            .then((downLoadUrl) => {
                if (localStorage.getItem('Role') === 'super_admin') {
                    update(ref(db, 'Super_Admin/' + id), {
                        img: downLoadUrl,
                    })
                        .then(() => {})
                        .catch((error) => {
                            alert('lỗi' + error);
                        });
                    get(child(ref(db), `Super_Admin/${id}/`)).then((snapshot) => {
                        if (snapshot.exists()) {
                            const x = snapshot.val();

                            localStorage.setItem('Infor', JSON.stringify(x));
                            dispatch({ type: 'user', payload: x });
                        } else {
                            toast.error('No data available');
                        }
                    });

                    handleSelect(downLoadUrl, 'img');

                    setImage(null);
                } else if (localStorage.getItem('Role') === 'admin') {
                    update(ref(db, 'Admin/' + id), {
                        img: downLoadUrl,
                    })
                        .then(() => {})
                        .catch((error) => {
                            alert('lỗi' + error);
                        });
                    get(child(ref(db), `Admin/${id}/`)).then((snapshot) => {
                        if (snapshot.exists()) {
                            const x = snapshot.val();

                            localStorage.setItem('Infor', JSON.stringify(x));
                            dispatch({ type: 'user', payload: x });
                        } else {
                            toast.error('No data available');
                        }
                    });

                    handleSelect(downLoadUrl, 'img');

                    setImage(null);
                } else {
                    update(ref(db, 'Detail/' + id), {
                        img: downLoadUrl,
                    })
                        .then(() => {})
                        .catch((error) => {
                            alert('lỗi' + error);
                        });
                    get(child(ref(db), `Detail/${id}/`)).then((snapshot) => {
                        if (snapshot.exists()) {
                            const x = snapshot.val();

                            localStorage.setItem('Infor', JSON.stringify(x));
                            dispatch({ type: 'user', payload: x });
                        } else {
                            toast.error('No data available');
                        }
                    });

                    handleSelect(downLoadUrl, 'img');

                    setImage(null);
                }
            })
            .catch((error) => {
                toast.error(error.message, 'Error');
            });
    };
    const save = async () => {
        setLoadingSave(true);
        const per = JSON.parse(localStorage.getItem('Infor'));
        if (localStorage.getItem('Role') === 'super_admin') {
            handleSubmit(per.id);

            await update(ref(db, 'Super_Admin/' + per.id), {
                name: detail.name,
                gender: detail.gender,
                placeOBirth: detail.placeOBirth,
                Address: detail.Address,
                enthicity: detail.enthicity,
                idenNum: detail.idenNum,
                email: detail.email,
                dateObirth: detail.dateObirth,
            }).then();
            await get(child(ref(db), `Super_Admin/${per.id}/`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const x = snapshot.val();

                        localStorage.setItem('Infor', JSON.stringify(x));
                        dispatch({ type: 'user', payload: x });
                    } else {
                        toast.error('No data available');
                    }
                })
                .then(() => setLoadingSave(false))
                .then(() => toast.success('Updated sucessfully'));
        } else if (localStorage.getItem('Role') === 'admin') {
            handleSubmit(per.id);

            await update(ref(db, 'Admin/' + per.id), {
                name: detail.name,
                gender: detail.gender,
                placeOBirth: detail.placeOBirth,
                Address: detail.Address,
                enthicity: detail.enthicity,
                idenNum: detail.idenNum,
                email: detail.email,
                dateObirth: detail.dateObirth,
            }).then();

            await get(child(ref(db), `Admin/${per.id}/`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const x = snapshot.val();

                        localStorage.setItem('Infor', JSON.stringify(x));
                        dispatch({ type: 'user', payload: x });
                    } else {
                        toast.error('No data available');
                    }
                })
                .then(() => setLoadingSave(false))
                .then(() => toast.success('Updated sucessfully'));
        } else {
            handleSubmit(per.id);
            await update(ref(db, 'Detail/' + per.id), {
                name: detail.name,
                gender: detail.gender,
                placeOBirth: detail.placeOBirth,
                Address: detail.Address,
                enthicity: detail.enthicity,
                idenNum: detail.idenNum,
                email: detail.email,
                uniCode: detail.uniCode,
                dateObirth: detail.dateObirth,
            })
                .then(() => handleSubmit(per.id))
                .then(() => {
                    detail.uniCode.forEach(async (item) => {
                        const l = per.uniCode === undefined ? [] : per.uniCode;
                        if (l.includes(item) === false) {
                            await get(child(ref(db), `University/` + item)).then(async (snapshot) => {
                                if (snapshot.exists()) {
                                    const x = snapshot.val();

                                    const n = detail.email.replace(/\./g, ',');
                                    await update(ref(db, 'University/' + item), {
                                        isRegistered: x.isRegistered + 1,
                                    });
                                    update(ref(db, `University/${item}/registeration`), {
                                        [n]: { email: detail.email, id: detail.id },
                                    });
                                }
                            });
                        }
                    });

                    (per.uniCode === undefined ? [] : per.uniCode).forEach(async (item) => {
                        if (detail.uniCode.includes(item) === false) {
                            await get(child(ref(db), `University/` + item)).then((snapshot) => {
                                if (snapshot.exists()) {
                                    const x = snapshot.val();

                                    for (let k in x.registeration === undefined ? [] : x.registeration) {
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
            await get(child(ref(db), `Detail/${per.id}/`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const x = snapshot.val();

                        localStorage.setItem('Infor', JSON.stringify(x));
                        dispatch({ type: 'user', payload: x });
                    } else {
                        toast.error('No data available');
                    }
                })
                .then(() => setLoadingSave(false))
                .then(() => toast.success('Updated sucessfully'));
        }
    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        save();
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const checkValue = () => {
        let temp = null;
        var today = new Date();
        var birthDate = new Date(detail.dateObirth);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            temp = false;
        } else {
            temp = true;
        }
        if (
            temp === true &&
            detail.name !== '' &&
            detail.gender !== '' &&
            detail.placeOBirth !== '' &&
            detail.Address !== '' &&
            detail.enthicity &&
            errorCCCD !== true &&
            detail.idenNum !== '' &&
            detail.email !== '' &&
            errorCCCD === '' &&
            errorDateOBirth === '' &&
            errorEmail === '' &&
            errorName === ''
        ) {
            return false;
        } else {
            return true;
        }
    };
    const commonHelp = (error, value) => {
        if (value === '') {
            return (
                <div>
                    <span>Please input </span>
                </div>
            );
        }
        return error !== '' ? (
            <div>
                <span>Invalid template </span>
                <Tooltip title={error} color={'red'} key={'red'} placement="bottom">
                    <ExclamationCircleOutlined style={{ marginLeft: '5px' }} />
                </Tooltip>
            </div>
        ) : (
            ''
        );
    };
    const commonHelpNotError = (inp) => {
        return inp === '' ? (
            <div style={{ margin: '0' }}>
                <span> Please input</span>
            </div>
        ) : (
            ''
        );
    };
    const but = (
        <>
            <Modal
                title={t('title.modalsave')}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={t('button.ok')}
                cancelText={t('button.cancel')}
            >
                <p style={{ color: 'var(--name-colorN)' }}>{t('title.saveedit')}</p>
            </Modal>
            <Button
                type="primary"
                onClick={showModal}
                className="btn-save"
                loading={loadingSave}
                disabled={checkValue() === false ? false : true}
            >
                <span style={{ display: loadingSave === true ? 'none' : '' }}>{t('button.Save')}</span>
            </Button>
        </>
    );
    const score = (title, value) => {
        return (
            <div className="detail-item-input disabled">
                <h1>{title}: </h1>
                <Input className=" pr-score" value={value} disabled={true} />
            </div>
        );
    };
    const checkYear = () => {
        var today = new Date();
        var birthDate = new Date(detail.dateObirth);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            setErrorDateOBirth('You are not enough 18');
        } else {
            setErrorDateOBirth('');
        }
        return detail.dateObirth;
    };
    return (
        <div className="pr-container">
            {loading ? (
                <Skeleton active />
            ) : (
                <>
                    {localStorage.getItem('Role') !== 'user' ? (
                        <div className="pr-admin">
                            <div className="admin-avatar">
                                <div className="avatar-container">
                                    <Avatar
                                        alt="Avatar"
                                        src={image ? URL.createObjectURL(image) : detail.img}
                                        sx={{ width: 150, height: 150 }}
                                        id="avatarImg"
                                    />
                                    <div className="avatar-overlay">
                                        <label htmlFor="fileInput">
                                            <CameraOutlined className="CameraIcon" />
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <input
                                        type="file"
                                        onChange={handleImgChange}
                                        id="fileInput"
                                        className="avatar-input"
                                    />
                                </div>
                                {but}
                            </div>
                            <div className="pr-admin-frame">
                                <div className="pr-admin-input">
                                    <div className="detail-item-admin disabled">
                                        <h1>{t('title.ID')}: </h1>
                                        <Space.Compact size="large">
                                            <Input
                                                className="admin-g-s"
                                                placeholder="ID"
                                                disabled
                                                value={detail.id}
                                                onChange={(e) => handleChange(e, 'id')}
                                            />
                                        </Space.Compact>
                                    </div>
                                    <div className="detail-item-admin">
                                        <h1>{t('title.name')}: </h1>
                                        <Space.Compact size="large">
                                            <Form.Item
                                                name="email"
                                                validateStatus={errorName !== '' ? 'error' : ''}
                                                help={commonHelp(errorName, detail.name)}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input!',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    defaultValue={detail.name}
                                                    className="admin-g-s"
                                                    placeholder={t('title.phName')}
                                                    value={detail.name}
                                                    onChange={(e) => handleChange(e, 'name')}
                                                />
                                            </Form.Item>
                                        </Space.Compact>
                                    </div>
                                    <div className="detail-item-admin">
                                        <h1>{t('title.DateOfBirth')}:</h1>
                                        <Form.Item
                                            name="email"
                                            validateStatus={detail.dateObirth === '' ? 'error' : ''}
                                            help={commonHelp(errorDateOBirth, detail.errorDateOBirth)}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input!',
                                                },
                                            ]}
                                        >
                                            <DatePicker
                                                className="admin-g-s"
                                                placeholder={t('title.phDateOfBirth')}
                                                defaultValue={dayjs(detail.dateObirth, 'DD/MM/YYYY')}
                                                onChange={(e) => handleSelect(e, 'dateObirth')}
                                                format="DD/MM/YYYY"
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="detail-item-admin">
                                        <h1>{t('title.Gender')}: </h1>
                                        <Space.Compact size="large">
                                            <Space.Compact>
                                                <Form.Item
                                                    name="email"
                                                    validateStatus={detail.gender === '' ? 'error' : ''}
                                                    help={commonHelpNotError(detail.gender)}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Please input!',
                                                        },
                                                    ]}
                                                >
                                                    <div className="admin-g-s">
                                                        <Select
                                                            showSearch
                                                            placeholder={t('title.phGender')}
                                                            options={gender}
                                                            value={detail.gender}
                                                            onChange={(e) => handleSelect(e, 'gender')}
                                                        />
                                                    </div>
                                                </Form.Item>
                                            </Space.Compact>
                                        </Space.Compact>
                                    </div>

                                    <div className="detail-item-admin">
                                        <h1>{t('title.Place of birth')}: </h1>

                                        <Space.Compact size="large">
                                            <Form.Item
                                                name="email"
                                                validateStatus={detail.placeOBirth === '' ? 'error' : ''}
                                                help={commonHelpNotError(detail.placeOBirth)}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input!',
                                                    },
                                                ]}
                                            >
                                                <div className="admin-g-s">
                                                    <Select
                                                        placeholder={t('title.phPlaceOfBirth')}
                                                        size={size}
                                                        showSearch
                                                        options={provinces}
                                                        value={detail.placeOBirth}
                                                        onChange={(e) => handleSelect(e, 'placeOBirth')}
                                                    />
                                                </div>
                                            </Form.Item>
                                        </Space.Compact>
                                    </div>

                                    <div className="detail-item-admin">
                                        <h1>{t('title.Email')}: </h1>
                                        <Space.Compact size="large">
                                            <Form.Item
                                                name="email"
                                                validateStatus={errorEmail !== '' ? 'error' : ''}
                                                help={
                                                    errorEmail !== '' ? (
                                                        errorEmail === 'Please input' ? (
                                                            <span>Please input</span>
                                                        ) : (
                                                            <div>
                                                                <span>Invalid template </span>
                                                                <Tooltip
                                                                    title={errorEmail}
                                                                    color={'red'}
                                                                    key={'red'}
                                                                    placement="bottom"
                                                                >
                                                                    <ExclamationCircleOutlined
                                                                        style={{ marginLeft: '5px' }}
                                                                    />
                                                                </Tooltip>
                                                            </div>
                                                        )
                                                    ) : (
                                                        ''
                                                    )
                                                }
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input!',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    defaultValue={detail.email}
                                                    className="admin-g-s"
                                                    placeholder={t('title.phEmail')}
                                                    value={detail.email}
                                                    onChange={(e) => handleChange(e, 'email')}
                                                />
                                            </Form.Item>
                                        </Space.Compact>
                                    </div>
                                    <div className="detail-item-admin">
                                        <h1>{t('title.Ethnicity')}: </h1>
                                        <Form.Item
                                            name="email"
                                            validateStatus={detail.enthicity === '' ? 'error' : ''}
                                            help={commonHelpNotError(detail.enthicity)}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input!',
                                                },
                                            ]}
                                        >
                                            <div className="admin-g-s">
                                                <Select
                                                    placeholder={t('titile.phEthnicity')}
                                                    options={ethnicities}
                                                    onChange={(e) => handleSelect(e, 'enthicity')}
                                                    showSearch
                                                    value={detail.enthicity}
                                                />
                                            </div>
                                        </Form.Item>
                                    </div>
                                    <div className="detail-item-admin">
                                        <h1>CCCD: </h1>

                                        <Space.Compact size="large">
                                            <Form.Item
                                                name="email"
                                                validateStatus={errorCCCD !== '' ? 'error' : ''}
                                                help={commonHelp(errorCCCD, detail.idenNum)}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input!',
                                                    },
                                                ]}
                                            >
                                                <Input
                                                    className="admin-g-s"
                                                    placeholder={t('title.phCCCD')}
                                                    defaultValue={detail.idenNum}
                                                    value={detail.idenNum}
                                                    onChange={(e) => handleChange(e, 'idenNum')}
                                                    showCount
                                                    maxLength={12}
                                                />
                                            </Form.Item>
                                        </Space.Compact>
                                    </div>
                                </div>
                                <div className="detail-item-admin-address">
                                    <h1>{t('title.Address')}: </h1>

                                    <Space.Compact size="large">
                                        <Form.Item
                                            name="email"
                                            validateStatus={detail.Address === '' ? 'error' : ''}
                                            help={commonHelpNotError(detail.Address)}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input!',
                                                },
                                            ]}
                                        >
                                            <TextArea
                                                rows={4}
                                                placeholder={t('title.phAddress')}
                                                className=" pr-admin-address"
                                                defaultValue={detail.Address}
                                                value={detail.Address}
                                                onChange={(e) => handleChange(e, 'Address')}
                                            />
                                        </Form.Item>
                                    </Space.Compact>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="pro-content">
                            <div className="col1">
                                <div className="avatar">
                                    <div className="avatar-container">
                                        <Avatar
                                            alt="Avatar"
                                            src={image ? URL.createObjectURL(image) : detail.img}
                                            sx={{ width: 150, height: 150 }}
                                            id="avatarImg"
                                        />
                                        <div className="avatar-overlay">
                                            <label htmlFor="fileInput">
                                                <CameraOutlined className="CameraIcon" />
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <input
                                            type="file"
                                            onChange={handleImgChange}
                                            id="fileInput"
                                            className="avatar-input"
                                        />
                                    </div>
                                </div>
                                <div className="detail-item disabled">
                                    <h1>{t('title.ID')}: </h1>
                                    <Space.Compact size="large">
                                        <Input
                                            disabled
                                            className="g-s pr-ID "
                                            value={detail.id}
                                            onChange={(e) => handleChange(e, 'id')}
                                        />
                                    </Space.Compact>
                                </div>
                                <div className="detail-item">
                                    <h1>{t('title.name')}: </h1>
                                    <Space.Compact size="large">
                                        <Form.Item
                                            name="email"
                                            validateStatus={errorName !== '' ? 'error' : ''}
                                            help={commonHelp(errorName, detail.name)}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input!',
                                                },
                                            ]}
                                        >
                                            <Input
                                                defaultValue={detail.name}
                                                placeholder={t('title.phName')}
                                                className="g-s pr-st-name"
                                                value={detail.name}
                                                onChange={(e) => handleChange(e, 'name')}
                                            />
                                        </Form.Item>
                                    </Space.Compact>
                                </div>
                                <div className="detail-item">
                                    <h1>{t('title.DateOfBirth')}: </h1>
                                    <Form.Item
                                        name="email"
                                        validateStatus={detail.dateObirth === '' ? 'error' : ''}
                                        help={commonHelp(errorDateOBirth, detail.errorDateOBirth)}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input!',
                                            },
                                        ]}
                                    >
                                        <DatePicker
                                            placeholder={t('title.phDateOfBirth')}
                                            className="g-s pr-date-picker"
                                            defaultValue={dayjs(detail.dateObirth, 'DD/MM/YYYY')}
                                            value={dayjs(detail.dateObirth, 'DD/MM/YYYY')}
                                            onChange={(e) => handleSelect(e, 'dateObirth')}
                                            format="DD-MM-YYYY"
                                        />
                                    </Form.Item>
                                </div>
                                <div className="detail-item">
                                    <h1>{t('title.Gender')}: </h1>
                                    <Space.Compact size="large">
                                        <Space.Compact>
                                            <Form.Item
                                                name="email"
                                                validateStatus={detail.gender === '' ? 'error' : ''}
                                                help={commonHelpNotError(detail.gender)}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Please input!',
                                                    },
                                                ]}
                                            >
                                                <div className="g-s pr-gender">
                                                    <Select
                                                        placeholder={t('title.phGender')}
                                                        showSearch
                                                        options={gender}
                                                        className="g-s pr-gender"
                                                        value={detail.gender}
                                                        onChange={(e) => handleSelect(e, 'gender')}
                                                    />
                                                </div>
                                            </Form.Item>
                                        </Space.Compact>
                                    </Space.Compact>
                                </div>

                                <div className="detail-item">
                                    <h1>{t('title.Place of birth')}: </h1>

                                    <Space.Compact size="large">
                                        <Form.Item
                                            name="email"
                                            validateStatus={detail.placeOBirth === '' ? 'error' : ''}
                                            help={commonHelpNotError(detail.placeOBirth)}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input!',
                                                },
                                            ]}
                                        >
                                            <div className="g-s pr-gender">
                                                <Select
                                                    placeholder={t('title.phPlaceOfBirth')}
                                                    size={size}
                                                    showSearch
                                                    options={provinces}
                                                    className="g-s pr-place-birth"
                                                    defaultValue={detail.placeOBirth}
                                                    value={detail.placeOBirth}
                                                    onChange={(e) => handleSelect(e, 'placeOBirth')}
                                                />
                                            </div>
                                        </Form.Item>
                                    </Space.Compact>
                                </div>
                                <div className="detail-item">
                                    <h1>{t('title.Email')}: </h1>
                                    <Space.Compact size="large">
                                        <Form.Item
                                            name="email"
                                            validateStatus={errorEmail !== '' ? 'error' : ''}
                                            help={
                                                errorEmail !== '' ? (
                                                    errorEmail === 'Please input' ? (
                                                        <span>Please input</span>
                                                    ) : (
                                                        <div>
                                                            <span>Invalid template </span>
                                                            <Tooltip
                                                                title={errorEmail}
                                                                color={'red'}
                                                                key={'red'}
                                                                placement="bottom"
                                                            >
                                                                <ExclamationCircleOutlined
                                                                    style={{ marginLeft: '5px' }}
                                                                />
                                                            </Tooltip>
                                                        </div>
                                                    )
                                                ) : (
                                                    ''
                                                )
                                            }
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input!',
                                                },
                                            ]}
                                        >
                                            <Input
                                                placeholder={t('title.phEmail')}
                                                className="g-s pr-email"
                                                value={detail.email}
                                                defaultValue={detail.email}
                                                onChange={(e) => handleChange(e, 'email')}
                                                suffix={
                                                    <Tooltip title="Private Email">
                                                        <InfoCircleOutlined className="InfoCircleOutlined" />
                                                    </Tooltip>
                                                }
                                            />
                                        </Form.Item>
                                    </Space.Compact>
                                </div>
                                <div className="detail-item">
                                    <h1>{t('title.Ethnicity')}: </h1>
                                    <Form.Item
                                        name="email"
                                        validateStatus={detail.enthicity === '' ? 'error' : ''}
                                        help={commonHelpNotError(detail.enthicity)}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input!',
                                            },
                                        ]}
                                    >
                                        <div className="g-s pr-gender">
                                            <Select
                                                placeholder={t('title.phEthnicity')}
                                                options={ethnicities}
                                                onChange={(e) => handleSelect(e, 'enthicity')}
                                                showSearch
                                                className="g-s pr-ethnicity"
                                                value={detail.enthicity}
                                            />
                                        </div>
                                    </Form.Item>
                                </div>
                                <div className="detail-item">
                                    <h1>CCCD: </h1>

                                    <Space.Compact size="large">
                                        <Form.Item
                                            name="email"
                                            validateStatus={errorCCCD !== '' ? 'error' : ''}
                                            help={commonHelp(errorCCCD, detail.idenNum)}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input!',
                                                },
                                            ]}
                                        >
                                            <Input
                                                className="g-s"
                                                placeholder={t('title.phCCCD')}
                                                defaultValue={detail.idenNum}
                                                value={detail.idenNum}
                                                onChange={(e) => handleChange(e, 'idenNum')}
                                                showCount
                                                maxLength={12}
                                            />
                                        </Form.Item>
                                    </Space.Compact>
                                </div>

                                <div className="detail-item">
                                    <h1>{t('title.Address')}: </h1>
                                    <Space.Compact size="large">
                                        <Form.Item
                                            name="email"
                                            validateStatus={detail.Address === '' ? 'error' : ''}
                                            help={commonHelpNotError(detail.Address)}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input!',
                                                },
                                            ]}
                                        >
                                            <TextArea
                                                placeholder={t('title.phAddress')}
                                                rows={2}
                                                className="g-s pr-address"
                                                value={detail.Address}
                                                defaultValue={detail.Address}
                                                onChange={(e) => handleChange(e, 'Address')}
                                            />
                                        </Form.Item>
                                    </Space.Compact>
                                </div>
                            </div>
                            <div className="col2">
                                <div className="pr-input">
                                    {score(t('title.MathScore'), detail.MathScore)}
                                    {score(t('title.EnglishScore'), detail.EnglishScore)}
                                    {score(t('title.LiteratureScore'), detail.LiteratureScore)}
                                    {score(t('title.AverageScore'), detail.AverageScore)}
                                </div>
                                <div className="detail-item-university">
                                    <h1>{t('title.University')}: </h1>

                                    <Select
                                        mode="multiple"
                                        maxCount={MAX_COUNT}
                                        options={arr}
                                        onChange={(e) => handleSelect(e, 'uniCode')}
                                        suffixIcon={suffix}
                                        placeholder={<span>{t('title.phUniversities')}</span>}
                                        showSearch
                                        className="g-s university"
                                        style={{
                                            width: '80%',
                                        }}
                                        value={detail.uniCode}
                                    />

                                    {but}
                                </div>
                                <div className="table">
                                    <Spin spinning={loadingTable} style={{ margin: '0', padding: '0' }}>
                                        <Table
                                            size="small"
                                            dataSource={suitableSchoolList}
                                            columns={columns}
                                            rowKey="code"
                                            scroll={{ x: 190, y: 'calc(100vh - 380px)' }}
                                            pagination={{
                                                defaultPageSize: '10',
                                                pageSizeOptions: ['10', '20', '40', '100'],
                                                total: suitableSchoolList.length,
                                                showSizeChanger: true,
                                                showQuickJumper: true,
                                                showTotal: (total) => `Total ${total} items`,
                                            }}
                                            rowHoverable={false}
                                            className="table"
                                            style={{ margin: '0', padding: '0' }}
                                        />
                                    </Spin>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
export default Pr;
