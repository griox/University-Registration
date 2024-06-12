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
    const [errorCCCD, setErrorCCCD] = useState(false);
    const [errorCCCDExist, setErrorCCCDExist] = useState(false);
    const [errorDateOBirth, setErrorDateOBirth] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);

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
            if (newValue === '') {
                dispatch({ type: 'update', payload: { propertyName, newValue } });
                return;
            }
            if (
                (/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(newValue) ||
                    /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/.test(newValue)) === false
            ) {
                setErrorEmail(true);
            }
            setErrorEmail(false);
        }
        if (propertyName === 'idenNum') {
            if (newValue === '') {
                dispatch({ type: 'update', payload: { propertyName, newValue } });
                return;
            }
            if (newValue.length < 12) {
                setErrorCCCD(true);
                return;
            }
            if (/^\d+$/.test(newValue) === false) {
                setErrorCCCD(true);
                return;
            }

            get(child(ref(db), `Detail/`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    for (let i in x) {
                        if (x[i].idenNum === detail.idenNum) {
                            setErrorCCCDExist(true);
                            return;
                        }
                    }
                }
            });
            get(child(ref(db), `Admin/`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    for (let i in x) {
                        if (x[i].idenNum === detail.idenNum) {
                            setErrorCCCDExist(true);
                            return;
                        }
                    }
                }
            });
            get(child(ref(db), `Super_Admin/`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    for (let i in x) {
                        if (x[i].idenNum === detail.idenNum) {
                            setErrorCCCDExist(true);
                            return;
                        }
                    }
                }
            });
            setErrorCCCDExist(false);

            setErrorCCCD(false);
        }

        if (propertyName === 'name') {
            if (/^[a-zA-Z\u00C0-\u017F\s]*$/.test(newValue) === false) {
                setErrorName(true);
                return;
            }
            newValue = newValue.trim().replace(/\s{2,}/g, ' ');
            setErrorName(false);
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
                setErrorDateOBirth(true);
                return;
            } else {
                setErrorDateOBirth(false);
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
            await update(ref(db, 'Super_Admin/' + per.id), {
                name: detail.name,
                gender: detail.gender,
                placeOBirth: detail.placeOBirth,
                Address: detail.Address,
                enthicity: detail.enthicity,
                idenNum: detail.idenNum,
                email: detail.email,
                dateObirth: detail.dateObirth,
            }).then(() => handleSubmit(per.id));
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
            await update(ref(db, 'Admin/' + per.id), {
                name: detail.name,
                gender: detail.gender,
                placeOBirth: detail.placeOBirth,
                Address: detail.Address,
                enthicity: detail.enthicity,
                idenNum: detail.idenNum,
                email: detail.email,
                dateObirth: detail.dateObirth,
            }).then(() => handleSubmit(per.id));
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
                                    disabled={
                                        (detail.name !== '' &&
                                            detail.gender !== '' &&
                                            detail.placeOBirth !== '' &&
                                            detail.Address !== '' &&
                                            detail.enthicity &&
                                            errorCCCD !== true &&
                                            detail.idenNum !== '' &&
                                            detail.email !== '') === true
                                            ? false
                                            : true
                                    }
                                >
                                    <span style={{ display: loadingSave === true ? 'none' : '' }}>
                                        {t('button.Save')}
                                    </span>
                                </Button>
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
                                                validateStatus={detail.name === '' ? 'error' : ''}
                                                help={
                                                    detail.name === '' ? (
                                                        <div style={{ margin: '0' }}>
                                                            <span>Please enter full name </span>
                                                        </div>
                                                    ) : errorName === true ? (
                                                        <div>
                                                            <span>Invalid template </span>
                                                            <Tooltip
                                                                title={'Name must contain A-Z and a-z'}
                                                                color={'red'}
                                                                key={'red'}
                                                                placement="bottom"
                                                            >
                                                                <ExclamationCircleOutlined
                                                                    style={{ marginLeft: '5px' }}
                                                                />
                                                            </Tooltip>
                                                        </div>
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
                                                    className="admin-g-s"
                                                    placeholder={t('title.phName')}
                                                    value={detail.name}
                                                    defaultValue={detail.name}
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
                                            help={
                                                detail.dateObirth === '' ? (
                                                    <div style={{ margin: '0' }}>
                                                        <span>Please enter date of birth </span>
                                                    </div>
                                                ) : errorDateOBirth === true ? (
                                                    <div style={{ margin: '0' }}>
                                                        <span>You are not enough 18 </span>
                                                    </div>
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
                                            <DatePicker
                                                className="admin-g-s"
                                                placeholder={t('title.phDateOfBirth')}
                                                defaultValue={dayjs(detail.dateObirth, 'DD/MM/YYYY')}
                                                onChange={(e) => handleSelect(e, 'dateObirth')}
                                                format="DD-MM-YYYY"
                                            />
                                        </Form.Item>
                                        {/* <DatePicker
                                            pr-date-picker"
                                            selected={dayjs(detail.dateObirth, 'DD-MM-YYYY')}
                                            onChange={handleDate}
                                            format="DD-MM-YYYY"
                                        /> */}
                                    </div>
                                    <div className="detail-item-admin">
                                        <h1>{t('title.Gender')}: </h1>
                                        <Space.Compact size="large">
                                            <Space.Compact>
                                                <Form.Item
                                                    name="email"
                                                    validateStatus={detail.gender === '' ? 'error' : ''}
                                                    help={
                                                        detail.gender === '' ? (
                                                            <div style={{ margin: '0' }}>
                                                                <span>Please enter gender </span>
                                                            </div>
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
                                                help={
                                                    detail.placeOBirth === '' ? (
                                                        <div style={{ margin: '0' }}>
                                                            <span>Please enter place of birth </span>
                                                        </div>
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
                                                validateStatus={detail.email === '' ? 'error' : ''}
                                                help={
                                                    detail.email === '' ? (
                                                        <div style={{ margin: '0' }}>
                                                            <span>Please enter email </span>
                                                        </div>
                                                    ) : errorEmail === true ? (
                                                        <div>
                                                            {console.log(detail.idenNum)}

                                                            <span>Invalid template </span>
                                                            <Tooltip
                                                                title={'Format is not correct '}
                                                                color={'red'}
                                                                key={'red'}
                                                                placement="bottom"
                                                            >
                                                                <ExclamationCircleOutlined
                                                                    style={{ marginLeft: '5px' }}
                                                                />
                                                            </Tooltip>
                                                        </div>
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
                                                    className="admin-g-s"
                                                    placeholder={t('title.phEmail')}
                                                    defaultValue={detail.email}
                                                    value={detail.email}
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
                                    <div className="detail-item-admin">
                                        <h1>{t('title.Ethnicity')}: </h1>
                                        <Form.Item
                                            name="email"
                                            validateStatus={detail.enthicity === '' ? 'error' : ''}
                                            help={
                                                detail.enthicity === '' ? (
                                                    <div style={{ margin: '0' }}>
                                                        <span>Please enter ethnicity </span>
                                                    </div>
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
                                                validateStatus={detail.idenNum === '' || errorCCCD ? 'error' : ''}
                                                help={
                                                    detail.idenNum === '' ? (
                                                        <div style={{ margin: '0' }}>
                                                            {console.log('rong')}
                                                            <span>Please enter inden number </span>
                                                        </div>
                                                    ) : errorCCCD ? (
                                                        <div>
                                                            <span>Invalid template </span>
                                                            <Tooltip
                                                                title={'Please enter only and must 12 number '}
                                                                color={'red'}
                                                                key={'red'}
                                                                placement="bottom"
                                                            >
                                                                <ExclamationCircleOutlined
                                                                    style={{ marginLeft: '5px' }}
                                                                />
                                                            </Tooltip>
                                                        </div>
                                                    ) : errorCCCDExist === true ? (
                                                        <div>
                                                            <span>Inden number has existed</span>
                                                        </div>
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
                                            help={
                                                detail.Address === '' ? (
                                                    <div style={{ margin: '0' }}>
                                                        <span>Please enter address </span>
                                                    </div>
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
                                            validateStatus={detail.name === '' ? 'error' : ''}
                                            help={
                                                detail.name === '' ? (
                                                    <div style={{ margin: '0' }}>
                                                        <span>Please enter full name </span>
                                                    </div>
                                                ) : errorName === true ? (
                                                    <div>
                                                        <span>Invalid template </span>
                                                        <Tooltip
                                                            title={'Name must contain A-Z and a-z'}
                                                            color={'red'}
                                                            key={'red'}
                                                            placement="bottom"
                                                        >
                                                            <ExclamationCircleOutlined style={{ marginLeft: '5px' }} />
                                                        </Tooltip>
                                                    </div>
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
                                        help={
                                            detail.dateObirth === '' ? (
                                                <div style={{ margin: '0' }}>
                                                    <span>Please enter date of birth </span>
                                                </div>
                                            ) : errorDateOBirth === true ? (
                                                <div style={{ margin: '0' }}>
                                                    <span>You are not enough 18 </span>
                                                </div>
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
                                                help={
                                                    detail.gender === '' ? (
                                                        <div style={{ margin: '0' }}>
                                                            <span>Please enter gender </span>
                                                        </div>
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
                                            help={
                                                detail.placeOBirth === '' ? (
                                                    <div style={{ margin: '0' }}>
                                                        <span>Please enter place of birth </span>
                                                    </div>
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
                                            validateStatus={detail.email === '' ? 'error' : ''}
                                            help={
                                                detail.email === '' ? (
                                                    <div style={{ margin: '0' }}>
                                                        <span>Please enter email</span>
                                                    </div>
                                                ) : errorEmail === true ? (
                                                    <div>
                                                        {console.log(detail.idenNum)}

                                                        <span>Invalid template </span>
                                                        <Tooltip
                                                            title={'Format is not correct '}
                                                            color={'red'}
                                                            key={'red'}
                                                            placement="bottom"
                                                        >
                                                            <ExclamationCircleOutlined style={{ marginLeft: '5px' }} />
                                                        </Tooltip>
                                                    </div>
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
                                        help={
                                            detail.enthicity === '' ? (
                                                <div style={{ margin: '0' }}>
                                                    <span>Please enter ethnicity </span>
                                                </div>
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
                                            validateStatus={detail.idenNum === '' || errorCCCD ? 'error' : ''}
                                            help={
                                                detail.idenNum === '' ? (
                                                    <div style={{ margin: '0' }}>
                                                        {console.log('rong')}
                                                        <span>Please enter ethnicity </span>
                                                    </div>
                                                ) : errorCCCD ? (
                                                    <div>
                                                        {console.log(detail.idenNum)}

                                                        <span>Invalid template </span>
                                                        <Tooltip
                                                            title={'Please enter only and must 12 number '}
                                                            color={'red'}
                                                            key={'red'}
                                                            placement="bottom"
                                                        >
                                                            <ExclamationCircleOutlined style={{ marginLeft: '5px' }} />
                                                        </Tooltip>
                                                    </div>
                                                ) : errorCCCDExist === true ? (
                                                    <div>
                                                        <span>Inden number has existed</span>
                                                    </div>
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
                                    {console.log(detail.Address)}
                                    <Space.Compact size="large">
                                        <Form.Item
                                            name="email"
                                            validateStatus={detail.Address === '' ? 'error' : ''}
                                            help={
                                                detail.Address === '' ? (
                                                    <div style={{ margin: '0' }}>
                                                        <span>Please enter address </span>
                                                    </div>
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
                                    <div className="detail-item-input disabled">
                                        <h1>{t('title.MathScore')}: </h1>
                                        <Input
                                            className=" pr-score"
                                            value={detail.MathScore}
                                            onChange={(e) => handleChange(e, 'email')}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="detail-item-input disabled">
                                        <h1>{t('title.EnglishScore')}: </h1>
                                        <Input
                                            className="pr-score"
                                            value={detail.EnglishScore}
                                            onChange={(e) => handleChange(e, 'email')}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="detail-item-input disabled">
                                        <h1>{t('title.LiteratureScore')}: </h1>
                                        <Input
                                            className=" pr-score"
                                            value={detail.LiteratureScore}
                                            onChange={(e) => handleChange(e, 'email')}
                                            disabled={true}
                                        />
                                    </div>
                                    <div className="detail-item-input disabled">
                                        <h1>{t('title.AverageScore')}: </h1>
                                        <Input
                                            className=" pr-score"
                                            value={detail.AverageScore}
                                            onChange={(e) => handleChange(e, 'email')}
                                            disabled={true}
                                        />
                                    </div>
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
                                        disabled={
                                            (detail.name !== '' &&
                                                detail.gender !== '' &&
                                                detail.placeOBirth !== '' &&
                                                detail.Address !== '' &&
                                                detail.enthicity &&
                                                errorCCCD !== true &&
                                                detail.idenNum !== '' &&
                                                detail.email !== '') === true
                                                ? false
                                                : true
                                        }
                                    >
                                        <span style={{ display: loadingSave === true ? 'none' : '' }}>
                                            {t('button.Save')}
                                        </span>
                                    </Button>
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
