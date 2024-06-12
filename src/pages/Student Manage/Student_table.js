import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Tooltip, Typography, Spin, Modal } from 'antd';
import './css/table.css';
import 'antd/dist/reset.css';
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
    ManOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { WomanOutlined } from '@ant-design/icons';
import { get, ref, child, remove, update, set } from 'firebase/database';
import ModalAdd from './Modal_add';
import ModalDetail from './Modal_Detail';
import { useTranslation } from 'react-i18next';
import { database } from '../firebaseConfig.js';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '../../constants/constants.js';
import { initializeApp } from 'firebase/app';
import { HandleErrorEdit, encodePath } from '../../commonFunctions.js';
import CryptoJS from 'crypto-js';

const StudentList = () => {
    const { t } = useTranslation('student');
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [studentData, setStudentData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [studentUnicode, setstudentUnicode] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [Loading, setLoading] = useState(true);
    const tableRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mess, setMess] = useState('');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const [bell, setBell] = useState(false);
    const secretKey = 'Tvx1234@';

    const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
        const [error, setError] = useState(null);
        const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
        // const inputNode = <Input />;

        const isName = dataIndex === 'name';
        const isMath = dataIndex === 'MathScore';
        const isLiterature = dataIndex === 'LiteratureScore';
        const isEnglish = dataIndex === 'EnglishScore';
        const isEmail = dataIndex === 'email';

        const rules = [
            {
                validator: (_, value) => {
                    if (dataIndex) {
                        value = value.toString();
                        if (value.trim().replace(/\s{2,}/g, ' ') === '') {
                            setError('Please input');
                            return <HandleErrorEdit />;
                        }
                    }
                    if (isMath || isEnglish || isLiterature) {
                        if (/^[-+]?(?:\d*\.?\d+|\d+\.)$/.test(value) === false) {
                            setError('Score only contain number');
                            return <HandleErrorEdit />;
                        }
                        if (!(value >= 0 && value <= 10)) {
                            setError('Score must >= 0 and <= 10 ');
                            return <HandleErrorEdit />;
                        }
                        if (value.length > 4) {
                            setError('Grade contain 2 decimal number');
                            return <HandleErrorEdit />;
                        }
                    }
                    if (isName) {
                        if (
                            /^[A-Za-zđĐÁÀẢÃẠÂẮẰẲẴẶẤẦẨẪẬÉÈẺẼẸẾỀỂÊỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤỨƯỪỬỮỰÝỲỶỸỴáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọốôồổỗộớờởơỡợúùủũụứưừửữựýỳỷỹỵ\s]+$/.test(
                                value,
                            ) === false
                        ) {
                            setError('Name only contain letter A-Z and a-z');
                            return <HandleErrorEdit />;
                        }
                    }
                    if (isEmail) {
                        if (
                            (/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value) ||
                                /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/.test(value)) === false
                        ) {
                            setError('Format is not correct');
                            return <HandleErrorEdit />;
                        }
                        // if (checkEmailExist(value) === true) {
                        //     setError('Email has existed');
                        //     return;
                        // }
                        studentData.map((item) => {
                            if (item.email === value) {
                                setError('Email has existed');
                                return <HandleErrorEdit />;
                            }
                            return 0;
                        });
                        for (let i = 0; i < studentData.length; i++) {
                            if (studentData[i].email === value) {
                                setError('Email has existed');
                                break;
                            }
                        }
                        if (error !== '') {
                            return;
                        }
                        setError('');
                    }

                    setError(null);
                    return Promise.resolve();
                },
            },
        ];

        useEffect(() => {
            if (!editing) {
                setError(null);
            }
        }, [editing]);

        return (
            <td {...restProps}>
                {editing ? (
                    <>
                        <Form.Item className="edit-cell" name={dataIndex} open={!!error} rules={rules}>
                            {inputNode}
                        </Form.Item>
                        {error &&
                            (error === 'Please enter input' ? (
                                <span style={{ color: 'red' }}>Please enter input</span>
                            ) : (
                                <Tooltip
                                    title={error}
                                    color={'red'}
                                    key={'red'}
                                    placement="bottom"
                                    style={{ display: 'flex' }}
                                >
                                    <span style={{ color: 'red' }}>In valid</span>
                                    <ExclamationCircleOutlined
                                        style={{ marginLeft: '5px', color: '#f5554a', fontWeight: 'bold' }}
                                    />
                                </Tooltip>
                            ))}
                    </>
                ) : (
                    children
                )}
            </td>
        );
    };
    useEffect(() => {
        const fetchData = async () => {
            const studentRef = child(ref(database), 'Detail');
            try {
                const snapshot = await get(studentRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const studentArray = Object.values(data).map((student) => ({ ...student, key: student.id }));
                    setStudentData(studentArray);
                    setLoading(false);
                }
            } catch (error) {
                toast.error('Error when fetch data');
            }
        };

        fetchData();
    }, []);
    const searchInput = useRef(null);

    const isEditing = (record) => record.key === editingKey;

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleProvideAccount = async (record) => {
        const encodeEmail = encodeEmails(record.email);
        try {
            await update(ref(database, `Detail/${record.key}`), {
                isRegister: true,
            });

            const accountRef = ref(database, `Account/${encodeEmail}`);
            var hash = CryptoJS.AES.encrypt('Tvx1234@', secretKey).toString();
            await set(accountRef, {
                email: record.email,
                password: hash,
                name: record.name,
                Role: 'user',
            });

            const newData = studentData.map((item) => (item.key === record.key ? { ...item, isRegister: true } : item));
            setStudentData(newData);
        } catch (error) {
            toast.error('Error provide account student');
        }
    };

    const handleDeleteAccount = async (record) => {
        try {
            const encodeEmail = encodeEmails(record.email);
            await remove(child(ref(database), `Account/${encodeEmail}`));
            const newData = studentData.map((item) =>
                item.key === record.key ? { ...item, isRegister: false } : item,
            );
            setStudentData(newData);
        } catch (error) {
            toast.error('Error deleting account');
        }
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div className="search-column" onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                    >
                        {t('button.search')}
                    </Button>
                    <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small">
                        {t('button.reset')}
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
                        {t('button.filter')}
                    </Button>
                    <Button type="link" size="small" onClick={() => close()}>
                        {t('button.close')}
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
        onFilter: (value, record) => {
            const dataIndexValue = record[dataIndex];
            if (dataIndexValue) {
                return dataIndexValue.toString().toLowerCase().includes(value.toLowerCase());
            }
            return false;
        },
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

    function encodeEmails(email) {
        return email.replace('.', ',');
    }
    const handleDelete = async (record) => {
        try {
            const studentToDelete = studentData.find((item) => item.id === record.id);
            if (!studentToDelete) {
                toast.error('Student not found');
                return;
            }
            if (record.uniCode !== undefined) {
                for (const uniCode of studentToDelete.uniCode) {
                    const universityRef = ref(database, `University/${uniCode}`);
                    const universitySnapshot = await get(universityRef);
                    if (universitySnapshot.exists()) {
                        const universityData = universitySnapshot.val();
                        const updatedIsRegistered = Math.max(0, universityData.isRegistered - 1);
                        await update(universityRef, { isRegistered: updatedIsRegistered });
                    } else {
                        toast.error('University not found');
                    }
                }
            }

            await remove(child(ref(database), `Detail/${record.id}`));
            const emailhash = encodeEmails(record.email);
            await remove(child(ref(database), `Account/${emailhash}`));
            const newData = studentData.filter((item) => item.id !== record.id);
            setStudentData(newData);
            toast.success('Delete student successfully');
        } catch (error) {
            toast.error('Error deleting data');
        }
    };

    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            id: '',
            email: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };
    const handleFieldChange = async (key, dataIndex, value) => {
        const newData = [...studentData];
        const index = newData.findIndex((item) => key === item.key);

        if (index > -1) {
            newData[index][dataIndex] = value;
            setStudentData(newData);
            setStudentData(newData);
            try {
                await update(ref(database, `Detail/${key}`), {
                    [dataIndex]: value,
                });
            } catch (error) {
                toast.error('Error updating document');
            }
        }
    };
    function validateEmailFormat(email) {
        return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email);
    }
    const updateUniCode = async (record, averagescore) => {
        try {
            if (record.uniCode !== undefined) {
                record.uniCode.forEach(async (uniCode) => {
                    const temp = encodePath(record.email);
                    const uniRef = ref(database, `University/${uniCode}/`);
                    const snapshot = await get(uniRef);
                    if (snapshot.exists()) {
                        let uniData = snapshot.val();
                        if (averagescore < uniData.averageS) {
                            const list = uniData.registeration;
                            delete list[temp];
                            console.log(list);
                            await update(ref(database, `University/${uniCode}`), {
                                isRegistered: uniData.isRegistered - 1,
                                registeration: list,
                            });
                            const tempList = record.uniCode.filter((item) => item !== uniCode);
                            console.log(tempList);
                            await update(ref(database, `Detail/${record.id}`), {
                                uniCode: tempList,
                            });
                        }
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const save = async (record) => {
        try {
            const row = await form.validateFields();
            const newData = [...studentData];
            const index = newData.findIndex((item) => record.key === item.key);

            if (index > -1) {
                const item = newData[index];

                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                const updatedRow = {
                    ...newData[index],
                    MathScore: parseFloat(newData[index].MathScore),
                    LiteratureScore: parseFloat(newData[index].LiteratureScore),
                    EnglishScore: parseFloat(newData[index].EnglishScore),
                };
                const mathScore = updatedRow['MathScore'] || 0;
                const literatureScore = updatedRow['LiteratureScore'] || 0;
                const englishScore = updatedRow['EnglishScore'] || 0;
                const averageScore = parseFloat(((mathScore + literatureScore + englishScore) / 3).toFixed(2));
                if (
                    row.MathScore < item.MathScore ||
                    row.EnglishScore < item.EnglishScore ||
                    row.LiteratureScore < item.LiteratureScore
                ) {
                    updateUniCode(record, averageScore);
                }
                updatedRow['AverageScore'] = averageScore;

                newData[index] = updatedRow;
                setStudentData(newData);
                setEditingKey('');

                await update(ref(database, `Detail/${record.key}`), updatedRow);
                toast.success('Data updated successfully');
            } else {
                newData.push(row);
                setStudentData(newData);
                setEditingKey('');
                handleFieldChange(record.key, Object.keys(row)[0], row[Object.keys(row)[0]]);
                // await set(ref(database, `Detail/${record.key}`), row);
                toast.success('Data added to Firebase successfully');
            }
        } catch (errInfo) {
            console.error('Validate Failed', errInfo);
        }
    };
    const renderNameWithGender = (record) => {
        return (
            <span className={record === 'Male' ? 'male' : 'female'}>
                {record === 'Male' ? <ManOutlined /> : <WomanOutlined />}
            </span>
        );
    };

    const handleIdClick = (record) => {
        setstudentUnicode(record.uniCode !== undefined);
        setSelectedStudent(record);
        setIsModalVisible(true);
    };
    const temp = (x) => {
        if (x === null || x === undefined) {
            return false;
        } else {
            if (x.length === 5) {
                return true;
            } else {
                return false;
            }
        }
    };
    const columns = [
        {
            title: t('ID + Name'),
            render: (record) => (
                <React.Fragment>
                    {record.id}
                    <br />
                    {record.name}
                </React.Fragment>
            ),
            responsive: ['xs'],
        },
        {
            title: t('Score '),
            render: (record) => <React.Fragment>{record.AverageScore}</React.Fragment>,
            responsive: ['xs'],
        },
        {
            title: t('table.ID'),
            dataIndex: 'id',

            width: '14%',
            fixed: 'left',
            ...getColumnSearchProps('id'),
            render: (_, record) => (
                <span onClick={() => handleIdClick(record)} className="idOnClick">
                    {record.id}
                </span>
            ),
            key: 'id',
        },

        {
            title: t('table.Name'),
            dataIndex: 'name',
            width: '27%',
            editable: true,
            fixed: 'left',
            key: 'name',
            ...getColumnSearchProps('name'),
            render: (text, record) => {
                return (
                    <>
                        {renderNameWithGender(record.gender)}
                        <Tooltip title={temp(record.uniCode) ? 'maximum number of shools' : ''}>
                            <span className={temp(record.uniCode) ? 'Can_Regist' : 'Not_Regist'}>{text}</span>
                        </Tooltip>
                    </>
                );
            },
            responsive: ['sm'],
        },

        {
            title: t('table.Email'),
            dataIndex: 'email',
            width: '33%',
            editable: true,
            ...getColumnSearchProps('email'),
            render: (text, record) => (
                <Tooltip title={record.isRegister ? t('tooltip.account1') : t('tooltip.account2')}>
                    <span className={record.isRegister ? 'Registered' : 'UnRegistered'}>{text}</span>
                </Tooltip>
            ),
            key: 'email',
        },
        {
            title: t('table.Math'),
            dataIndex: 'MathScore',
            width: '14%',
            editable: true,
            sorter: (a, b) => a.MathScore - b.MathScore,
            key: 'MathScore',
        },
        {
            title: t('table.Literature'),
            dataIndex: 'LiteratureScore',
            width: '17%',
            editable: true,
            key: 'LiteratureScore',

            sorter: (a, b) => a.LiteratureScore - b.LiteratureScore,
            responsive: ['sm'],
        },

        {
            title: t('table.English'),
            dataIndex: 'EnglishScore',
            width: '17%',
            editable: true,
            key: 'EnglishScore',
            sorter: (a, b) => a.EnglishScore - b.EnglishScore,
        },
        {
            title: t('table.Total Score'),
            dataIndex: 'AverageScore',
            width: '17%',
            key: 'AverageScore',
            sorter: (a, b) => a.AverageScore - b.AverageScore,
            responsive: ['sm'],
        },
        {
            title: t('table.UniCode'),
            dataIndex: 'uniCode',
            width: '30%',
            render: (text) => {
                if (typeof text === 'string') {
                    return text?.split(', ').join(', ');
                } else if (Array.isArray(text)) {
                    return text?.join(', ');
                } else {
                    return text;
                }
            },
            key: 'uniCode',
            responsive: ['sm'],
        },
        {
            title: t('table.Action'),
            dataIndex: 'operation',
            width: '21%',
            fixed: 'right',
            responsive: ['sm'],
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link className="Typo_link" onClick={() => save(record)}>
                            {t('button.edit')}
                        </Typography.Link>
                        <Typography.Link className="Typo_link" onClick={cancel}>
                            {t('button.cancel')}
                        </Typography.Link>
                    </span>
                ) : (
                    <Space size={'small'}>
                        <Typography.Link
                            disabled={editingKey !== ''}
                            onClick={() => edit(record)}
                            className="Typo_link"
                            title="Edit"
                        >
                            <EditOutlined />
                        </Typography.Link>
                        <Popconfirm
                            onConfirm={() => handleDelete(record)}
                            okText={t('confirm.ok1')}
                            cancelText={t('confirm.cancel')}
                        >
                            <Typography.Link title="Delete">
                                <DeleteOutlined />
                            </Typography.Link>
                        </Popconfirm>
                        {!record.isRegister ? (
                            <Popconfirm
                                title={t('title.provide')}
                                onConfirm={() => handleProvideAccount(record)}
                                okText={t('confirm.ok2')}
                                cancelText={t('confirm.cancel')}
                            >
                                <Typography.Link title="Add account">
                                    <PlusCircleOutlined />
                                </Typography.Link>
                            </Popconfirm>
                        ) : (
                            <Popconfirm
                                title={t('title.deleteacc')}
                                onConfirm={() => handleDeleteAccount(record)}
                                okText={t('confirm.ok1')}
                                cancelText={t('confirm.cancel')}
                            >
                                <Typography.Link title="Delete account">
                                    <MinusCircleOutlined />
                                </Typography.Link>
                            </Popconfirm>
                        )}
                    </Space>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setBell(true);
        if (mess !== '') {
            addDoc(collection(db, 'cities'), {
                name: mess,
                country: mess,
                state: mess,
                time: new Date(),
                seen: false,
            })
                .then(() => {
                    setBell(false);
                    setIsModalOpen(false);
                    return toast.success('The notification you sent was successful');
                })
                .catch(() => {
                    setBell(false);
                    setIsModalOpen(false);
                    return toast.error('The notification you sent has failed');
                });
        }
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="Layout">
            <Space direction="vertical" size={'small'}>
                <div className="table">
                    <ModalAdd studentData={studentData} setStudentData={setStudentData} />
                    <Modal
                        title={t('title.modalsend')}
                        open={isModalOpen}
                        onCancel={handleCancel}
                        confirmLoading={true}
                        destroyOnClose
                        footer={[
                            <Button onClick={handleOk} loading={bell}>
                                {t('button.send')}
                            </Button>,
                            <Button onClick={handleCancel}>{t('button.cancel')}</Button>,
                        ]}
                    >
                        <Input onChange={(e) => setMess(e.target.value)} />
                    </Modal>
                    <Button type="primary" onClick={showModal}>
                        {t('button.sendnoti')}
                    </Button>

                    <ModalDetail
                        visible={isModalVisible}
                        onClose={() => {
                            setIsModalVisible(false);
                        }}
                        student={selectedStudent}
                        studentUnicode={studentUnicode}
                    />
                    <Form form={form} component={false}>
                        <Spin spinning={Loading}>
                            <Table
                                components={{
                                    body: {
                                        cell: EditableCell,
                                    },
                                }}
                                dataSource={studentData}
                                columns={mergedColumns}
                                scroll={{
                                    x: 'calc(100vw - 290px)',
                                    y: 'calc(100vh - 280px)',
                                }}
                                rowClassName="editable-row"
                                showSorterTooltip={{
                                    target: 'sorter-icon',
                                }}
                                pagination={{
                                    onChange: cancel,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: (total) => `${t('title.total')} ${total}`,
                                }}
                                rowHoverable={false}
                                ref={tableRef}
                            />
                        </Spin>
                    </Form>
                </div>
            </Space>
        </div>
    );
};

export default StudentList;
