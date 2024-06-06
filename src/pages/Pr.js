import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, Select, Space, Table, Skeleton, Spin, Tooltip, DatePicker, Modal } from 'antd';
import '../assets/admin/css/profile.css';
import 'firebase/auth';
import { ref, child, getDatabase, get, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { CameraOutlined, DownOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar } from '@mui/material';
import { storage } from './firebaseConfig';
import { getDownloadURL, uploadBytes, ref as storageRef } from 'firebase/storage';
import { ethnicities, firebaseConfig, gender, provinces } from '../constants/constants';
import { useTranslation } from 'react-i18next';
import Highlighter from 'react-highlight-words';
import dayjs from 'dayjs';
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
    const dateFormatList = 'DD/MM/YYYY';
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                        Search
                    </Button>

                    <Button type="link" size="small" onClick={() => close()}>
                        Close
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
            width: 90,
        },
        {
            title: t('table.Number of students registered'),
            dataIndex: 'isRegistered',
            key: 'isRegistered',
            width: 90,

            sorter: (a, b) => a.isRegistered - b.isRegistered,
        },
        {
            title: t('table.Target'),
            dataIndex: 'capacity',
            key: 'capacity',
            width: 90,

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
        const personal = JSON.parse(localStorage.getItem('Infor'));
        get(child(ref(db), `Detail/` + personal.id)).then((snapshot) => {
            if (snapshot.exists()) {
                const x = snapshot.val();
                dispatch({ type: 'user', payload: x });
            }
        });

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
        const newValue = e.target.value;
        dispatch({ type: 'update', payload: { propertyName, newValue } });
    };
    const handleSelect = (e, propertyName) => {
        const newValue = e;
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
                        toast.error('No data available');
                    }
                });

                handleSelect(downLoadUrl, 'img');

                setImage(null);
            })
            .catch((error) => {
                toast.error(error.message, 'Error');
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

                                const n = detail.email.replace(/\./g, ',');
                                update(ref(db, 'University/' + item), {
                                    isRegistered: x.isRegistered + 1,
                                });
                                update(ref(db, `University/${item}/registeration`), {
                                    [n]: { email: detail.email, id: detail.id },
                                });
                            }
                        });
                    }
                });

                (per.uniCode === undefined ? [] : per.uniCode).forEach((item) => {
                    if (detail.uniCode.includes(item) === false) {
                        get(child(ref(db), `University/` + item)).then((snapshot) => {
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
        get(child(ref(db), `Detail/${per.id}/`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();

                    localStorage.setItem('Infor', JSON.stringify(x));
                    dispatch({ type: 'user', payload: x });
                } else {
                    toast.error('No data available');
                }
            })
            .then(() => setLoadingSave(false));

        toast.success('Updated sucessfully');
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
                            <div className="detail-item">
                                <h1>{t('title.ID')}: </h1>
                                <Space.Compact size="large">
                                    <Input
                                        disabled
                                        className="g-s pr-ID"
                                        value={detail.id}
                                        onChange={(e) => handleChange(e, 'id')}
                                    />
                                </Space.Compact>
                            </div>
                            <div className="detail-item">
                                <h1>{t('title.name')}: </h1>
                                <Space.Compact size="large">
                                    <Input
                                        className="g-s pr-st-name"
                                        value={detail.name}
                                        onChange={(e) => handleChange(e, 'name')}
                                    />
                                </Space.Compact>
                            </div>
                            <div className="detail-item">
                                <h1>{t('title.DateOfBirth')}: </h1>
                                <Space.Compact size="mid">
                                    <Space.Compact size="mid">
                                        <DatePicker
                                            className="g-s pr-date-picker"
                                            value={dayjs(detail.dateObirth, dateFormatList)}
                                            format={dateFormatList}
                                            onChange={(e) => handleSelect(e, 'dateObirth')}
                                        />
                                    </Space.Compact>
                                </Space.Compact>
                            </div>
                            <div className="detail-item">
                                <h1>{t('title.Gender')}: </h1>
                                <Space.Compact size="large">
                                    <Space.Compact>
                                        <Select
                                            showSearch
                                            placeholder="Choose your gender"
                                            options={gender}
                                            className="g-s pr-gender"
                                            value={detail.gender}
                                            onChange={(e) => handleSelect(e, 'gender')}
                                        />
                                    </Space.Compact>
                                </Space.Compact>
                            </div>

                            <div className="detail-item">
                                <h1>{t('title.Place of birth')}: </h1>

                                <Space.Compact size="large">
                                    <Select
                                        size={size}
                                        showSearch
                                        options={provinces}
                                        className="g-s pr-place-birth"
                                        value={detail.placeOBirth}
                                        onChange={(e) => handleSelect(e, 'placeOBirth')}
                                    />
                                </Space.Compact>
                            </div>
                            <div className="detail-item">
                                <h1>{t('title.Email')}: </h1>
                                <Space.Compact size="large">
                                    <Input
                                        className="g-s pr-email"
                                        value={detail.email}
                                        onChange={(e) => handleChange(e, 'email')}
                                        suffix={
                                            <Tooltip title="Private Email">
                                                <InfoCircleOutlined className="InfoCircleOutlined" />
                                            </Tooltip>
                                        }
                                    />
                                </Space.Compact>
                            </div>
                            <div className="detail-item">
                                <h1>{t('title.Ethnicity')}: </h1>
                                <Select
                                    options={ethnicities}
                                    onChange={(e) => handleSelect(e, 'enthicity')}
                                    showSearch
                                    className="g-s pr-ethnicity"
                                />
                            </div>
                            <div className="detail-item">
                                <h1>CCCD: </h1>

                                <Space.Compact size="large">
                                    <Input
                                        className="g-s pr-CCCD"
                                        value={detail.idenNum}
                                        onChange={(e) => handleChange(e, 'idenNum')}
                                    />
                                </Space.Compact>
                            </div>

                            <div className="detail-item">
                                <h1>{t('title.Address')}: </h1>

                                <Space.Compact size="large">
                                    <TextArea
                                        rows={2}
                                        className="g-s pr-address"
                                        value={detail.Address}
                                        onChange={(e) => handleChange(e, 'Address')}
                                    />
                                </Space.Compact>
                            </div>
                        </div>
                        <div className="col2">
                            <div className="pr-input">
                                <div className="detail-item">
                                    <h1>{t('title.MathScore')}: </h1>
                                    <Space.Compact size="large">
                                        <Input
                                            className="g-s pr-score"
                                            value={detail.MathScore}
                                            onChange={(e) => handleChange(e, 'email')}
                                            disabled={true}
                                        />
                                    </Space.Compact>
                                </div>
                                <div className="detail-item">
                                    <h1>{t('title.EnglishScore')}: </h1>
                                    <Space.Compact size="large">
                                        <Input
                                            className="g-s pr-score"
                                            value={detail.EnglishScore}
                                            onChange={(e) => handleChange(e, 'email')}
                                            disabled={true}
                                        />
                                    </Space.Compact>
                                </div>
                                <div className="detail-item">
                                    <h1>{t('title.LiteratureScore')}: </h1>
                                    <Space.Compact size="large">
                                        <Input
                                            className="g-s pr-score"
                                            value={detail.LiteratureScore}
                                            onChange={(e) => handleChange(e, 'email')}
                                            disabled={true}
                                        />
                                    </Space.Compact>
                                </div>
                            </div>
                            <div className="detail-item-university">
                                <h1>{t('title.University')}: </h1>
                                <Space
                                    style={{
                                        width: '100%',
                                    }}
                                    direction="vertical"
                                >
                                    <Select
                                        mode="multiple"
                                        maxCount={MAX_COUNT}
                                        options={arr}
                                        onChange={(e) => handleSelect(e, 'uniCode')}
                                        suffixIcon={suffix}
                                        placeholder="Selected universities"
                                        showSearch
                                        className="g-s university"
                                    />
                                </Space>

                                <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                    <p>Do you want to save these changes?</p>
                                </Modal>
                                <Spin spinning={loadingSave}>
                                    <Button type="primary" onClick={showModal} className="btn-save">
                                        <span>{t('button.Save')}</span>
                                    </Button>
                                </Spin>
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
                </>
            )}
        </div>
    );
}
export default Pr;
