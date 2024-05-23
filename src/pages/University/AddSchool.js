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
import { Button, Space, Modal } from 'antd';
import Highlighter from 'react-highlight-words';
import { WomanOutlined } from '@ant-design/icons';
import { get, ref, child, getDatabase, remove, update, push, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import FormDetail from './Modal_detail';
import FormAdd from './formAddSchool';
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

const AddSchool = () => {
    const [isModalVisible, setVisible] = useState(false);
    const [isModalDetailVisible, setDetailVisible] = useState(false);
    const [modalDetail, setModalDetail] = useState({});
    const [selectedUniverse, setSelectedUniverse] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [UniData, setUniData] = useState([]);
    const [searchedColumn, setSearchedColumn] = useState('');
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
    const [loading, setLoading] = useState(true);
    const tableRef = useRef(null);
    const searchInput = useRef(null);
    useEffect(() => {
        const fetchData = async () => {
            const uniRef = child(ref(db), 'University');
            try {
                const snapshot = await get(uniRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const uniArray = Object.values(data).map((uni) => ({ ...uni, key: uni.uniCode }));
                    setUniData(uniArray);
                }
            } catch (error) {
                console.errror('Cant now fetch University data', error);
            }
        };
        fetchData();
    }, []);
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
    const handleSchoolDetail = (record) => {
        setModalDetail(record);
        setDetailVisible(true);
        setSelectedUniverse(record);
        console.log(record);
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            nameU: '',
            uniCode: '',
            address: '',
            ...record,
        });
        setEditingKey(record.key);
        console.log(editingKey);
    };

    const cancel = () => {
        setEditingKey('');
    };
    const handleDelete = async (key) => {
        try {
            await remove(child(ref(db), `University/${key}`));
            const newUni = UniData.filter((item) => item.key !== key);
            setUniData(newUni);
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };
    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        setVisible(false);
        setDetailVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
        setDetailVisible(false);
        setLoading(true);
    };
    const handleFieldChange = async (key, dataIndex, value) => {
        const newData = [...UniData];
        const index = newData.findIndex((item) => key === item.key);

        if (index > -1) {
            newData[index][dataIndex] = value;
            setUniData(newData); // Update state

            try {
                // Await the update promise for Firebase
                await update(ref(db, `University/${key}`), {
                    [dataIndex]: value,
                });
                console.log('Data updated in Firebase successfully');
            } catch (error) {
                console.error('Error updating document:', error);
                // Handle update error (optional: show notification to user)
            }
        }
    };
    const checkUniCodeExistence = async (newUniCode) => {
        try {
            const snapshot = await get(child(ref(db), 'University'));
            if (snapshot.exists()) {
                const universities = snapshot.val();
                const uniCodeExists = Object.values(universities).some(
                    (uni) => uni.uniCode === newUniCode.toLowerCase(),
                );
                return uniCodeExists;
            }
            return false;
        } catch (error) {
            console.error('Error checking uniCode existence:', error);
            return false;
        }
    };
    const checkNameExistence = async (newName) => {
        try {
            const snapshot = await get(child(ref(db), 'University'));
            if (snapshot.exists()) {
                const universities = snapshot.val();
                const uniNameExists = Object.values(universities).some((uni) => uni.nameU === newName.toLowerCase());
                return uniNameExists;
            }
            return false;
        } catch (error) {
            console.error('Error checking uniName existence:', error);
            return false;
        }
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...UniData];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                if (row.target < item.isRegistered) {
                    toast.error('Targets must not be less than Number of registration');
                    return;
                }
                if (row.averageS > 30 || row.averageS < 0) {
                    toast.error('Invalid Entrance Score Format');
                }
                if (row.uniCode !== item.uniCode) {
                    console.log(row.uniCode, item.uniCode);
                    const uniCodeExists = await checkUniCodeExistence(row.uniCode);
                    if (uniCodeExists) {
                        toast.error('This uniCode already exists');
                        return;
                    }
                }
                if (row.nameU !== item.nameU) {
                    const uniNameExists = await checkNameExistence(row.nameU);
                    if (uniNameExists) {
                        toast.error('This Name already exists');
                        return;
                    }
                }
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                // Chuyển đổi giá trị từ chuỗi sang số
                const updatedRow = {
                    ...newData[index],
                    target: parseInt(newData[index].target),
                };
                // Cập nhật dữ liệu trên state
                newData[index] = updatedRow;
                setUniData(newData);
                setEditingKey('');

                // Cập nhật dữ liệu trên Firebase
                await update(ref(db, `University/${key}`), updatedRow);
                toast.success('Data updated successfully');
            } else {
                newData.push(row);
                setUniData(newData);
                setEditingKey('');
                handleFieldChange(key, Object.keys(row)[0], row[Object.keys(row)[0]]);

                // Thêm dữ liệu mới vào Firebase
                await set(ref(db, `University/${key}`), row); // Thêm dữ liệu mới
                console.log('Data added to Firebase successfully');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const onChange = (pagination, filters, sorter, extra) => {
        const totalRows = extra.total;
        if (totalRows <= 5 && pagination.current === 1) {
            setPagination({ ...pagination, current: 2 });
        } else {
            setPagination(pagination);
        }
        console.log('params', pagination, filters, sorter, extra);
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

    const columns = [
        {
            title: 'Name',
            dataIndex: 'nameU',
            key: 'name',
            width: '30%',
            editable: true,
            ...getColumnSearchProps('nameU'),
            render: (text, record) => (
                <Typography.Link onClick={() => handleSchoolDetail(record)}>{text}</Typography.Link>
            ),
        },
        {
            title: 'UniCode',
            dataIndex: 'uniCode',
            width: '13%',
            editable: true,
            ...getColumnSearchProps('ucode'),
            render: (text, record) => (
                <Tooltip title={record.isRegistered === record.targer ? 'Can not regist' : ''}>
                    <span style={{ color: record.isRegistered === record.target ? 'green' : 'black' }}>{text}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            filterSearch: true,
            editable: true,
            width: '20%',
        },
        {
            title: 'Entrance score',
            dataIndex: 'averageS',
            width: '15%',
            editable: true,
            sorter: (a, b) => a.averageS - b.averageS,
        },
        {
            title: 'Number of registration',
            dataIndex: 'isRegistered',
            width: '13%',
        },
        {
            title: 'Targets',
            dataIndex: 'target',
            width: '10%',
            editable: true,
            sorter: (a, b) => a.targets - b.targets,
        },
        {
            title: 'Manage',
            dataIndex: 'operation',
            width: '13%',
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
                        <Typography.Link onClick={cancel}>Cancel</Typography.Link>
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
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
                            <Typography.Link>
                                <DeleteOutlined />
                            </Typography.Link>
                        </Popconfirm>
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
                inputType:
                    col.dataIndex === 'averageS' || col.dataIndex === 'isRegistered' || col.dataIndex === 'targets'
                        ? 'number'
                        : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div>
            <Modal
                title="Edit the University"
                visible={isModalVisible}
                onOk={handleOk}
                okText="Save"
                onCancel={handleCancel}
                style={{ top: '50px', left: '50px' }}
            >
                <AddSchool />
            </Modal>
            <Form form={form} component={false}>
                <Space direction="vertical">
                    <FormAdd />
                    <Table
                        columns={mergedColumns}
                        dataSource={UniData}
                        onChange={onChange}
                        pagination={{
                            defaultPageSize: 10,
                            pageSizeOptions: ['10', '20', '40', '100'],
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total) => `Total ${total} items`,
                        }}
                        scroll={{ x: false, y: 'calc(100vh - 350px)' }}
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        ref={tableRef}
                    />
                </Space>
            </Form>
            <Modal open={isModalDetailVisible} onCancel={handleCancel} width={800} height={600}>
                <FormDetail
                    university={selectedUniverse}
                    visible={isModalDetailVisible}
                    setLoading={setLoading} // Pass down the setLoading function
                    loading={loading}
                />
            </Modal>
        </div>
    );
};

export default AddSchool;
