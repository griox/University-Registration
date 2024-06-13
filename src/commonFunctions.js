import { DownOutlined, ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Space, Tooltip, Typography } from 'antd';
import { useRef, useState } from 'react';
import Highlighter from 'react-highlight-words';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import ContactsIcon from '@mui/icons-material/Contacts';
import { useTranslation } from 'react-i18next';

export const GetColumnSearchProps = (dataIndex) => {
    const searchInput = useRef(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

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
            <div onKeyDown={(e) => e.stopPropagation()} className="getColumnSearchProps">
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    className="getColumnSearchProps-Input"
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        className="getColumnSearchProps-Button"
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        className="getColumnSearchProps-Button"
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
            <SearchOutlined className={filtered ? 'getColumnSearchProps-filterIcon' : undefined} />
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
    getColumnSearchProps(dataIndex);
};

export const encodePath = (email) => {
    if (email) return email.replace(/\./g, ',');
    else return 0;
};

export const decodePath = (email) => {
    if (email) return email.replace(/,/g, '.');
    else return 0;
};

export const validateEmailFormat = (val) => {
    return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(val) || /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/.test(val);
};

export const validatePasswordFormat = (password) => {
    if (password.length < 8) {
        return false;
    }
    if (password.match(/[a-z]+/) === null) {
        return false;
    }
    if (password.match(/[A-Z]+/) === null) {
        return false;
    }
    if (password.match(/[0-9]+/) === null) {
        return false;
    }
    if (password.match(/[$@#&!]+/) === null) {
        return false;
    }
    return true;
};

export const HandleError = (props) => {
    return (
        <div>
            <span>Invalid template </span>
            <Tooltip title={props.string} color={'red'} key={'red'} placement="bottom">
                <ExclamationCircleOutlined style={{ marginLeft: '5px' }} />
            </Tooltip>
        </div>
    );
};

export const HandleErrorEdit = ({ errorMessage }) => {
    const { t } = useTranslation('university');
    return (
        <div>
            <Tooltip title={errorMessage} color={'red'} key={'red'} placement="bottom">
                <span style={{ color: 'red', fontSize: '13px' }}>{t('warning.title')}</span>
                <ExclamationCircleOutlined style={{ marginLeft: '5px', color: '#f5554a', fontWeight: 'bold' }} />
            </Tooltip>
        </div>
    );
};

export const onchangeInput = (e, sNP, sENP) => {
    if (
        e
            .toString()
            .trim()
            .replace(/\s{2,}/g, ' ') === '' ||
        e === null
    ) {
        sNP(e);
        sENP('Please input');
    } else if (validatePasswordFormat(e) === false) {
        sNP(e);
        sENP(
            'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number, and be a minimum of 8 characters long.',
        );
    } else {
        sNP(e);
        sENP('');
    }
};
export const language = (items, tLanguage) => {
    return (
        <>
            <div>
                <Dropdown
                    className="drop-menu"
                    menu={{
                        items,
                        selectable: true,
                        defaultSelectedKeys: ['1'],
                    }}
                >
                    <Typography.Link>
                        <Space className="title-drop">
                            {tLanguage}
                            <DownOutlined />
                        </Space>
                    </Typography.Link>
                </Dropdown>
            </div>
        </>
    );
};

export const getback = (history, inform, or, btnGetback) => {
    const goback = () => {
        history.goBack();
    };
    return (
        <>
            <div className="col col-1">
                <div className="image_layer">
                    <img src="assets/login/img/FPTnew.png" className="form_img_main" alt="" />
                </div>

                <p className="featured">
                    {inform} <br /> {or}
                </p>
                <Button onClick={goback} className="btn-getback">
                    {btnGetback}
                </Button>
            </div>
        </>
    );
};

export const disableButton = (error, value) => {
    if (error === false && value !== '') {
        return false;
    } else {
        return true;
    }
};
