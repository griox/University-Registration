import React, { useState, useRef } from 'react';
import { Table, Button, Space, Input, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import FormAdd from '../pages/formAddSchool';

const data = [
    {
        key: '1',
        name: 'Nha Trang University',
        ucode: 'NTU',
        address: 'Khánh Hòa',
        targets: 2100,
    },
    {
        key: '2',
        name: 'Van Lang University',
        ucode: 'VLU',
        address: 'TP.HCM',
        targets: 3000,
    },
    {
        key: '3',
        name: 'Duy Tan University',
        ucode: 'DTU',
        address: 'Đà Nẵng',
        targets: 2800,
    },
    {
        key: '4',
        name: 'Ha Noi Medical University',
        ucode: 'HMU',
        address: 'Hà Nội',
        targets: 2000,
    },
    {
        key: '5',
        name: 'Hutech University',
        ucode: 'DKC',
        address: 'TP.HCM',
        targets: 2400,
    },
    {
        key: '6',
        name: 'Ha Noi National University',
        ucode: 'VNU',
        address: 'Hà Nội',
        targets: 2500,
    },
    {
        key: '7',
        name: 'Hanoi Polytechnic University ',
        ucode: 'BKA',
        address: 'Hà Nội',
        targets: 3000,
    },
    {
        key: '8',
        name: 'University of Transportation Technology',
        ucode: 'GTA',
        address: 'TP.HCM',
        targets: 2800,
    },
    {
        key: '9',
        name: 'University of Social Sciences and Humanities',
        ucode: 'QHX',
        address: 'TP.HCM',
        targets: 2130,
    },
    {
        key: '10',
        name: 'University of Natural Resources and Environment',
        ucode: 'HUNRE',
        address: 'Hà Nội',
        targets: 2450,
    },
    {
        key: '11',
        name: 'Ton Duc Thang University',
        ucode: 'TDTU',
        address: 'Khánh Hòa',
        targets: 1900,
    },
    {
        key: '12',
        name: 'Khanh Hoa University',
        ucode: 'UKH',
        address: 'Khánh Hòa',
        targets: 1750,
    },
];

// const onChange = (pagination, filters, sorter, extra) => {
//   console.log('params', pagination, filters, sorter, extra);
// };

const AddSchool = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
    const [isModalVisible, setVisible] = useState(false);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleEdit = () => {};

    const handleDelete = () => {};

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
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
            width: '15%',
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
            width: '30%',
        },
        {
            title: 'Targets',
            dataIndex: 'targets',
            width: '10%',
            sorter: (a, b) => a.targets - b.targets,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: '10%',
            render: (text, record) => (
                <div>
                    <div style={{ display: 'flex' }}>
                        <Button style={{ marginRight: '5px', width: '50px' }} type="primary" onClick={showModal}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                <g fill="none">
                                    <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                                    <path
                                        fill="currentColor"
                                        d="M13 3a1 1 0 0 1 .117 1.993L13 5H5v14h14v-8a1 1 0 0 1 1.993-.117L21 11v8a2 2 0 0 1-1.85 1.995L19 21H5a2 2 0 0 1-1.995-1.85L3 19V5a2 2 0 0 1 1.85-1.995L5 3zm6.243.343a1 1 0 0 1 1.497 1.32l-.083.095l-9.9 9.899a1 1 0 0 1-1.497-1.32l.083-.094z"
                                    />
                                </g>
                            </svg>
                        </Button>
                        <Button danger type="primary" onClick={() => handleDelete(record)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 40 40">
                                <path
                                    fill="currentColor"
                                    d="M21.499 19.994L32.755 8.727a1.064 1.064 0 0 0-.001-1.502c-.398-.396-1.099-.398-1.501.002L20 18.494L8.743 7.224c-.4-.395-1.101-.393-1.499.002a1.05 1.05 0 0 0-.309.751c0 .284.11.55.309.747L18.5 19.993L7.245 31.263a1.064 1.064 0 0 0 .003 1.503c.193.191.466.301.748.301h.006c.283-.001.556-.112.745-.305L20 21.495l11.257 11.27c.199.198.465.308.747.308a1.058 1.058 0 0 0 1.061-1.061c0-.283-.11-.55-.31-.747z"
                                />
                            </svg>
                        </Button>
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div>
            <Table
                columns={columns}
                dataSource={data}
                onChange={onChange}
                pagination={{
                    defaultPageSize: '5',
                    pageSizeOptions: ['5', '10', '15', '20'],
                    total: 20,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} items`,
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
