import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Tooltip, Typography } from 'antd';
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
    ManOutlined,
} from '@ant-design/icons';
import { toast } from 'react-toastify';
import { Button, Space, Divider } from 'antd';
import Highlighter from 'react-highlight-words';
import { WomanOutlined } from '@ant-design/icons';
import { get, ref, child, getDatabase, remove, update, push, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import Modal_Add from './Modal_add';
import Modal_Detail from './Modal_Detail';
import { render } from '@testing-library/react';
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

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
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

const Student_List = ({ data }) => {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [studentData, setStudentData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [Loading,setLoading] = useState(true);
    const tableRef = useRef(null);
    useEffect(() => {
        const fetchData = async () => {
            const studentRef = child(ref(db), 'Detail');
            try {
                const snapshot = await get(studentRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const studentArray = Object.values(data).map((student) => ({ ...student, key: student.id }));
                    setStudentData(studentArray);
                }
            } catch (error) {
                console.error(error);
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
        const encodeEmail = encodeEmails(record.email)
        try {
            // Cập nhật giá trị isRegister của sinh viên
            await update(ref(db, `Detail/${record.key}`), {
                isRegister: true,
            });

            // Thêm dữ liệu vào bảng account
            const accountRef = ref(db, `Account/${encodeEmail}`);
            await set(accountRef, {
                email: record.email,
                password: 'Tvx1234@',
                name: record.name,
                Role: 'user',
            });

            // Cập nhật state
            const newData = studentData.map((item) => (item.key === record.key ? { ...item, isRegister: true } : item));
            setStudentData(newData);
        } catch (error) {
            console.error('Error provide account student:', error);
        }
    };
    const handleDeleteAccount = async (record) => {
        try {
            const encodeEmail = encodeEmails(record.email)
            await remove(child(ref(db),`Account/${encodeEmail}`))
            const newData = studentData.map((item) =>
                item.key === record.key ? { ...item, isRegister: false } : item,
            );
            setStudentData(newData);
        } catch (error) {
            console.error('Error deleting account', error);
        }
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
    function encodeEmails(email) {
        return email.replace('.', ',');
    }
    const handleDelete = async (key) => {
        try {
            console.log(key);
            await remove(child(ref(db), `Detail/${key.id}`));
            const emailhash = encodeEmails(key.email)
            await remove(child(ref(db),`Account/${key.emailhash}`))
            const newData = studentData.filter((item) => item.id !== key.id);
            setStudentData(newData);
        } catch (error) {
            console.error('Error deleting data:', error);
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
        console.log('ham da duoc goi');
        const newData = [...studentData];
        const index = newData.findIndex((item) => key === item.key);

        if (index > -1) {
            newData[index][dataIndex] = value;
            setStudentData(newData); // Update state

            try {
                // Await the update promise for Firebase
                await update(ref(db, `Detail/${key}`), {
                    [dataIndex]: value,
                });
                console.log('Data updated in Firebase successfully');
            } catch (error) {
                console.error('Error updating document:', error);
                // Handle update error (optional: show notification to user)
            }
        }
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...studentData];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                if(row.MathScore>10||row.EnglishScore>10||row.LiteratureScore>10){
                    toast.error('Score must not be less or equal to 10');
                    return;
                }
                // Xử lý dữ liệu thay đổi
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                // Chuyển đổi giá trị từ chuỗi sang số
                const updatedRow = {
                    ...newData[index],
                    MathScore: parseFloat(newData[index].MathScore),
                    LiteratureScore: parseFloat(newData[index].LiteratureScore),
                    EnglishScore: parseFloat(newData[index].EnglishScore),
                };

                // Tính lại averageScore
                const mathScore = updatedRow['MathScore'] || 0;
                const literatureScore = updatedRow['LiteratureScore'] || 0;
                const englishScore = updatedRow['EnglishScore'] || 0;
                const averageScore = mathScore + literatureScore + englishScore;

                // Làm tròn averageScore đến 1 chữ số thập phân
                updatedRow['AverageScore'] = Math.round(averageScore * 10) / 10;

                // Cập nhật dữ liệu trên state
                newData[index] = updatedRow;
                setStudentData(newData);
                setEditingKey('');

                // Cập nhật dữ liệu trên Firebase
                await update(ref(db, `Detail/${key}`), updatedRow);
                toast.success('Data updated successfully');
            } else {
                newData.push(row);
                setStudentData(newData);
                setEditingKey('');
                handleFieldChange(key, Object.keys(row)[0], row[Object.keys(row)[0]]);

                // Thêm dữ liệu mới vào Firebase
                await set(ref(db, `Detail/${key}`), row); // Thêm dữ liệu mới
                toast.success('Data added to Firebase successfully');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const renderNameWithGender = (text, record) => {
        return (
            <span>
                {record.gender === 'Male' ? (
                    <ManOutlined style={{ marginRight: 5 }} />
                ) : (
                    <WomanOutlined style={{ marginRight: 5 }} />
                )}
                {text}
            </span>
        );
    };

    const handleIdClick = (record) => {
        setSelectedStudent(record);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '10%',
            fixed: 'left',
            ...getColumnSearchProps('id'),
            render: (_, record) => (
                <span onClick={() => handleIdClick(record)} style={{ color: 'blue', cursor: 'pointer' }}>
                    {record.id}
                </span>
            ),
        },

        {
            title: 'Name',
            dataIndex: 'name',
            width: '19%',
            editable: true,
            fixed: 'left',
            key: 'name',
            ...getColumnSearchProps('name'),
            render: (text, record) => (
                renderNameWithGender(text, record),
                (
                    <Tooltip title={record.uniCode.length === 5 ? 'can not register more' : ''}>
                        <span style={{ color: record.uniCode.length === 5 ? '#FF8C00' : 'black' }}>{text}</span>
                    </Tooltip>
                )
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: '15%',
            editable: true,
            ...getColumnSearchProps('email'),
            render: (text, record) => (
                <Tooltip title={record.isRegister ? 'had account' : 'account not exists'}>
                    <span style={{ color: record.isRegister ? 'green' : 'red' }}>{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Math',
            dataIndex: 'MathScore',
            width: '10%',
            editable: true,

            sorter: (a, b) => a.MathScore - b.MathScore,
        },
        {
            title: 'Literature',
            dataIndex: 'LiteratureScore',
            width: '11%',
            editable: true,

            sorter: (a, b) => a.LiteratureScore - b.LiteratureScore,
        },
        {
            title: 'EngLish',
            dataIndex: 'EnglishScore',
            width: '10%',
            editable: true,

            sorter: (a, b) => a.EnglishScore - b.EnglishScore,
        },
        {
            title: 'Average',
            dataIndex: 'AverageScore',
            width: '10%',
            sorter: (a, b) => a.AverageScore - b.AverageScore,
        },
        {
            title: 'Unicode',
            dataIndex: 'uniCode',
            width: '13%',
            render: (text) => {
                if (typeof text === 'string') {
                    return text.split(', ').join(', ');
                } else if (Array.isArray(text)) {
                    return text.join(', ');
                } else {
                    return text;
                }
            },
        },
        {
            title: 'Manage',
            dataIndex: 'operation',
            width: '15%',
            fixed: 'right',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Edit
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <Typography.Link>Cancel</Typography.Link>
                        </Popconfirm>
                    </span>
                ) : (
                    <Space size={'middle'}>
                        <Typography.Link
                            disabled={editingKey !== ''}
                            onClick={() => edit(record)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            <EditOutlined />
                        </Typography.Link>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record)}>
                            <Typography.Link>
                                <DeleteOutlined />
                            </Typography.Link>
                        </Popconfirm>
                        {!record.isRegister ? (
                            <Popconfirm title="Provide Account?" onConfirm={() => handleProvideAccount(record)}>
                                <Typography.Link>
                                    <PlusCircleOutlined />
                                </Typography.Link>
                            </Popconfirm>
                        ) : (
                            <Popconfirm title="Delete Account?" onConfirm={() => handleDeleteAccount(record)}>
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

    return (
        <div style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Space direction="vertical">
                <Modal_Add />
                <Modal_Detail
                    visible={isModalVisible}
                    onClose={() => (setIsModalVisible(false), setLoading(true))}
                    student={selectedStudent}
                    Loading = {Loading}
                    setLoading ={setLoading}
                />
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        dataSource={studentData}
                        columns={mergedColumns}
                        scroll={{
                            x: 900,
                            y: 'calc(100vh - 300px)',
                        }}
                        style={{ height: '100%', marginRight: '-20px' }}
                        rowClassName="editable-row"
                        showSorterTooltip={{
                            target: 'sorter-icon',
                        }}
                        pagination={{
                            onChange: cancel,
                            showSizeChanger: true,
                            showQuickJumper: true,
                        }}
                        ref={tableRef}
                    />
                </Form>
            </Space>
        </div>
    );
};

export default Student_List;
