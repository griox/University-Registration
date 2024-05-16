import React, { useState, useRef } from 'react';
import { Table, Popconfirm, Button, Space, Input, Modal, Typography } from 'antd';
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
} from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import FormAdd from './formAddSchool';

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

const AddSchool = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
    const [isModalVisible, setVisible] = useState(false);
    const [editingKey, setEditingKey] = useState('');

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
        // form.setFieldsValue({
        //   name: '',
        //   id: '',
        //   email: '',
        //   ...record,
        // });
        // setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };
    const handleDelete = async (key) => {
        // try {
        //   await remove(child(ref(db), `SinhVien/${key}`));
        //   const newData = studentData.filter((item) => item.key !== key);
        //   setStudentData(newData);
        // } catch (error) {
        //   console.error('Error deleting data:', error);
        // }
    };

    const handleDeleteAccount = async (record) => {
        // try {
        //   // Create an object with the data to be updated in the database
        //   const updates = {};
        //   updates[`SinhVien/${record.key}/isRegister`] = false;
        //   updates[`Account/${record.key}`] = null; // Use null to delete the node
        //   // Perform the update operation
        //   await update(ref(db), updates);
        //   // Update state
        //   const newData = studentData.map((item) =>
        //     item.key === record.key ? { ...item, isRegister: false } : item
        //   );
        //   setStudentData(newData);
        // } catch (error) {
        //   console.error('Error deleting account', error);
        // }
    };

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleProvideAccount = async (record) => {
        // const { email } = record;
        // try {
        //   // Cập nhật giá trị isRegister của sinh viên
        //   await update(ref(db, `SinhVien/${record.key}`), {
        //     isRegister: true,
        //   });
        //   // Thêm dữ liệu vào bảng account
        //   const accountRef = child(ref(db), 'Account');
        //   const newAccountRef = push(accountRef);
        //   await set(newAccountRef, {
        //     email: email,
        //     password: 'Tvx1234@',
        //     Role: 'user',
        //   });
        //   // Cập nhật state
        //   const newData = studentData.map((item) =>
        //     item.key === record.key ? { ...item, isRegister: true } : item
        //   );
        //   setStudentData(newData);
        // } catch (error) {
        //   console.error('Error provide account student:', error);
        // }
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
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
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
                    {/* <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button> */}
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
            title: 'STT',
            dataIndex: 'key',
            rowScope: 'row',
            width: '5%',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'University code',
            dataIndex: 'ucode',
            width: '10%',
            ...getColumnSearchProps('age'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
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
            title: 'Admission cutoff score',
            dataIndex: 'cutoff',
            width: '15%',
            sorter: (a, b) => a.cutoff - b.cutoff,
        },
        {
            title: 'Number of students registered',
            dataIndex: 'number',
            width: '15%',
            sorter: (a, b) => a.number - b.number,
        },
        {
            title: 'Targets',
            dataIndex: 'targets',
            width: '10%',
            sorter: (a, b) => a.targets - b.targets,
        },
        {
            title: 'Manage',
            dataIndex: 'operation',
            width: '10%',
            fixed: 'right',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => SVGAElement(record.key)}
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
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
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
    return (
        <div>
            <Table
                columns={columns}
                dataSource={data}
                onChange={onChange}
                pagination={{
                    defaultPageSize: '10',
                    pageSizeOptions: ['10', '20', '50', '100'],
                    total: 20,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} items`,
                }}
                scroll={{
                    y: 400,
                    x: 800,
                }}
            />
            <Modal
                title="Edit the University"
                visible={isModalVisible}
                onOk={handleOk}
                okText="Save"
                onCancel={handleCancel}
                style={{ top: '50px', left: '50px' }}
            >
                <FormAdd></FormAdd>
            </Modal>
        </div>
    );
};

export default AddSchool;
