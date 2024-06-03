import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Tooltip, Typography, Button, Space, Modal, Spin } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import Highlighter from 'react-highlight-words';
import { get, ref, child, remove, update, set } from 'firebase/database';
import FormDetail from './Modal_detail';
import FormAdd from './formAddSchool';
import { database } from '../firebaseConfig.js';
import './css/AddSchool.css';
import { useTranslation } from 'react-i18next';

const AddSchool = () => {
    useEffect(() => {
        const fetchData = async () => {
            const uniRef = child(ref(database), 'University');
            try {
                const snapshot = await get(uniRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const uniArray = Object.values(data).map((uni) => ({ ...uni, key: uni.uniCode }));
                    setUniData(uniArray);
                    setLoading(false);
                }
            } catch (error) {
                toast.error('An error occurred while fetchData');
            }
        };
        fetchData();
    }, []);
    const { t } = useTranslation('university');
    const [isModalDetailVisible, setDetailVisible] = useState(false);
    const [selectedUniverse, setSelectedUniverse] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const [UniData, setUniData] = useState([]);
    const [searchedColumn, setSearchedColumn] = useState('');
    const [, setPagination] = useState({ current: 1, pageSize: 5 });
    const [loading, setLoading] = useState(true);
    const [numberRegist, setNumberRegist] = useState('');
    const tableRef = useRef(null);
    const searchInput = useRef(null);

    const isEditing = (record) => record.key === editingKey;
    const checkTargetError = (record) => {
        if (record.target < record.isRegistered) {
            setNumberRegist('Target must not be less than Number of registration');
        } else {
            setNumberRegist('');
        }
    };

    const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
        const [temp, setTemp] = useState('');
        const handleOnchange = (e) => {
            if (e.target.value.match(/[0-9]+/) === null) {
                setTemp(e.target.value);
            }
        };
        const inputNode =
            inputType === 'number' ? <InputNumber /> : <Input onChange={(e) => handleOnchange(e)} value={temp} />;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        className="form-editCell"
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
    const handleSchoolDetail = (record) => {
        setLoading(true);
        setDetailVisible(true);
        setSelectedUniverse(record);
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

    const edit = (record) => {
        form.setFieldsValue({
            nameU: '',
            uniCode: '',
            address: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };
    const handleDelete = async (record) => {
        try {
            if (record.registeration !== undefined) {
                for (const student in record.registeration) {
                    const studentRef = ref(database, `Detail/${record.registeration[student].id}`);
                    const snapshot = await get(studentRef);
                    if (snapshot.exists()) {
                        const studentData = snapshot.val();
                        const newArray = studentData.uniCode.filter((item) => item !== record.uniCode);
                        await update(studentRef, { uniCode: newArray });
                    }
                }
            }
            await remove(child(ref(database), `University/${record.uniCode}`));
            const newUni = UniData.filter((item) => item.uniCode !== record.uniCode);
            setUniData(newUni);
            toast.success('Delete university successfully');
        } catch (error) {
            toast.error('Error when deleting data', error);
        }
    };

    const handleOk = () => {
        setDetailVisible(false);
    };

    const handleCancel = () => {
        setDetailVisible(false);
        setLoading(false);
    };

    const handleFieldChange = async (key, dataIndex, value) => {
        const newData = [...UniData];
        const index = newData.findIndex((item) => key === item.key);

        if (index > -1) {
            newData[index][dataIndex] = value;
            setUniData(newData);

            try {
                await update(ref(database, `University/${key}`), {
                    [dataIndex]: value,
                });
            } catch (error) {
                toast.error('Error when update data');
            }
        }
    };

    const checkUniCodeExistence = async (newUniCode) => {
        try {
            const snapshot = await get(child(ref(database), 'University'));
            if (snapshot.exists()) {
                const universities = snapshot.val();
                const uniCodeExists = Object.values(universities).some(
                    (uni) => uni.uniCode === newUniCode.toLowerCase(),
                );
                return uniCodeExists;
            }
            return false;
        } catch (error) {
            toast.error('Error checking uniCode existence');
            return false;
        }
    };

    const checkNameExistence = async (newName) => {
        try {
            const snapshot = await get(child(ref(database), 'University'));
            if (snapshot.exists()) {
                const universities = snapshot.val();
                const uniNameExists = Object.values(universities).some((uni) => uni.nameU === newName.toLowerCase());
                return uniNameExists;
            }
            return false;
        } catch (error) {
            toast.error('Error checking uniName existence');
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
                if (row.averageS > 10 || row.averageS < 0) {
                    toast.error('Invalid Entrance Score Format');
                }
                if (row.uniCode !== item.uniCode) {
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

                const updatedRow = {
                    ...newData[index],
                    target: parseInt(newData[index].target),
                };

                newData[index] = updatedRow;
                setUniData(newData);
                setEditingKey('');

                await update(ref(database, `University/${key}`), updatedRow);
                toast.success('Data updated successfully');
            } else {
                newData.push(row);
                setUniData(newData);
                setEditingKey('');
                handleFieldChange(key, Object.keys(row)[0], row[Object.keys(row)[0]]);

                await set(ref(database, `University/${key}`), row);
            }
        } catch (errInfo) {
            toast.error('Validate Failed');
        }
    };

    const onChange = (pagination, filters, sorter, extra) => {
        const totalRows = extra.total;
        if (totalRows <= 5 && pagination.current === 1) {
            setPagination({ ...pagination, current: 2 });
        } else {
            setPagination(pagination);
        }
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div className="filter" onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    className="search"
                    ref={searchInput}
                    placeholder={t('placeholder.search')}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                />
                <Space>
                    <Button
                        className="all-btn-filter"
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                    >
                        {t('button.search')}
                    </Button>
                    <Button
                        className="all-btn-filter"
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                    >
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
        filterIcon: () => <SearchOutlined className="ic-search" />,
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
            title: t('table.Name'),
            dataIndex: 'nameU',
            key: 'nameU',
            width: '30%',
            fixed: 'left',
            editable: true,
            ...getColumnSearchProps('nameU'),
            render: (text, record) => (
                <Typography.Link onClick={() => handleSchoolDetail(record)}>{text}</Typography.Link>
            ),
        },
        {
            title: t('table.UniCode'),
            dataIndex: 'uniCode',
            width: '13%',
            editable: true,
            ...getColumnSearchProps('uniCode'),
            render: (text, record) => (
                <Tooltip title={record.isRegistered === record.target ? 'This school is full' : ''}>
                    <span className={record.isRegistered === record.target ? 'uniYes' : 'uniNo'}>{text}</span>
                </Tooltip>
            ),
            key: 'uniCode',
        },
        {
            title: t('table.Address'),
            dataIndex: 'address',
            filterSearch: true,
            editable: true,
            width: '20%',
            key: 'address',
        },
        {
            title: t('table.Entrance Score'),
            dataIndex: 'averageS',
            width: '15%',
            sorter: (a, b) => a.averageS - b.averageS,
            key: 'averageS',
        },
        {
            title: t('table.Number of registration'),
            dataIndex: 'isRegistered',
            width: '13%',
            key: 'isRegistered',
            render: (_, record) => {
                setNumberRegist(record);
                return record.isRegistered;
            },
        },
        {
            title: t('table.Target'),
            dataIndex: 'target',
            width: '10%',
            editable: true,
            sorter: (a, b) => a.targets - b.targets,
            key: 'target',
        },
        {
            title: t('table.Action'),
            dataIndex: 'operation',
            width: '13%',
            fixed: 'right',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link className="typolink" onClick={() => save(record.key)}>
                            {t('title.edit')}
                        </Typography.Link>
                        <Typography.Link onClick={cancel}>{t('title.cancel')}</Typography.Link>
                    </span>
                ) : (
                    <Space size={'middle'}>
                        <Typography.Link className="typolink" disabled={editingKey !== ''} onClick={() => edit(record)}>
                            <EditOutlined />
                        </Typography.Link>
                        <Popconfirm title={t('title.delete')} onConfirm={() => handleDelete(record)}>
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
        <div className="LayoutUni">
            <Form form={form} component={false}>
                <Space direction="vertical" size={'small'}>
                    <div className="table">
                        <FormAdd UniData={UniData} setUniData={setUniData} />
                        <Spin spinning={loading}>
                            <Table
                                columns={mergedColumns}
                                dataSource={UniData}
                                onChange={onChange}
                                pagination={{
                                    defaultPageSize: 10,
                                    pageSizeOptions: ['10', '20', '40', '100'],
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    showTotal: (total) => `${t('title.total')} ${total}`,
                                }}
                                scroll={{ x: 'calc(100vh - 290px)', y: 'calc(100vh - 350px)' }}
                                components={{
                                    body: {
                                        cell: EditableCell,
                                    },
                                }}
                                rowHoverable={false}
                                rowClassName="rowUni"
                                ref={tableRef}
                            />
                        </Spin>
                    </div>
                </Space>
            </Form>
            <Modal
                open={isModalDetailVisible}
                onCancel={handleCancel}
                onOk={handleOk}
                width={1000}
                height={500}
                style={{ marginLeft: '25%' }}
            >
                <FormDetail
                    university={selectedUniverse}
                    open={isModalDetailVisible}
                    setLoading={setLoading}
                    loading={loading}
                />
            </Modal>
        </div>
    );
};

export default AddSchool;
