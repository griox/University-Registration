import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Tooltip, Typography, Spin } from 'antd';
import './css/table.css';
import  'antd/dist/reset.css';
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

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
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
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [Loading, setLoading] = useState(true);
    const tableRef = useRef(null);
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
                toast.error(error);
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
            toast.error('Error provide account student:', error);
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
            toast.error('Error deleting account', error);
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
                    placeholder={t('placeholder.search')}
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
            toast.error('Error deleting data:', error);
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
            try {
                await update(ref(database, `Detail/${key}`), {
                    [dataIndex]: value,
                });
            } catch (error) {
                toast.error('Error updating document:', error);
                // Handle update error (optional: show notification to user)
            }
        }
    };
    function validateEmailFormat(email) {
        return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(email);
    }
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...studentData];
            const index = newData.findIndex((item) => key === item.key);

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
                const averageScore = mathScore + literatureScore + englishScore;

                updatedRow['AverageScore'] = Math.round(averageScore * 10) / 10;

                newData[index] = updatedRow;
                setStudentData(newData);
                setEditingKey('');

                await update(ref(database, `Detail/${key}`), updatedRow);
                toast.success('Data updated successfully');
            } else {
                newData.push(row);
                setStudentData(newData);
                setEditingKey('');
                handleFieldChange(key, Object.keys(row)[0], row[Object.keys(row)[0]]);

                await set(ref(database, `Detail/${key}`), row); 
                toast.success('Data added to Firebase successfully');
            }
        } catch (errInfo) {
            toast.error('Validate Failed:', errInfo);
        }
    };
    const renderNameWithGender = (y) => {
        return (
            <span className="icon">
                {y === 'Male' ? <ManOutlined className="male" /> : <WomanOutlined className="female" />}
            </span>
        );
    };

    const handleIdClick = (record) => {
        setSelectedStudent(record);
        setIsModalVisible(true);
        setLoading(true);
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
            title: t('table.ID'),
            dataIndex: 'id',
            width: '10%',
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
            width: '19%',
            editable: true,
            key: 'name',
            ...getColumnSearchProps('name'),
            render: (text, record) => {
                return (
                    <>
                        {renderNameWithGender(record.gender)}
                        <Tooltip title={temp(record.uniCode) ? 'can not register more' : ''}>
                            <span className={temp(record.uniCode) ? 'Can_Regist' : 'NoRegist'}>{text}</span>
                        </Tooltip>
                    </>
                );
            },
        },

        {
            title: t('table.Email'),
            dataIndex: 'email',
            width: '15%',
            editable: true,
            ...getColumnSearchProps('email'),
            render: (text, record) => (
                <Tooltip title={record.isRegister ? 'had account' : 'account not exists'}>
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
        },
        {
            title: t('table.UniCode'),
            dataIndex: 'uniCode',
            width: '13%',
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
        },
        {
            title: t('table.Action'),
            dataIndex: 'operation',
            width: '15%',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link className="Typo_link" onClick={() => save(record.key)}>
                            {t('button.edit')}
                        </Typography.Link>
                        <Typography.Link className="Typo_link" onClick={cancel}>Cancel</Typography.Link>
                    </span>
                ) : (
                    <Space size={'middle'}>
                        <Typography.Link
                            disabled={editingKey !== ''}
                            onClick={() => edit(record)}
                            className="Typo_link"
                        >
                            <EditOutlined className="control" />
                        </Typography.Link>
                        <Popconfirm title={t('title.delete')} onConfirm={() => handleDelete(record)}>
                            <Typography.Link>
                                <DeleteOutlined className="control" />
                            </Typography.Link>
                        </Popconfirm>
                        {!record.isRegister ? (
                            <Popconfirm title={t('title.provide')} onConfirm={() => handleProvideAccount(record)}>
                                <Typography.Link>
                                    <PlusCircleOutlined className="control" />
                                </Typography.Link>
                            </Popconfirm>
                        ) : (
                            <Popconfirm title={t('title.deleteacc')} onConfirm={() => handleDeleteAccount(record)}>
                                <Typography.Link>
                                    <MinusCircleOutlined className="control" />
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

    return (
        <div className="Layout">
            <Space direction="vertical">
                <ModalAdd studentData={studentData} setStudentData={setStudentData} />
                <ModalDetail
                    visible={isModalVisible}
                    onClose={() => {
                        setIsModalVisible(false);
                    }}
                    student={selectedStudent}
                    Loading={Loading}
                    setLoading={setLoading}
                />
                <Form form={form} component={false}>
                    <Spin spinning={Loading}>
                        <div className='table'>
                            <Table
                                components={{
                                    body: {
                                        cell: EditableCell,
                                    },
                                }}
                                dataSource={studentData}
                                columns={mergedColumns}
                                scroll={{
                                    x: 900,
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
                                    showTotal: (total) => `${t('title.total')} ${total}`
                                }}
                                rowHoverable={false}
                                ref={tableRef}
                            />
                        </div>
                    </Spin>
                </Form>
            </Space>
        </div>
    );
};

export default StudentList;
