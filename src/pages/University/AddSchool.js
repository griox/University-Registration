import React, { useState, useRef, useEffect } from 'react';
import { Form, Table, Popconfirm, Button, Space, Input, InputNumber, Modal, Typography } from 'antd';
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import FormAdd from './formAddSchool';
import { get, ref, child, getDatabase, remove, update, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
// import { render } from '@testing-library/react';
import FormDetail from './Modal_detail';

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

const data = [
    {
        key: '1',
        name: 'Nha Trang University',
        ucode: 'NTU',
        address: 'Khánh Hòa',
        cutoff: '22',
        number: '1500',
        targets: 2100,
    },
    {
        key: '2',
        name: 'Van Lang University',
        ucode: 'VLU',
        address: 'TP.HCM',
        cutoff: '22',
        number: '1500',
        targets: 3000,
    },
    {
        key: '3',
        name: 'Duy Tan University',
        ucode: 'DTU',
        address: 'Đà Nẵng',
        cutoff: '22',
        number: '1500',
        targets: 2800,
    },
    {
        key: '4',
        name: 'Ha Noi Medical University',
        ucode: 'HMU',
        address: 'Hà Nội',
        cutoff: '22',
        number: '1500',
        targets: 2000,
    },
    {
        key: '5',
        name: 'Hutech University',
        ucode: 'DKC',
        address: 'TP.HCM',
        cutoff: '22',
        number: '1500',
        targets: 2400,
    },
    {
        key: '6',
        name: 'Ha Noi National University',
        ucode: 'VNU',
        address: 'Hà Nội',
        cutoff: '22',
        number: '1500',
        targets: 2500,
    },
    {
        key: '7',
        name: 'Hanoi Polytechnic University ',
        ucode: 'BKA',
        address: 'Hà Nội',
        cutoff: '22',
        number: '1500',
        targets: 3000,
    },
    {
        key: '8',
        name: 'University of Transportation Technology',
        ucode: 'GTA',
        address: 'TP.HCM',
        cutoff: '22',
        number: '1500',
        targets: 2800,
    },
    {
        key: '9',
        name: 'University of Social Sciences and Humanities',
        ucode: 'QHX',
        address: 'TP.HCM',
        cutoff: '22',
        number: '1500',
        targets: 2130,
    },
    {
        key: '10',
        name: 'University of Natural Resources and Environment',
        ucode: 'HUNRE',
        address: 'Hà Nội',
        cutoff: '22',
        number: '1500',
        targets: 2450,
    },
    {
        key: '11',
        name: 'Ton Duc Thang University',
        ucode: 'TDTU',
        address: 'Khánh Hòa',
        cutoff: '22',
        number: '1500',
        targets: 1900,
    },
    {
        key: '12',
        name: 'Khanh Hoa University',
        ucode: 'UKH',
        address: 'Khánh Hòa',
        cutoff: '22',
        number: '1500',
        targets: 1750,
    },
];

const AddSchool = ({ data }) => {
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [universityData, setUniversityData] = useState([]);
    const [selectedUniversity, setSelectUniversity] = useState(null);
    const [isModalUniVisible, setUniVisible] = useState(false);
    const [modalDetail, setModalDetail] = useState(false);
    const tableRef = useRef(null);
    const searchInput = useRef(null);
    useEffect(() => {
        const fetchData = async () => {
            const uniRef = child(ref(db), 'ListUni');
            try {
                const snapshot = await get(uniRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const universityArray = Object.values(data).map((university) => ({
                        ...university,
                        key: university.id,
                    }));
                    setUniversityData(universityArray);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    const handleSchoolDetail = (record) => {
        setModalDetail(record);
        setUniVisible(true);
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

    const handleDelete = async (key) => {
        try {
            await remove(child(ref(db), `ListUni/${key}`));
            const newData = universityData.filter((item) => item.key !== key);
            setUniversityData(newData);
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            ucode: '',
            address: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const handleFieldChange = async (key, dataIndex, value) => {
        console.log('ham da duoc goi');
        const newData = [...universityData];
        const index = newData.findIndex((item) => key === item.key);

        if (index > -1) {
            newData[index][dataIndex] = value;
            setUniversityData(newData); // Update state

            try {
                // Await the update promise for Firebase
                await update(ref(db, `ListUni/${key}`), {
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
            // Validate fields and get data
            const values = await form.validateFields();

            // Kiểm tra dữ liệu hợp lệ
            if (values) {
                const newData = [...universityData];
                const index = newData.findIndex((item) => key === item.key);

                if (index > -1) {
                    const item = newData[index];

                    // Xử lý dữ liệu thay đổi
                    newData.splice(index, 1, {
                        ...item,
                        ...values,
                    });
                    const updatedRow = { ...newData[index] };

                    // Cập nhật dữ liệu trên state
                    newData[index] = updatedRow;
                    setUniversityData(newData);
                    setEditingKey('');

                    // Cập nhật dữ liệu trên Firebase
                    await update(ref(db, `ListUni/${key}`), updatedRow);
                    console.log('Data updated in Firebase successfully');
                } else {
                    // Thêm dữ liệu mới vào mảng universityData
                    newData.push(values);
                    setUniversityData(newData);
                    setEditingKey('');
                    handleFieldChange(key, Object.keys(values)[0], values[Object.keys(values)[0]]);

                    // Thêm dữ liệu mới vào Firebase
                    await set(ref(db, `ListUni/${key}`), values); // Thêm dữ liệu mới
                    console.log('Data added to Firebase successfully');
                }
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
            // Xử lý lỗi validateFields(), ví dụ: Hiển thị thông báo cho người dùng
        }
    };

    const handleIdClick = (record) => {
        setSelectUniversity(record);
        console.log(record);
        setUniVisible(true);
    };

    const handleOk = () => {
        setUniVisible(false);
    };
    const handleCancel = () => {
        setUniVisible(false);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            editable: true,
            fixed: 'left',
            width: '25%',
            ...getColumnSearchProps('name'),
            render: (_, record) => (
                <span onClick={() => handleIdClick(record)} style={{ color: 'blue', cursor: 'pointer' }}>
                    {record.name}
                </span>
            ),
        },
        {
            title: 'University code',
            dataIndex: 'ucode',
            width: '15%',
            editable: true,
            fixed: 'left',
            ...getColumnSearchProps('ucode'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            editable: true,
            filters: [
                {
                    text: 'Hà Nội',
                    value: 'Hà Nội',
                },
                {
                    text: 'TP.HCM',
                    value: 'TP.HCM',
                },
                {
                    text: 'Đà Nẵng',
                    value: 'Đà Nẵng',
                },
                {
                    text: 'Khánh Hòa',
                    value: 'Khánh Hòa',
                },
            ],
            onFilter: (value, record) => record.address.startsWith(value),
            filterSearch: true,
            width: '20%',
        },
        {
            title: 'Entrance score',
            dataIndex: 'cutoff',
            width: '15%',
            editable: true,
            sorter: (a, b) => a.cutoff - b.cutoff,
        },
        {
            title: 'Number of students registered',
            dataIndex: 'number',
            width: '20%',
            editable: true,
            sorter: (a, b) => a.number - b.number,
        },
        {
            title: 'Targets',
            dataIndex: 'targets',
            width: '10%',
            editable: true,
            sorter: (a, b) => a.targets - b.targets,
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
                        <Popconfirm title="Sure to save?" onConfirm={() => save(record.key)}>
                            <Typography.Link
                                style={{
                                    marginRight: 8,
                                }}
                            >
                                Edit
                            </Typography.Link>
                        </Popconfirm>
                        <Typography.Link onClick={() => cancel()}>Cancel</Typography.Link>
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
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div>
            <FormAdd></FormAdd>
            <Space>
                <Modal
                    open={isModalUniVisible}
                    width={600}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="ok" type="primary" onClick={handleOk}>
                            OK
                        </Button>,
                    ]}
                >
                    <FormDetail></FormDetail>
                </Modal>
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        dataSource={universityData}
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
                            defaultPageSize: '10',
                            pageSizeOptions: ['10', '20', '30', '50'],
                            total: 20,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total) => `Total ${total} items`,
                        }}
                        ref={tableRef}
                    />
                </Form>
            </Space>
        </div>
    );
};

export default AddSchool;
