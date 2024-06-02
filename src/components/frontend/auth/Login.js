import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'firebase/auth';
import { ref, child, getDatabase, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { Link, Redirect } from 'react-router-dom';
import '../../../assets/css/login.css';
import { firebaseConfig } from '../../../constants/constants';
import { validateEmailFormat } from '../../../commonFunctions';
import { useTranslation } from 'react-i18next';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space, Typography } from 'antd';
import bcrypt from 'bcryptjs';
export const Login = () => {
    const { t, i18n } = useTranslation('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const [loadingLogin, setLoadingLogin] = useState(false);

    useEffect(() => {
        const passwordInput = document.querySelector('.pass_login');
        const eyeBtn = document.querySelector('.eye');
        const handleFocus = () => {
            if (passwordInput.value.trim() !== '') {
                eyeBtn.style.display = 'block';
            }

            passwordInput.onkeyup = () => {
                let val = passwordInput.value;
                if (val.trim() !== '') {
                    eyeBtn.style.display = 'block';
                } else {
                    eyeBtn.style.display = 'none';
                    passwordInput.setAttribute('type', 'password');
                    eyeBtn.classList.remove('fa-eye-slash');
                    eyeBtn.classList.add('fa-eye');
                }
            };
        };

        const handleEyeClick = () => {
            if (passwordInput.type === 'password') {
                passwordInput.setAttribute('type', 'text');
                eyeBtn.classList.remove('fa-eye');
                eyeBtn.classList.add('fa-eye-slash');
            } else {
                passwordInput.setAttribute('type', 'password');
                eyeBtn.classList.add('fa-eye');
                eyeBtn.classList.remove('fa-eye-slash');
            }
        };

        passwordInput.addEventListener('focus', handleFocus);
        eyeBtn.addEventListener('click', handleEyeClick);

        return () => {
            passwordInput.removeEventListener('focus', handleFocus);
            eyeBtn.removeEventListener('click', handleEyeClick);
        };
    }, []);

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
                            const temp = x[item];
                            localStorage.setItem('Infor', JSON.stringify(temp));
                        }
                    }
                }
            });
        }
    };
    const handleLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    const items = [
        {
            key: '1',
            label: 'English',
            onClick: () => handleLanguage('en'),
        },
        {
            key: '2',
            label: 'Tiếng Việt',
            onClick: () => handleLanguage('vi'),
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
                    get(child(ref(db), `Account/`))
                        .then((snapshot) => {
                            if (snapshot.exists()) {
                                const x = snapshot.val();
                                const listItem = Object.values(x).map((user) => user);
                                const y = listItem.filter(
                                    (item) =>
                                        item.email === email && bcrypt.compareSync(password, item.password) === true,
                                );
                                if (y.length !== 0) {
                                    for (let i in y) {
                                        if (y[i].name !== undefined && y[i].name !== null) {
                                            localStorage.setItem('Role', y[i].Role);
                                            localStorage.setItem('Name', y[i].name);
                                            localStorage.setItem('Email', JSON.stringify(y[i].email));

                                            if (rememberMe === true) {
                                                localStorage.setItem('userToken', y[i].email);
                                            }

                                            saveOnLocal(y[i].Role);
                                        } else {
                                            saveOnLocal(y[i].Role);
                                        }
                                    }

                                    setIsLoggedIn(true);
                                    localStorage.setItem('isLoggedIn', 'true');
                                    setLoadingLogin(false);

                                    <Link to="/admin/dashboard" />;
                                } else {
                                    setLoadingLogin(false);

                                    toast.error('Account not found. Please check your email and password again.');
                                }
                            } else {
                                setLoadingLogin(false);

                                toast.error('No data available');
                            }
                        })
                        .catch((error) => {
                            setLoadingLogin(false);

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
    return (
        <>
            <div className="background">
                <div className="form-container">
                    <div className="col col-1">
                        <div className="image_layer">
                            <img src="assets/login/img/FPTnew.png" className="form_img_main" alt="" />
                        </div>

                        <p className="featured">
                            {t('title.inform login')} <br /> {t('title.or')} <br /> <br />
                            <span>
                                <Link className="btn-getback" to="/">
                                    {t('button.get back')}
                                </Link>
                            </span>
                        </p>
                    </div>

                    <div className="col col-2">
                        <form action="">
                            <div className="login-form">
                                <div className="form-title">
                                    <span>{t('header')}</span>
                                </div>
                                <div className="form-inputs">
                                    <div className="input-box">
                                        <input
                                            type="email"
                                            className="input-field"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={t('title.email')}
                                            required
                                            onKeyDown={handleEnterKey}
                                        />
                                        <i className="bx bx-envelope icon"></i>
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field pass_login"
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            placeholder={t('title.password')}
                                            required
                                            onKeyDown={handleEnterKey}
                                        />

                                        <i className="bx bx-lock-alt icon"></i>
                                        <i className="fa fa-eye eye icon"></i>
                                    </div>

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
                                        style={{ backgroundColor: '#003865', border: 'none' }}
                                        className="input-box"
                                        onClick={() => getdt(email, password)}
                                        loading={loadingLogin}
                                    >
                                        <div className="input-submit">
                                            <span>{t('button.log in')}</span>
                                            <i className="bx bx-right-arrow-alt"></i>
                                        </div>
                                    </Button>

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
                                                    {t('title.language')}
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
