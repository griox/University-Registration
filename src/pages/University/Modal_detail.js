import { get, ref, child } from 'firebase/database';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Descriptions, Table, Form, Spin, Input, Space, Button } from 'antd';
import { SearchOutlined, WarningFilled } from '@ant-design/icons';
import { database } from '../firebaseConfig.js';
import './css/Modal_detail.css';
import { useTranslation } from 'react-i18next';
import Highlighter from 'react-highlight-words';

export const Form_Detail = ({ university, isRegistered, page, setPage }) => {
    const [student, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const student_regist = university.registeration;
    const { t } = useTranslation('detailuniversity');
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    // const [currentPage, setCurrentPage] = useState(pageCurrent);
    const cancel = (page) => {
        setPage(page);
        form.resetFields();
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
    const items = [
        {
            key: '1',
            label: t('label.unicode'),
            children: university.uniCode,
        },
        {
            key: '2',
            label: t('label.entrance'),
            children: university.averageS,
        },
        {
            key: '3',
            label: t('label.regis'),
            children: university.isRegistered,
        },
        {
            key: '4',
            label: t('label.target'),
            children: university.target,
        },
        {
            key: '5',
            label: t('label.address'),
            children: university.address,
        },
        {
            key: '6 ',
            label: t('label.uniname'),
            children: university.nameU,
        },
    ];
    const colums = [
        {
            title: t('title.id'),
            dataIndex: 'id',
            width: '10%',
            ...getColumnSearchProps('id'),
            fixed: 'left',
        },

        {
            title: t('title.name'),
            dataIndex: 'name',
            width: '19%',
            editable: true,
            ...getColumnSearchProps('name'),
            fixed: 'left',
            key: 'name',
        },
        {
            title: t('title.email'),
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'),
            width: '15%',
        },
        {
            title: t('title.math'),
            dataIndex: 'MathScore',
            width: '10%',
            editable: true,

            sorter: (a, b) => a.MathScore - b.MathScore,
        },
        {
            title: t('title.literature'),
            dataIndex: 'LiteratureScore',
            width: '11%',
            editable: true,

            sorter: (a, b) => a.LiteratureScore - b.LiteratureScore,
        },
        {
            title: t('title.english'),
            dataIndex: 'EnglishScore',
            width: '10%',
            editable: true,

            sorter: (a, b) => a.EnglishScore - b.EnglishScore,
        },
        {
            title: t('title.average'),
            dataIndex: 'AverageScore',
            width: '10%',
            sorter: (a, b) => a.AverageScore - b.AverageScore,
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (student_regist && typeof student_regist === 'object') {
                setLoading(true);
                const studentList = Object.values(student_regist).map((student) => student.id);
                const studentsData = [];
                for (const studentId of studentList) {
                    const studentRef = child(ref(database), `Detail/${studentId}`);
                    try {
                        const snapshot = await get(studentRef);
                        if (snapshot.exists()) {
                            const studentData = snapshot.val();
                            studentsData.push({ id: studentId, ...studentData });
                        }
                    } catch (error) {
                        toast.error('Cannot fetch student details');
                    }
                }
                setLoading(false);
                setStudents(studentsData);
            } else {
                setLoading(false);
            }
        };
        fetchData();
    }, [student_regist, setLoading]);

    return (
        <>
            <Descriptions title={t('title.uniinf')} column={2}>
                {items.map((item) => (
                    <Descriptions.Item key={item.key} label={item.label}>
                        {item.children}
                    </Descriptions.Item>
                ))}
            </Descriptions>
            <Spin spinning={loading}>
                {isRegistered ? (
                    <>
                        <h4>{t('title.list')}</h4>
                        <Table
                            className="table"
                            rowHoverable={false}
                            dataSource={student}
                            columns={colums}
                            scroll={{
                                x: 900,
                                y: 'calc(100vh - 530px)',
                            }}
                            showSorterTooltip={{
                                target: 'sorter-icon',
                            }}
                            pagination={{
                                current: page,
                                onChange: cancel,
                                showSizeChanger: true,
                                showQuickJumper: true,
                            }}
                        />
                    </>
                ) : (
                    <h4 className="description">
                        {t('title.notRegist')}
                        <WarningFilled />
                    </h4>
                )}
            </Spin>
        </>
    );
};
export default Form_Detail;
