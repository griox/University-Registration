import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Space, Table, Skeleton, Spin, Tooltip } from 'antd';
import '../assets/admin/css/profile.css';
import 'firebase/auth';
import { ref, child, getDatabase, get, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { CameraOutlined, DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Avatar } from '@mui/material';
import { storage } from './firebaseConfig';
import { getDownloadURL, uploadBytes, ref as storageRef } from 'firebase/storage';
import { ethnicities, firebaseConfig, gender, provinces } from '../constants/constants';
import { GetColumnSearchProps } from '../commonFunctions';
import { useTranslation } from 'react-i18next';
const MAX_COUNT = 5;
function Pr() {
    const { t } = useTranslation('profile');
    const [suitableSchoolList, setSuitableSchoolList] = useState([]);

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

    const columns = [
        {
            title: t('table.Code'),
            dataIndex: 'code',
            key: 'code',
            ...GetColumnSearchProps('code'),
        },
        {
            title: t('table.Name'),
            dataIndex: 'name',
            key: 'name',
            ...GetColumnSearchProps('name'),
        },
        {
            title: t('table.Entrance Score'),
            dataIndex: 'score',
            key: 'score',
            ...GetColumnSearchProps('score'),
        },
        {
            title: t('table.Target'),
            dataIndex: 'capacity',
            key: 'capacity',
            ...GetColumnSearchProps('capacity'),
        },
        {
            title: t('table.Number of students registered'),
            dataIndex: 'isRegistered',
            key: 'isRegistered',
        },
        {
            title: t('table.Action'),
            key: 'action',
            render: (text, record) => (
                <Button
                    onClick={() => addUniversity(record.code)}
                    disabled={detail.uniCode.includes(record.code) || detail.uniCode.length === 5}
                >
                    {t('button.Add')}
                </Button>
            ),
        },
    ];
    useEffect(() => {
        const personal = JSON.parse(localStorage.getItem('Infor'));

        const averageScore = personal.EnglishScore + personal.LiteratureScore + personal.MathScore;
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
        dispatch({ type: 'user', payload: personal });
        setLoading(false);
    }, [db, dispatch]);
    const addUniversity = (uniCode) => {
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
            })
            .catch((error) => {
                toast.error(error.message, 'Error');
            });
    };
    const save = () => {
        const confirm = window.confirm('Are you sure want to save your changes?');
        if (confirm) {
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

                                    var m = x.registeration === undefined ? [] : x.registeration;
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
        } else {
            return;
        }
    };

    return (
        <div className="container">
            {loading ? (
                <Skeleton active />
            ) : (
                <>
                    <div className="pr-content">
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
                                        <CameraOutlined className="CameraIcon" />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <input type="file" onChange={handleImgChange} id="fileInput" className="avatar-input" />
                            </div>
                        </div>

                        <div className="input">
                            <div className="detail-item">
                                <h1>{t('title.name')}: </h1>
                                <Space.Compact size="large">
                                    <Input
                                        className="g-s size-input"
                                        value={detail.name}
                                        onChange={(e) => handleChange(e, 'name')}
                                    />
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
                                            className="g-s"
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
                                        className="g-s"
                                        value={detail.placeOBirth}
                                        onChange={(e) => handleSelect(e, 'placeOBirth')}
                                    />
                                </Space.Compact>
                            </div>
                            <div className="detail-item">
                                <h1>{t('title.Address')}: </h1>

                                <Space.Compact size="large">
                                    <Input
                                        className="g-s addr size-input"
                                        value={detail.Address}
                                        onChange={(e) => handleChange(e, 'Address')}
                                    />
                                </Space.Compact>
                            </div>
                            <div className="detail-item">
                                <h1>{t('title.Ethnicity')}: </h1>
                                <Select
                                    defaultValue="Kinh"
                                    options={ethnicities}
                                    onChange={(e) => handleSelect(e, 'enthicity')}
                                    showSearch
                                    className="g-s ethnicity"
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
                                <h1>{t('title.Email')}: </h1>
                                <Space.Compact size="large">
                                    <Input
                                        className="g-s size-input"
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
                                <h1>{t('title.MathScore')}: </h1>
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
                                <h1>{t('title.EnglishScore')}: </h1>
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
                                <h1>{t('title.LiteratureScore')}: </h1>
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
                        <h1>{t('title.University')}: </h1>
                        <Space size="large">
                            <Select
                                mode="multiple"
                                maxCount={MAX_COUNT}
                                value={detail.uniCode}
                                options={arr}
                                onChange={(e) => handleSelect(e, 'uniCode')}
                                suffixIcon={suffix}
                                placeholder="Selected universities"
                                showSearch
                                className="g-s university"
                            />
                        </Space>
                        <Spin spinning={loadingSave}>
                            <Button type="primary" onClick={() => save()} className="btn-save">
                                {t('button.Save')}
                            </Button>
                        </Spin>
                    </div>
                    <Spin spinning={loadingTable}>
                        <Table
                            dataSource={suitableSchoolList}
                            columns={columns}
                            rowKey="code"
                            scroll={{ x: 190, y: 'calc(100vh - 590px)' }}
                            pagination={{
                                defaultPageSize: '10',
                                pageSizeOptions: ['10', '20', '40', '100'],
                                total: suitableSchoolList.length,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total) => `Total ${total} items`,
                            }}
                            className="table"
                        />
                    </Spin>
                </>
            )}
        </div>
    );
}
export default Pr;
