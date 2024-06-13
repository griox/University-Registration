import React, { useEffect, useState } from 'react';
import 'firebase/auth';
import { child, get, getDatabase, ref, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { Button, Form, Input, Tooltip } from 'antd';
import { useHistory } from 'react-router-dom';
import '../../../assets/css/register.css';
import { useDispatch } from 'react-redux';
import { firebaseConfig } from '../../../constants/constants';
import { disableButton, encodePath, getback } from '../../../commonFunctions';
import { useTranslation } from 'react-i18next';
import { locales } from '../../../translation/i18n';
import { DownOutlined, ExclamationCircleOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Dropdown, Space, Typography } from 'antd';
import CryptoJS from 'crypto-js';

const Changepass = () => {
    const { t, i18n } = useTranslation('changePassword');
    const storedLanguage = localStorage.getItem('language') || 'en';
    const currentLanguage = locales[storedLanguage === 'vi' ? 'vi' : 'en'];
    const [selectedLanguage, setSelectedLanguage] = useState(storedLanguage === 'vi' ? 'Tiếng Việt' : 'English');
    const history = useHistory();
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [reNewPass, setReNewPass] = useState('');
    const dispatch = useDispatch();
    const [loadingChangePass, setLoadingChangePass] = useState(false);
    const [errorOldPass, setErrorOldPass] = useState('');
    const [errorNewPass, setErrorNewPass] = useState('');
    const [errorReNewPass, setErrorReNewPass] = useState('');

    const secretKey = 'Tvx1234@';

    const handleLogout = () => {
        localStorage.setItem('Infor', JSON.stringify(''));
        localStorage.setItem('Name', '');
        localStorage.setItem('Email', '');
        localStorage.setItem('Role', '');
        localStorage.removeItem('userToken');

        dispatch({ type: 'logout' });
        history.push('/Login');
    };

    useEffect(() => {
        i18n.changeLanguage(storedLanguage);
    }, [i18n, storedLanguage]);
    const handleLanguage = (lng, label) => {
        i18n.changeLanguage(lng);
        setSelectedLanguage(label);
        localStorage.setItem('language', lng);
    };
    const items = [
        {
            key: '1',
            label: currentLanguage === 'Tiếng việt' ? 'Tiếng anh' : 'English',
            icon: <img width="20" height="20" src="https://img.icons8.com/color/48/usa.png" alt="usa" />,
            onClick: () => handleLanguage('en', currentLanguage === 'VietNam' ? 'English' : 'English'),
        },
        {
            key: '2',
            label: currentLanguage === 'Tiếng việt' ? 'Tiếng việt' : 'Vietnam',
            icon: <img width="20" height="20" src="https://img.icons8.com/color/48/vietnam.png" alt="vietnam" />,
            onClick: () => handleLanguage('vi', currentLanguage === 'Tiếng việt' ? 'Tiếng việt' : 'Vietnam'),
        },
    ];

    const changePassWord = () => {
        setLoadingChangePass(true);
        let temp = localStorage.getItem('Email');

        temp = encodePath(temp);

        get(child(ref(db), `Account/` + temp)).then((snapshot) => {
            if (snapshot.exists()) {
                const x = snapshot.val();

                try {
                    var temp = CryptoJS.AES.decrypt(x.password, secretKey);
                    temp = temp.toString(CryptoJS.enc.Utf8);
                    if (temp === oldPass) {
                        var newHash = CryptoJS.AES.encrypt(newPass, secretKey).toString();
                        update(ref(db, 'Account/' + temp), {
                            password: newHash,
                        })
                            .then(() => {
                                setLoadingChangePass(false);
                                toast.success('Updated sucessfully');
                                handleLogout();
                            })
                            .catch((error) => {
                                toast.error('lỗi' + error);
                            });
                    } else {
                        setLoadingChangePass(false);

                        toast.error('Your password is not correct');
                    }
                } catch (error) {
                    console.log(error.message);
                }
            } else {
                setLoadingChangePass(false);

                toast.error('Data is not available');
            }
        });
    };
    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            changePassWord();
        }
    };
    const checkValue = (name, value) => {
        setOldPass(value);

        if (name === 'pass') {
            if (value === '' || value === null) {
                setErrorOldPass('Please input');
                return;
            }
            if (value.includes(' ')) {
                setErrorOldPass('Must not have space');
                return;
            }
            setErrorOldPass('');
        }
        if (name === 'newpass') {
            setNewPass(value);

            if (value === '' || value === null) {
                setErrorNewPass('Please input');
                return;
            }
            if (value.includes(' ')) {
                setErrorNewPass('Must not have space');
                return;
            }
            if (checkPasswordStrength(value) === false) {
                setErrorNewPass(
                    'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number, and be a minimum of 8 characters long.',
                );
                return;
            }
            if (value === oldPass) {
                setErrorNewPass('New pass must be different from old pass');
                return;
            }

            setErrorNewPass('');
        }
        if (name === 'renewpass') {
            setReNewPass(value);

            if (value === '' || value === null) {
                setErrorReNewPass('Please input');
                return;
            }
            if (value.includes(' ')) {
                setErrorReNewPass('Must not have space');
                return;
            }
            if (checkPasswordStrength(value) === false) {
                setErrorReNewPass(
                    'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number, and be a minimum of 8 characters long.',
                );
                return;
            }
            if (value !== newPass) {
                setErrorReNewPass("Two password don't match together");
                return;
            }

            setErrorReNewPass('');
        }
    };
    const checkPasswordStrength = (password) => {
        // Kiểm tra độ dài của mật khẩu
        if (password.length < 8) {
            return false;
        }

        // Kiểm tra xem mật khẩu có chứa ít nhất một ký tự in hoa, một ký tự thường, một ký tự đặc biệt và một số hay không
        const uppercaseRegex = /[A-Z]/; // Ký tự in hoa
        const lowercaseRegex = /[a-z]/; // Ký tự thường
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/; // Ký tự đặc biệt
        const numberRegex = /[0-9]/; // Số

        if (
            !uppercaseRegex.test(password) ||
            !lowercaseRegex.test(password) ||
            !specialCharRegex.test(password) ||
            !numberRegex.test(password)
        ) {
            return false;
        }

        // Nếu mật khẩu vượt qua tất cả các điều kiện kiểm tra, trả về true
        return true;
    };
    const handleItem = (error, value, name, placeholder) => {
        console.log(value);
        return (
            <>
                <Form.Item
                    name="email"
                    validateStatus={error ? 'error' : ''}
                    help={
                        error !== '' ? (
                            <div>
                                <Tooltip title={error} color={'red'} key={'red'} placement="bottom">
                                    <span style={{ color: 'red', fontSize: '13px' }}>{t('warning.title')}</span>
                                    <ExclamationCircleOutlined
                                        style={{ marginLeft: '5px', color: '#f5554a', fontWeight: 'bold' }}
                                    />
                                </Tooltip>
                            </div>
                        ) : (
                            ''
                        )
                    }
                    rules={[
                        {
                            required: true,
                            message: 'Please input!',
                        },
                    ]}
                >
                    <Input.Password
                        placeholder={placeholder}
                        onChange={(e) => checkValue(name, e.target.value)}
                        onKeyDown={handleEnterKey}
                        allowClear
                        style={{
                            border: 'none',
                            padding: '15px',

                            backgroundColor: 'blue',
                        }}
                        value={value}
                        iconRender={(visible) =>
                            visible ? (
                                <EyeTwoTone style={{ fontSize: '20px' }} />
                            ) : (
                                <EyeInvisibleOutlined style={{ fontSize: '20px' }} />
                            )
                        }
                    />
                </Form.Item>
            </>
        );
    };

    const clear = () => {
        setOldPass('');
        setNewPass('');
        setReNewPass('');
    };
    const handleButton = (loading, action, string) => {
        return (
            <>
                <div className="input-box">
                    <br />

                    <Button loading={loading} className="input-submit" onClick={action}>
                        <span>{string}</span>
                        <i className="bx bx-right-arrow-alt"></i>
                    </Button>
                </div>
            </>
        );
    };
    return (
        <>
            <div className="background">
                <div className="form-container">
                    {getback(history, t('title.inform changepassword'), t('title.or'), t('button.get back'))}

                    <div className="col col-2">
                        <form action="">
                            <div className="login-form">
                                <br />
                                <br />
                                <div className="form-title">
                                    <span>{t('header')}</span>
                                </div>

                                <div className="form-inputs">
                                    <Form.Item
                                        name="email"
                                        validateStatus={errorOldPass ? 'error' : ''}
                                        help={
                                            errorOldPass !== '' ? (
                                                <div>
                                                    <Tooltip
                                                        title={errorOldPass}
                                                        color={'red'}
                                                        key={'red'}
                                                        placement="bottom"
                                                    >
                                                        <span style={{ color: 'red', fontSize: '13px' }}>
                                                            {t('warning.title')}
                                                        </span>
                                                        <ExclamationCircleOutlined
                                                            style={{
                                                                marginLeft: '5px',
                                                                color: '#f5554a',
                                                                fontWeight: 'bold',
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </div>
                                            ) : (
                                                ''
                                            )
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input!',
                                            },
                                        ]}
                                    >
                                        <Input.Password
                                            placeholder={t('placeholder.oldpass')}
                                            onChange={(e) => checkValue('pass', e.target.value)}
                                            onKeyDown={handleEnterKey}
                                            allowClear
                                            style={{
                                                border: 'none',
                                                padding: '15px',

                                                backgroundColor: 'blue',
                                            }}
                                            value={oldPass}
                                            iconRender={(visible) =>
                                                visible ? (
                                                    <EyeTwoTone style={{ fontSize: '20px' }} />
                                                ) : (
                                                    <EyeInvisibleOutlined style={{ fontSize: '20px' }} />
                                                )
                                            }
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="email"
                                        validateStatus={errorNewPass ? 'error' : ''}
                                        help={
                                            errorNewPass !== '' ? (
                                                <div>
                                                    <Tooltip
                                                        title={errorNewPass}
                                                        color={'red'}
                                                        key={'red'}
                                                        placement="bottom"
                                                    >
                                                        <span style={{ color: 'red', fontSize: '13px' }}>
                                                            {t('warning.title')}
                                                        </span>
                                                        <ExclamationCircleOutlined
                                                            style={{
                                                                marginLeft: '5px',
                                                                color: '#f5554a',
                                                                fontWeight: 'bold',
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </div>
                                            ) : (
                                                ''
                                            )
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input!',
                                            },
                                        ]}
                                    >
                                        <Input.Password
                                            placeholder={t('placeholder.newpass')}
                                            onChange={(e) => checkValue('newpass', e.target.value)}
                                            onKeyDown={handleEnterKey}
                                            allowClear
                                            style={{
                                                border: 'none',
                                                padding: '15px',

                                                backgroundColor: 'blue',
                                            }}
                                            value={newPass}
                                            iconRender={(visible) =>
                                                visible ? (
                                                    <EyeTwoTone style={{ fontSize: '20px' }} />
                                                ) : (
                                                    <EyeInvisibleOutlined style={{ fontSize: '20px' }} />
                                                )
                                            }
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="email"
                                        validateStatus={errorReNewPass ? 'error' : ''}
                                        help={
                                            errorReNewPass !== '' ? (
                                                <div>
                                                    <Tooltip
                                                        title={errorReNewPass}
                                                        color={'red'}
                                                        key={'red'}
                                                        placement="bottom"
                                                    >
                                                        <span style={{ color: 'red', fontSize: '13px' }}>
                                                            {t('warning.title')}
                                                        </span>
                                                        <ExclamationCircleOutlined
                                                            style={{
                                                                marginLeft: '5px',
                                                                color: '#f5554a',
                                                                fontWeight: 'bold',
                                                            }}
                                                        />
                                                    </Tooltip>
                                                </div>
                                            ) : (
                                                ''
                                            )
                                        }
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input!',
                                            },
                                        ]}
                                    >
                                        <Input.Password
                                            placeholder={t('placeholder.renewpass')}
                                            onChange={(e) => checkValue('renewpass', e.target.value)}
                                            onKeyDown={handleEnterKey}
                                            allowClear
                                            style={{
                                                border: 'none',
                                                padding: '15px',

                                                backgroundColor: 'blue',
                                            }}
                                            value={reNewPass}
                                            iconRender={(visible) =>
                                                visible ? (
                                                    <EyeTwoTone style={{ fontSize: '20px' }} />
                                                ) : (
                                                    <EyeInvisibleOutlined style={{ fontSize: '20px' }} />
                                                )
                                            }
                                        />
                                    </Form.Item>

                                    <div className="input-box">
                                        <br />

                                        <Button
                                            loading={loadingChangePass}
                                            className="input-submit"
                                            onClick={changePassWord}
                                            disabled={
                                                disableButton(errorOldPass, oldPass) === false &&
                                                disableButton(errorNewPass, newPass) === false &&
                                                disableButton(errorReNewPass, reNewPass) === false
                                                    ? false
                                                    : true
                                            }
                                            style={{
                                                color: '#fff',
                                                backgroundColor:
                                                    errorOldPass === '' &&
                                                    errorNewPass === '' &&
                                                    errorReNewPass === '' &&
                                                    oldPass !== '' &&
                                                    newPass !== '' &&
                                                    reNewPass !== ''
                                                        ? ''
                                                        : 'rgba(255, 255, 255, 0.3)',
                                            }}
                                        >
                                            <span>{t('button.change')}</span>
                                            <i className="bx bx-right-arrow-alt"></i>
                                        </Button>
                                    </div>
                                    {handleButton(false, clear, t('button.clear'))}
                                    {/* {language(items, t('title.language'))} */}
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
                                                    {selectedLanguage}
                                                    <DownOutlined />
                                                </Space>
                                            </Typography.Link>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Changepass;
