import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Tooltip, Typography, Button, Space, Modal, Spin } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import Highlighter from 'react-highlight-words';
import { get, ref, child, remove, update, set } from 'firebase/database';
import FormDetail from './Modal_detail';
import FormAdd from './formAddSchool';
import { database } from '../firebaseConfig.js';
import './css/AddSchool.css';
import { useTranslation } from 'react-i18next';
import { HandleErrorEdit } from '../../commonFunctions.js';

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
    const tableRef = useRef(null);
    const searchInput = useRef(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const isEditing = (record) => record.key === editingKey;

    const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
        const [error, setError] = useState(null);
        const inputNode = <Input />;
        const isTarget = dataIndex === 'target';
        const isEntrance = dataIndex === 'averageS';
        const rules = [
            {
                validator: (_, value) => {
                    if (dataIndex) {
                        if (value === '' || value === null) {
                            setError('Please enter input');
                            return;
                        }
                    }
                    if (value !== '' && value !== null) {
                        if (isTarget) {
                            if (value < record.isRegistered) {
                                setError('Target must be greater than or equal to Num of registered');
                                return <HandleErrorEdit />;
                            }
                            if (!/^\d+$/.test(value)) {
                                setError('Target must contain only numbers');
                                return <HandleErrorEdit />;
                            }
                            if (!(value <= 1000)) {
                                setError('Target must be <= 1000');
                                return <HandleErrorEdit />;
                            }
                        }

                        if (isEntrance) {
                            if (/^[0-9]*\.?[0-9]+$/.test(value) === false) {
                                setError('Entrance score only contain number');
                                return <HandleErrorEdit />;
                            }
                            if (!(value >= 0 && value <= 10)) {
                                console.log('11');
                                setError('Entrance Score must be > 0 and <= 10');
                                return <HandleErrorEdit />;
                            }

                            if (value > record.averageS) {
                                setError('New Entrance score cannot be greater than current Entrance score');
                                return <HandleErrorEdit />;
                            }
                        }
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
                    <div>
                        <Form.Item className="form-editCell" name={dataIndex} rules={rules}>
                            {inputNode}
                        </Form.Item>
                        {error && (
                            <div>
                                {error === 'Please enter input' ? (
                                    <span style={{ color: 'red' }}>Please enter input</span>
                                ) : (
                                    <Tooltip
                                        title={error}
                                        color={'red'}
                                        key={'red'}
                                        placement="bottom"
                                        style={{ display: 'flex' }}
                                    >
                                        <span style={{ color: 'red' }}>{t('warning.title')}</span>
                                        <ExclamationCircleOutlined
                                            style={{ marginLeft: '5px', color: '#f5554a', fontWeight: 'bold' }}
                                        />
                                    </Tooltip>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    children
                )}
            </td>
        );
    };

    const handleSchoolDetail = (record) => {
        setIsRegistered(record.isRegistered !== 0);
        setDetailVisible(true);
        setSelectedUniverse(record);
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        console.log('start');
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        console.log('end');
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
                await get(child(ref(database), `University/${record.uniCode}/registeration`)).then((snapshot) => {
                    if (snapshot.exists()){
                        const x = snapshot.val();

                        for (let i in x) {
                            const temp = x[i].id;
                            let z = null;
                             get(child(ref(database), `Detail/${temp}/uniCode`)).then((snapshot) => {
                                if (snapshot.exists()) {
                                    const y = snapshot.val();
                                    const listItem = Object.values(y).map((user) => user);
                                    z = listItem.filter((item) => item !== record.uniCode);
                                    update(ref(database, `Detail/${temp}/`), {
                                        uniCode: z,
                                    });
                                }
                            });
                        }
                    }
                });
            }
            await remove(child(ref(database), `University/${record.uniCode}`));
            const newUni = UniData.filter((item) => item.uniCode !== record.uniCode);
            setUniData(newUni);
            toast.success('Delete university successfully');
        } catch (error) {
            toast.error('Error when deleting data', error);
        }
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
            console.log(row);
            const newData = [...UniData];
            const index = newData.findIndex((item) => key === item.key);
            console.log(index, key);
            if (index > -1) {
                const item = newData[index];
                if (row.target < item.isRegistered) {
                    toast.error('Targets must not be less than Number of registration');
                    return;
                }
                if (row.averageS > 10 || row.averageS < 0) {
                    toast.error('Invalid Entrance Score Format');
                    return;
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
                    nameU: row.nameU,
                    address: row.address,
                    averageS: parseFloat(newData[index].averageS),
                };
                newData[index] = updatedRow;
                setUniData(newData);
                setEditingKey('');

                await update(ref(database, `University/${key}`), updatedRow);
                await toast.success('Data updated successfully');
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

    const columns = [
        {
            title: t('Name + Unicode'),
            render: (record) => (
                <React.Fragment>
                    {record.uniCode}
                    <br />
                    {record.nameU}
                </React.Fragment>
            ),
            responsive: ['xs'],
        },

        {
            title: t('table.UniCode'),
            dataIndex: 'uniCode',
            key: 'uniCode',
            width: '20%',
            fixed: 'left',
            ...getColumnSearchProps('uniCode'),
            render: (text, record) => {
                return (
                    <Typography.Link className="idOnclick" onClick={() => handleSchoolDetail(record)}>
                        {text}
                    </Typography.Link>
                );
            },

            responsive: ['sm'],
        },
        {
            title: t('table.Name'),
            dataIndex: 'nameU',
            width: '26%',
            editable: true,
            ...getColumnSearchProps('nameU'),
            render: (text, record) => (
                <Tooltip title={record.isRegistered === record.target ? t('tooltip.full') : t('tooltip.notfull')}>
                    <span className={record.isRegistered === record.target ? 'uniYes' : 'uniNo'}>{text}</span>
                </Tooltip>
            ),
            key: 'nameU',
            responsive: ['sm'],
        },
        {
            title: t('table.Address'),
            dataIndex: 'address',
            filterSearch: true,
            editable: true,
            width: '40%',
            key: 'address',
            responsive: ['sm'],
        },
        {
            title: t('table.Entrance Score'),
            dataIndex: 'averageS',
            width: '25%',
            editable: true,
            sorter: (a, b) => a.averageS - b.averageS,
            key: 'averageS',
            responsive: ['sm'],
        },
        {
            title: t('table.Number of registration'),
            dataIndex: 'isRegistered',
            width: '20%',
            key: 'isRegistered',
            render: (_, record) => {
                return record.isRegistered;
            },
            responsive: ['sm'],
        },
        {
            title: t('table.Target'),
            dataIndex: 'target',
            width: '20%',
            editable: true,
            sorter: (a, b) => a.target - b.target,
            key: 'target',
            responsive: ['sm'],
        },
        {
            title: t('table.Action'),
            dataIndex: 'operation',
            width: '18%',
            fixed: 'right',
            responsive: ['sm'],
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
                        <Popconfirm
                            title={t('title.delete')}
                            onConfirm={() => handleDelete(record)}
                            okText={t('confirm.ok')}
                            cancelText={t('confirm.cancel')}
                        >
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
                                    marginTop: 20,
                                    showTotal: (total) => `${t('title.total')} ${total}`,
                                }}
                                scroll={{ x: 'calc(100vw - 290px)', y: 'calc(100vh - 260px)' }}
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
                width={1000}
                height={500}
                style={{ marginLeft: '20%' }}
                footer={null}
            >
                <FormDetail university={selectedUniverse} open={isModalDetailVisible} isRegistered={isRegistered} />
            </Modal>
        </div>
    );
};

export default AddSchool;
