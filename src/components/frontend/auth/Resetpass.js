import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'firebase/auth';
import { Link } from 'react-router-dom';
import '../../../assets/css/login.css';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../constants/constants';
import { child, get, getDatabase, ref, update } from 'firebase/database';
import { encodePath, validatePasswordFormat } from '../../../commonFunctions';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import bcrypt from 'bcryptjs';
import { Button, Dropdown, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { DownOutlined } from '@ant-design/icons';

export const Forgetpass = () => {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const history = useHistory();
    const [newPass, setNewPass] = useState('');
    const [reNewPass, setReNewPass] = useState('');
    const salt = bcrypt.genSaltSync(10);
    const [loadingResetPass, setLoadingResetPass] = useState(false);
    const { t, i18n } = useTranslation('resetpassword');
    const [link, setLink] = useState(null);
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
    useEffect(() => {
        const fetch = async () => {
            const tempEmail = localStorage.getItem('Email');
            get(child(ref(db), `Account/` + encodePath(tempEmail))).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    if (x.link !== undefined) {
                        if (x.link !== '') {
                            console.log('not undefined');
                            let hrefCurrent = window.location.href;

                            if (hrefCurrent.includes(x.link)) {
                                console.log('set thanh true');
                                setLink((pre) => true);
                            } else {
                                console.log('set thanh false');

                                setLink((pre) => false);
                            }
                            console.log(link);
                        } else {
                        }
                    } else {
                        setLink(false);
                    }
                }
            });
        };

        const timer = setTimeout(fetch, 10);
        return () => clearTimeout(timer);
    }, [db]);
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
    const handleLogout = () => {
        localStorage.setItem('Infor', JSON.stringify(''));
        localStorage.setItem('Name', '');
        localStorage.setItem('Email', JSON.stringify(''));
        localStorage.setItem('Role', '');
        localStorage.removeItem('userToken');
        toast.success('Your password has been reset');
        history.push('/Login');
    };
    const handlePassword = () => {
        setLoadingResetPass(true);
        const email = localStorage.getItem('Email');

        if (email === '""') {
            setLoadingResetPass(false);

            toast.error('Your email was not found');
            return;
        } else {
            if (newPass === '') {
                setLoadingResetPass(false);

                toast.error('Please enter your new password');
                return;
            }
            if (reNewPass === '') {
                setLoadingResetPass(false);

                toast.error('Please re-enter your email');
                return;
            }
            if (validatePasswordFormat(newPass) === false) {
                setLoadingResetPass(false);

                toast.error(
                    'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number, and be a minimum of 8 characters long.',
                );
                return;
            }
            get(child(ref(db), `Account/`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const x = snapshot.val();

                        const listItem = Object.values(x).map((user) => user);
                        const encodeEmail = encodePath(email);
                        const y = listItem.filter((item) => item.email === email);
                        if (y !== undefined) {
                            if (newPass === reNewPass) {
                                try {
                                    var hash = bcrypt.hashSync(newPass, salt);
                                    console.log(hash);
                                    console.log(encodeEmail);
                                    update(ref(db, `Account/` + encodeEmail), {
                                        link: '',
                                        password: hash,
                                    })
                                        .then(() => setLoadingResetPass(false), handleLogout())
                                        .catch(() => {
                                            toast.error("Can't update");
                                        });
                                } catch (error) {
                                    setLoadingResetPass(false);

                                    toast.error(error.message);
                                }
                            } else {
                                setLoadingResetPass(false);

                                toast.error('The two passwords do not match together');
                            }
                            setLoadingResetPass(false);
                        } else {
                            setLoadingResetPass(false);

                            toast.error('Your account was not found');
                        }
                    } else {
                        setLoadingResetPass(false);
                        toast.error('No data available');
                    }
                })
                .catch(() => {
                    setLoadingResetPass(false);
                    toast.error('Your request was invalid');
                });
        }
    };
    const handleLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            handlePassword();
        }
    };
    return (
        <>
            {link === true ? (
                <div className="background">
                    {console.log('true')}

                    {console.log(window.location.href)}
                    <div className="form-container">
                        <div className="col col-1">
                            <div className="image_layer">
                                <img src="assets/login/img/FPTnew.png" className="form_img_main" alt="" />
                            </div>

                            <p className="featured">
                                {t('title.inform forget')}
                                <br />
                                {t('title.or')} <br />
                            </p>
                            <Link to="/login">
                                <Button className="btn-getback">
                                    <span>{t('button.get back')}</span>
                                </Button>
                            </Link>
                        </div>

                        <div className="col col-2">
                            <form action="">
                                {/* Trang đăng nhập */}
                                <div className="login-form">
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <div className="form-title">
                                        <span>{t('header')}</span>
                                    </div>
                                    <div className="form-inputs">
                                        <div className="input-box">
                                            <input
                                                type="password"
                                                className="input-field pass_login_1"
                                                placeholder={t('title.newPassword')}
                                                required
                                                value={newPass}
                                                onChange={(e) => setNewPass(e.target.value)}
                                                onKeyDown={handleEnterKey}
                                            />
                                            <i className="bx bx-lock-alt icon"></i>
                                            <i className="fa fa-eye eye1 icon"></i>
                                        </div>

                                        <div className="input-box">
                                            <input
                                                type="password"
                                                className="input-field con_pass_login"
                                                placeholder={t('title.reNewPassword')}
                                                required
                                                value={reNewPass}
                                                onChange={(e) => setReNewPass(e.target.value)}
                                                onKeyDown={handleEnterKey}
                                            />
                                            <i className="bx bx-lock-alt icon"></i>
                                            <i className="fa fa-eye eye2 icon"></i>
                                        </div>

                                        <Button
                                            className=" input-submit"
                                            onClick={() => handlePassword()}
                                            loading={loadingResetPass}
                                        >
                                            <span>{t('button.continue')}</span>
                                            <i className="bx bx-right-arrow-alt"></i>
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
            ) : (
                <div className="background">
                    {console.log('false')}

                    {console.log(window.location.href)}
                    <div className="form-container">
                        <div className="col col-1">
                            <div className="image_layer">
                                <img src="assets/login/img/FPTnew.png" className="form_img_main" alt="" />
                            </div>

                            <p className="featured">
                                {t('title.inform forget')}
                                <br />
                                {t('title.or')} <br />
                            </p>
                            <Link to="/login">
                                <Button className="btn-getback">
                                    <span>{t('button.get back')}</span>
                                </Button>
                            </Link>
                        </div>

                        <div className="col col-2">
                            <form action="">
                                {/* Trang đăng nhập */}
                                <div className="login-form">
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <div className="form-title">
                                        <span>{t('invalid')}</span>
                                    </div>
                                    <div className="form-inputs">
                                        <div className="input-box">
                                            <input
                                                type="password"
                                                className="input-field pass_login_1"
                                                placeholder={t('title.newPassword')}
                                                required
                                                value={newPass}
                                                onChange={(e) => setNewPass(e.target.value)}
                                                onKeyDown={handleEnterKey}
                                                disabled
                                            />
                                            <i className="bx bx-lock-alt icon"></i>
                                            <i className="fa fa-eye eye1 icon"></i>
                                        </div>

                                        <div className="input-box">
                                            <input
                                                type="password"
                                                className="input-field con_pass_login"
                                                placeholder={t('title.reNewPassword')}
                                                required
                                                value={reNewPass}
                                                onChange={(e) => setReNewPass(e.target.value)}
                                                onKeyDown={handleEnterKey}
                                                disabled
                                            />
                                            <i className="bx bx-lock-alt icon"></i>
                                            <i className="fa fa-eye eye2 icon"></i>
                                        </div>

                                        <Button
                                            className=" input-submit"
                                            onClick={() => handlePassword()}
                                            loading={loadingResetPass}
                                        >
                                            <span>{t('button.continue')}</span>
                                            <i className="bx bx-right-arrow-alt"></i>
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
            )}
        </>
    );
};

export default Forgetpass;
