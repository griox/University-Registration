import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Tooltip, Typography, Spin, Modal, message, Upload } from 'antd';
import './css/table.css';
import 'antd/dist/reset.css';
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
    ManOutlined,
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

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    const isMath = dataIndex === 'MathScore';
    const isLiterature = dataIndex === 'LiteratureScore';
    const isEnglish = dataIndex === 'EnglishScore';
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    className="edit-cell"
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                        {
                            validator: (_, value) => {
                                if (isMath && !(value >= 0 && value <= 10)) {
                                    // Kiểm tra nếu là cột 'target' và giá trị nhỏ hơn số đã đăng ký
                                    return Promise.reject(new Error('Must >= 0 and <= 10 and just number'));
                                }
                                return Promise.resolve();
                            },
                        },
                        {
                            validator: (_, value) => {
                                if (isEnglish && !(value >= 0 && value <= 10)) {
                                    // Kiểm tra nếu là cột 'target' và giá trị nhỏ hơn số đã đăng ký
                                    return Promise.reject(new Error('Must >= 0 and <= 10 and just number'));
                                }
                                return Promise.resolve();
                            },
                        },
                        {
                            validator: (_, value) => {
                                if (isLiterature && !(value >= 0 && value <= 10)) {
                                    // Kiểm tra nếu là cột 'target' và giá trị nhỏ hơn số đã đăng ký
                                    return Promise.reject(new Error('Must >= 0 and <= 10 and just number'));
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

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
            await set(accountRef, {
                email: record.email,
                password: 'Tvx1234@',
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
    const updateUniCode = async (record, averagescore, id) => {
        try {
            if (record.uniCode !== undefined) {
                for (const uniCode in record.uniCode) {
                    const uniRef = ref(database, `University/${record.uniCode[uniCode]}`);
                    const studentRef = ref(database, `Detail/${id}`);
                    const snapshot1 = await get(studentRef);
                    const snapshot = await get(uniRef);
                    if (snapshot.exists()&& snapshot1.exists()) {
                       
                        const uniData = snapshot.val();
                        const studentData = snapshot1.val();
                        console.log(averagescore, uniData.averageS);
                        if (averagescore < uniData.averageS) {
                            const newRegisteration = uniData.registeration.filter((item) => item.id !== id);
                            console.log(newRegisteration);
                            const newUniCode = studentData.uniCode.filter((item2) => item2 !== uniCode);
                            console.log(newUniCode);
                            await update(studentRef, { uniCode: newUniCode });
                            const updatedIsRegistered = Math.max(0, uniData.isRegistered - 1);
                            await update(uniRef, {
                                isRegistered: updatedIsRegistered,
                                registeration: newRegisteration,
                            });
                            
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const checkEmailExistence = async (newEmail) => {
        try {
            const snapshot = await get(child(ref(database), 'Detail'));
            if (snapshot.exists()) {
                const emails = snapshot.val();
                const emailsExists = Object.values(emails).some((student) => student.email === newEmail);
                return emailsExists;
            }
            return false;
        } catch (error) {
            toast.error('Error checking email existence');
            return false;
        }
    };
    const save = async (record) => {
        try {
            const row = await form.validateFields();
            const newData = [...studentData];
            const index = newData.findIndex((item) => record.key === item.key);

            if (index > -1) {
                const item = newData[index];
                if (row.MathScore > 10 || row.EnglishScore > 10 || row.LiteratureScore > 10) {
                    toast.error('Score must not be less or equal to 10');
                    return;
                }

                if (!validateEmailFormat(row.email)) {
                    toast.error('Invalid Email Format');
                    return;
                }
                if (row.email !== item.email) {
                    const emailsExists = await checkEmailExistence(row.email);
                    if (emailsExists) {
                        toast.error('This email has already exists');
                        return;
                    }
                }
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
                const averageScore = (mathScore + literatureScore + englishScore) / 3;
                if (
                    row.MathScore < item.MathScore ||
                    row.EnglishScore < item.EnglishScore ||
                    row.LiteratureScore < item.LiteratureScore
                ) {
                    updateUniCode(record, averageScore, record.key);
                }
                updatedRow['AverageScore'] = Math.round(averageScore * 10) / 10;

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
                await set(ref(database, `Detail/${record.key}`), row);
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

            width: '10%',
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
            width: '30%',
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
            width: '10%',
            editable: true,
            sorter: (a, b) => a.MathScore - b.MathScore,
            key: 'MathScore',
        },
        {
            title: t('table.Literature'),
            dataIndex: 'LiteratureScore',
            width: '11%',
            editable: true,
            key: 'LiteratureScore',

            sorter: (a, b) => a.LiteratureScore - b.LiteratureScore,
            responsive: ['sm'],
        },

        {
            title: t('table.English'),
            dataIndex: 'EnglishScore',
            width: '10%',
            editable: true,
            key: 'EnglishScore',
            sorter: (a, b) => a.EnglishScore - b.EnglishScore,
        },
        {
            title: t('table.Total Score'),
            dataIndex: 'AverageScore',
            width: '10%',
            key: 'AverageScore',
            sorter: (a, b) => a.AverageScore - b.AverageScore,
            responsive: ['sm'],
        },
        {
            title: t('table.UniCode'),
            dataIndex: 'uniCode',
            width: '20%',
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
            width: '16%',
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
                        >
                            <EditOutlined />
                        </Typography.Link>
                        <Popconfirm
                            title={t('title.delete')}
                            onConfirm={() => handleDelete(record)}
                            okText={t('confirm.ok1')}
                            cancelText={t('confirm.cancel')}
                        >
                            <Typography.Link>
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
                                <Typography.Link>
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
                                <Typography.Link>
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
                                    y: 'calc(100vh - 300px)',
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
