import React, { useEffect, useState } from 'react';
import 'firebase/auth';
import { child, get, getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import '../../../assets/css/register.css';
import { firebaseConfig } from '../../../constants/constants';
import { encodePath, validateEmailFormat, validatePasswordFormat } from '../../../commonFunctions';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import bcrypt from 'bcryptjs';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [againPassword, setAgainPassword] = useState('');
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const history = useHistory();
    const { t, i18n } = useTranslation('register');
    const salt = bcrypt.genSaltSync(10);
    const [user, setUser] = useState(false);
    const [loadingUser, setLoadingUser] = useState(false);
    const [loadingAdmin, setLoadingAdmin] = useState(false);

    useEffect(() => {
        const passwordInput1 = document.querySelector('.pass_login_1');
        const eyeBtn1 = document.querySelector('.eye1');
        const passwordInput2 = document.querySelector('.con_pass_login');
        const eyeBtn2 = document.querySelector('.eye2');

        const handlePasswordInput1 = () => {
            if (passwordInput1.value.trim() !== '') {
                eyeBtn1.style.display = 'block';
            } else {
                eyeBtn1.style.display = 'none';
                passwordInput1.setAttribute('type', 'password');
                eyeBtn1.classList.remove('fa-eye-slash');
                eyeBtn1.classList.add('fa-eye');
            }
        };

        const handleEyeBtn1 = () => {
            if (passwordInput1.type === 'password') {
                passwordInput1.setAttribute('type', 'text');
                eyeBtn1.classList.remove('fa-eye');
                eyeBtn1.classList.add('fa-eye-slash');
            } else {
                passwordInput1.setAttribute('type', 'password');
                eyeBtn1.classList.add('fa-eye');
                eyeBtn1.classList.remove('fa-eye-slash');
            }
        };

        const handlePasswordInput2 = () => {
            if (passwordInput2.value.trim() !== '') {
                eyeBtn2.style.display = 'block';
            } else {
                eyeBtn2.style.display = 'none';
                passwordInput2.setAttribute('type', 'password');
                eyeBtn2.classList.remove('fa-eye-slash');
                eyeBtn2.classList.add('fa-eye');
            }
        };

        const handleEyeBtn2 = () => {
            if (passwordInput2.type === 'password') {
                passwordInput2.setAttribute('type', 'text');
                eyeBtn2.classList.remove('fa-eye');
                eyeBtn2.classList.add('fa-eye-slash');
            } else {
                passwordInput2.setAttribute('type', 'password');
                eyeBtn2.classList.add('fa-eye');
                eyeBtn2.classList.remove('fa-eye-slash');
            }
        };

        passwordInput1.addEventListener('focus', handlePasswordInput1);
        passwordInput1.addEventListener('keyup', handlePasswordInput1);
        eyeBtn1.addEventListener('click', handleEyeBtn1);
        passwordInput2.addEventListener('focus', handlePasswordInput2);
        passwordInput2.addEventListener('keyup', handlePasswordInput2);
        eyeBtn2.addEventListener('click', handleEyeBtn2);

        return () => {
            passwordInput1.removeEventListener('focus', handlePasswordInput1);
            passwordInput1.removeEventListener('keyup', handlePasswordInput1);
            eyeBtn1.removeEventListener('click', handleEyeBtn1);
            passwordInput2.removeEventListener('focus', handlePasswordInput2);
            passwordInput2.removeEventListener('keyup', handlePasswordInput2);
            eyeBtn2.removeEventListener('click', handleEyeBtn2);
        };
    }, []);
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
    const clear = () => {
        setFullName('');
        setEmail('');
        setPassword('');
        setAgainPassword('');
    };
    const regist = (props) => {
        if (props.role === 'admin') setLoadingAdmin(true);
        else setLoadingUser(true);
        if (props.name === '') {
            toast.error('Please enter your name');
            if (props.role === 'admin') setLoadingAdmin(false);
            else setLoadingUser(false);

            return;
        }
        if (props.email === '') {
            toast.error('Please enter your email');
            if (props.role === 'admin') setLoadingAdmin(false);
            else setLoadingUser(false);

            return;
        }
        if (validateEmailFormat(props.email) === false) {
            toast.error('Incorrect format');
            if (props.role === 'admin') setLoadingAdmin(false);
            else setLoadingUser(false);

            return;
        }
        if (props.password === '') {
            toast.error('Please enter your password');
            if (props.role === 'admin') setLoadingAdmin(false);
            else setLoadingUser(false);

            return;
        }
        if (props.againPassword === '') {
            toast.error('Please re-enter your password');
            if (props.role === 'admin') setLoadingAdmin(false);
            else setLoadingUser(false);

            return;
        }
        if (validatePasswordFormat(props.password) === false) {
            toast.error(
                'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number, and be a minimum of 8 characters long.',
            );
            if (props.role === 'admin') setLoadingAdmin(false);
            else setLoadingUser(false);

            return;
        }

        get(child(ref(db), `Account/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const x = snapshot.val();
                const listItem = Object.values(x).map((user) => user);
                const y = listItem.find((item) => item.email === email);
                if (y === null || y === undefined) {
                    if (props.againPassword === props.password) {
                        var hash = bcrypt.hashSync(props.password, salt);
                        const encodeEmail = encodePath(props.email);
                        const ip = {
                            name: props.name,
                            email: props.email,
                            password: hash,
                            Role: props.role,
                        };
                        try {
                            set(ref(db, `Account/` + encodeEmail), ip).then(() => {
                                if (props.role === 'admin') setLoadingAdmin(false);
                                else setLoadingUser(false);
                            }, toast.success('Sign up sucessfully'));
                        } catch (error) {
                            toast.error('Your request is failed');
                        }
                        clear();
                    } else {
                        if (props.role === 'admin') setLoadingAdmin(false);
                        else setLoadingUser(false);
                        toast.error('Two passwords do not match together');
                    }
                } else {
                    if (props.role === 'admin') setLoadingAdmin(false);
                    else setLoadingUser(false);
                    toast.error('Account already exists');
                }
            } else {
                if (props.role === 'admin') setLoadingAdmin(false);
                else setLoadingUser(false);
                toast.error('No data available');
            }
        });
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
                            {t('title.inform register')}
                            <br /> {t('title.or')} <br /> <br />
                            <span>
                                <button className="btn-getback" onClick={() => history.goBack()}>
                                    {t('button.get back')}
                                </button>
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
                                            type="text"
                                            className="input-field"
                                            placeholder={t('title.name')}
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                        <i className="bx bx-user icon"></i>
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder={t('title.email')}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <i className="bx bx-envelope icon"></i>
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field pass_login_1"
                                            placeholder={t('title.password')}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <i className="bx bx-lock-alt icon"></i>
                                        <i className="fa fa-eye eye1 icon"></i>
                                    </div>

                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field con_pass_login"
                                            placeholder={t('title.re-password')}
                                            required
                                            value={againPassword}
                                            onChange={(e) => setAgainPassword(e.target.value)}
                                        />
                                        <i className="bx bx-lock-alt icon"></i>
                                        <i className="fa fa-eye eye2 icon"></i>
                                    </div>

                                    <div className="input-box">
                                        <div className="input-box">
                                            {localStorage.getItem('Role') === 'admin' ? (
                                                <Button
                                                    loading={loadingUser}
                                                    type="submit"
                                                    className="input-submit"
                                                    onClick={() =>
                                                        regist({
                                                            role: 'user',
                                                            name: fullName,
                                                            email: email,
                                                            password: password,
                                                            againPassword: againPassword,
                                                        })
                                                    }
                                                >
                                                    <span>{t('button.regist')}</span>
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button
                                                        loading={loadingUser}
                                                        className="button-clear"
                                                        onClick={() =>
                                                            regist({
                                                                role: 'user',
                                                                name: fullName,
                                                                email: email,
                                                                password: password,
                                                                againPassword: againPassword,
                                                            })
                                                        }
                                                    >
                                                        <span>{t('button.user')}</span>
                                                    </Button>
                                                    <Button
                                                        loading={loadingAdmin}
                                                        className="button-submit"
                                                        onClick={() =>
                                                            regist({
                                                                role: 'admin',
                                                                name: fullName,
                                                                email: email,
                                                                password: password,
                                                                againPassword: againPassword,
                                                            })
                                                        }
                                                    >
                                                        <span>{t('button.admin')}</span>
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <Button className="input-box" loading={user}>
                                        <div type="submit" className="input-submit" onClick={clear}>
                                            <span className="clear">{t('button.clear')}</span>
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
        </>
    );
};
export default Register;
