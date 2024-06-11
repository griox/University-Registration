import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'firebase/auth';
import { ref, child, getDatabase, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { Link, Redirect } from 'react-router-dom';
import '../../../assets/css/login.css';
import { firebaseConfig } from '../../../constants/constants';
import { HandleError, disableButton, encodePath, validateEmailFormat } from '../../../commonFunctions';
import { useTranslation } from 'react-i18next';
import { locales } from '../../../translation/i18n';
import { DownOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Dropdown, Form, Input, Space, Spin, Typography } from 'antd';
import CryptoJS from 'crypto-js';
export const Login = () => {
    const { t, i18n } = useTranslation('login');
    const storedLanguage = localStorage.getItem('language') || 'en';
    const currentLanguage = locales[storedLanguage === 'vi' ? 'vi' : 'en'];
    const [selectedLanguage, setSelectedLanguage] = useState(storedLanguage === 'vi' ? 'Tiếng Việt' : 'English');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [errorEmail, setErrorEmail] = useState(false);
    const secretKey = 'Tvx1234@';
    const [loginSpin, setLoginSpin] = useState(false);

    useEffect(() => {
        const fetch = () => {
            setLoginSpin(true);
            const tempEmail = localStorage.getItem('userToken');
            if (tempEmail !== null) {
                setRememberMe(true);
                get(child(ref(db), `Account/` + encodePath(tempEmail))).then((snapshot) => {
                    if (snapshot.exists()) {
                        const x = snapshot.val();
                        var temp = CryptoJS.AES.decrypt(x.password, secretKey);
                        temp = temp.toString(CryptoJS.enc.Utf8);
                        setEmail(tempEmail);
                        setPassword(temp);
                        setLoginSpin(false);
                    } else {
                        setLoginSpin(false);
                    }
                });
            } else {
                setLoginSpin(false);
            }
        };
        const timer = setTimeout(fetch, 5);
        return () => clearTimeout(timer);
    }, [db]);
    const saveOnLocal = (role) => {
        if (role === 'super_admin') {
            get(child(ref(db), 'Super_Admin/')).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    for (let item in x) {
                        if (x[item].email === email) {
                            localStorage.setItem('Infor', JSON.stringify(x[item]));
                        }
                    }
                }
            });
        } else if (role === 'admin') {
            get(child(ref(db), 'Admin/')).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    for (let item in x) {
                        if (x[item].email === email) {
                            localStorage.setItem('Infor', JSON.stringify(x[item]));
                        }
                    }
                }
            });
        } else {
            get(child(ref(db), 'Detail/')).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    for (let item in x) {
                        if (x[item].email === email) {
                            localStorage.setItem('Infor', JSON.stringify(x[item]));
                        }
                    }
                }
            });
        }
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
    const getdt = (email, password) => {
        setLoadingLogin(true);
        if (email === '') {
            setLoadingLogin(false);
            toast.error('Please enter your email');
        } else {
            if (validateEmailFormat(email) === false) {
                setLoadingLogin(false);
                toast.error('Incorrect format');
            } else {
                if (password === '') {
                    setLoadingLogin(false);
                    toast.error('Please enter your password');
                } else {
                    get(child(ref(db), `Account/` + encodePath(email)))
                        .then((snapshot) => {
                            if (snapshot.exists()) {
                                const x = snapshot.val();

                                var temp = CryptoJS.AES.decrypt(x.password, secretKey);
                                temp = temp.toString(CryptoJS.enc.Utf8);
                                if (temp === password) {
                                    localStorage.setItem('Role', x.Role);
                                    localStorage.setItem('Name', x.name);
                                    localStorage.setItem('Email', x.email);

                                    if (rememberMe === true) {
                                        localStorage.setItem('userToken', x.email);
                                    } else {
                                        if (localStorage.getItem('userToken') === email) {
                                            localStorage.removeItem('userToken');
                                        }
                                    }

                                    saveOnLocal(x.Role);

                                    setIsLoggedIn(true);
                                    localStorage.setItem('isLoggedIn', 'true');
                                    setLoadingLogin(false);
                                    localStorage.setItem('selectedMenuItem', 'Dashboard');
                                    <Link to="/admin/dashboard" />;
                                } else {
                                    setLoadingLogin(false);

                                    toast.error('Account not found. Please check your email and password again.');
                                }
                            } else {
                                setLoadingLogin(false);

                                toast.error('Account not found. Please check your email and password again.');
                            }
                        })
                        .catch((error) => {
                            setLoadingLogin(false);
                            console.log(error);
                            toast.error('Error');
                        });
                }
            }
        }

        <Link to="/admin/dashboard" />;
    };

    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            getdt(email, password);
        }
    };
    // const loginGoogle = () => {
    //     const provider = new GoogleAuthProvider();
    //     signInWithPopup(auth, provider).then(async (result) => {
    //         console.log(result);
    //         if (result.user) {
    //             toast.success('User logged in successfully', {
    //                 position: 'top-center',
    //             });
    //             // <Link to="/admin/dashboard" />;
    //             window.location.href = '/admin/dashboard';
    //         }
    //     });
    // };
    const onchangeEmail = (e) => {
        if (e === '') {
            setEmail(e);
            setErrorEmail(false);
        } else if (validateEmailFormat(e) === false) {
            setEmail(e);
            setErrorEmail(true);
        } else {
            setEmail(e);
            setErrorEmail(false);
        }
    };

    return (
        <>
            <div className="background">
                <div className="form-container">
                    <div className="col col-1">
                        <div className="image_layer">
                            <img src="assets/login/img/FPTnew.png" className="form_img_main" alt="" />
                        </div>

                        <p className="featured">
                            {t('title.inform login')} <br /> {t('title.or')}
                        </p>
                        <Link to="/">
                            <Button className="btn-getback">
                                <span>{t('button.get back')}</span>
                            </Button>
                        </Link>
                    </div>

                    <div className="col col-2">
                        <form action="">
                            <div className="login-form">
                                <div className="form-title">
                                    <span>{t('header')}</span>
                                </div>
                                <div className="form-inputs">
                                    <Spin spinning={loginSpin}>
                                        <Form.Item
                                            name="email"
                                            validateStatus={errorEmail ? 'error' : ''}
                                            help={errorEmail ? <HandleError string="email" /> : ''}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input!',
                                                },
                                            ]}
                                        >
                                            <div>
                                                <Input
                                                    placeholder={t('placeholder.email')}
                                                    onChange={(e) => onchangeEmail(e.target.value)}
                                                    onKeyDown={handleEnterKey}
                                                    allowClear
                                                    style={{
                                                        border: 'none',
                                                        padding: '15px',
                                                    }}
                                                    value={email}
                                                />
                                            </div>
                                        </Form.Item>
                                    </Spin>
                                    <Spin spinning={loginSpin}>
                                        <Input.Password
                                            placeholder={t('placeholder.pass')}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onKeyDown={handleEnterKey}
                                            allowClear
                                            style={{
                                                border: 'none',
                                                padding: '15px',
                                            }}
                                            value={password}
                                            iconRender={(visible) =>
                                                visible ? (
                                                    <EyeTwoTone style={{ fontSize: '20px' }} />
                                                ) : (
                                                    <EyeInvisibleOutlined style={{ fontSize: '20px' }} />
                                                )
                                            }
                                        />
                                    </Spin>

                                    <div className="forget-pass">
                                        <div className="input-box">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={() => setRememberMe(!rememberMe)}
                                            />
                                            <span className="remembertxt_login">{t('title.remember me')}</span>
                                            <Link to="/forgetpass">{t('title.forgot password')}</Link>
                                        </div>
                                    </div>
                                    <Button
                                        className="input-submit"
                                        onClick={() => getdt(email, password)}
                                        loading={loadingLogin}
                                        disabled={
                                            disableButton(errorEmail, email) === false && password !== '' ? false : true
                                        }
                                        style={{
                                            color: 'white',

                                            backgroundColor:
                                                password === '' || email === '' || errorEmail === true
                                                    ? 'rgba(255, 255, 255, 0.3)'
                                                    : '',
                                        }}
                                    >
                                        <span>{t('button.log in')}</span>
                                        <i className="bx bx-right-arrow-alt"></i>
                                    </Button>
                                    {/* <Button className="input-submit" onClick={loginGoogle} loading={loadingLogin}>
                                        <span>{'Đăng nhập với google'}</span>
                                        <i className="bx bx-right-arrow-alt"></i>
                                    </Button> */}

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
            {isLoggedIn && <Redirect to="/admin/dashboard" />}
        </>
    );
};

export default Login;
