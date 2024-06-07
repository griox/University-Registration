import React, { useState } from 'react';
import 'firebase/auth';
import { child, get, getDatabase, ref, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { Button, Form, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import '../../../assets/css/register.css';
import { useDispatch } from 'react-redux';
import { firebaseConfig } from '../../../constants/constants';
import {
    HandleError,
    disableButton,
    encodePath,
    getback,
    language,
    onchangeInput,
    validatePasswordFormat,
} from '../../../commonFunctions';
import { useTranslation } from 'react-i18next';
import { locales } from '../../../translation/i18n';
import { DownOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Dropdown, Space, Typography } from 'antd';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

const Changepass = () => {
    const { t, i18n } = useTranslation('changePassword');
    const currentLanguage = locales[i18n.language === 'vi' ? 'vi' : 'en'];
    const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage === 'Tiếng anh' ? 'Tiếng anh' : 'English');
    const history = useHistory();
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [reNewPass, setReNewPass] = useState('');
    const dispatch = useDispatch();
    const salt = bcrypt.genSaltSync(10);
    const [loadingChangePass, setLoadingChangePass] = useState(false);
    const [errorOldPass, setErrorOldPass] = useState(false);
    const [errorNewPass, setErrorNewPass] = useState(false);
    const [errorReNewPass, setErrorReNewPass] = useState(false);

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
    const handleLanguage = (lng, label) => {
        i18n.changeLanguage(lng);
        setSelectedLanguage(label);
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
        if (oldPass === '') {
            toast.error('Please enter your old password');
            setLoadingChangePass(false);

            return;
        }
        if (newPass === '') {
            toast.error('Please enter your new password');
            setLoadingChangePass(false);

            return;
        }
        if (reNewPass === '') {
            toast.error('Please confirm your password again');
            setLoadingChangePass(false);

            return;
        }
        if (newPass !== reNewPass) {
            toast.error('You confirm your password is incorrect');
            setLoadingChangePass(false);

            return;
        }
        if (validatePasswordFormat(newPass) === false) {
            toast.error(
                'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number, and be a minimum of 8 characters long.',
            );
        }
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

    const handleItem = (error, value, set, setError, string, placeholder) => {
        return (
            <>
                <Form.Item
                    name="email"
                    validateStatus={error ? 'error' : ''}
                    help={error ? <HandleError string={string} /> : ''}
                    rules={[
                        {
                            required: true,
                            message: 'Please input!',
                        },
                    ]}
                >
                    <Input.Password
                        placeholder={placeholder}
                        onChange={(e) => onchangeInput(e.target.value, set, setError)}
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

                    <Button loading={loading} className="input-submit" onClick={action} style={{}}>
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
                                    {handleItem(
                                        errorOldPass,
                                        oldPass,
                                        setOldPass,
                                        setErrorOldPass,
                                        'password',
                                        'Old password',
                                    )}
                                    {handleItem(
                                        errorNewPass,
                                        newPass,
                                        setNewPass,
                                        setErrorNewPass,
                                        'password',
                                        'New password',
                                    )}
                                    {handleItem(
                                        errorReNewPass,
                                        reNewPass,
                                        setReNewPass,
                                        setErrorReNewPass,
                                        'password',
                                        'Re-enter new password',
                                    )}

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
                                                    errorOldPass === false &&
                                                    errorNewPass === false &&
                                                    errorReNewPass === false &&
                                                    oldPass !== '' &&
                                                    newPass !== '' &&
                                                    reNewPass !== ''
                                                        ? ''
                                                        : 'rgba(255, 255, 255, 0.3)',
                                            }}
                                        >
                                            <span>{'Change'}</span>
                                            <i className="bx bx-right-arrow-alt"></i>
                                        </Button>
                                    </div>
                                    {handleButton(false, clear, 'Clear')}
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
                                                    {/* {t('title.language')} */}
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
