import React, { useEffect, useState } from 'react';
import 'firebase/auth';
import { child, get, getDatabase, ref, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import '../../../assets/css/register.css';
import { useDispatch } from 'react-redux';
import { firebaseConfig } from '../../../constants/constants';
import { encodePath } from '../../../commonFunctions';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import bcrypt from 'bcryptjs';
const Changepass = () => {
    const { t, i18n } = useTranslation('changePassword');
    const history = useHistory();
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [reNewPass, setReNewPass] = useState('');
    const dispatch = useDispatch();
    const salt = bcrypt.genSaltSync(10);
    useEffect(() => {
        const passwordInput1 = document.querySelector('.old_pass');
        const eyeBtn1 = document.querySelector('.eye1');
        const passwordInput2 = document.querySelector('.new_pass');
        const eyeBtn2 = document.querySelector('.eye2');
        const passwordInput3 = document.querySelector('.con_pass');
        const eyeBtn3 = document.querySelector('.eye3');

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

        const handlePasswordInput3 = () => {
            if (passwordInput3.value.trim() !== '') {
                eyeBtn3.style.display = 'block';
            } else {
                eyeBtn3.style.display = 'none';
                passwordInput3.setAttribute('type', 'password');
                eyeBtn3.classList.remove('fa-eye-slash');
                eyeBtn3.classList.add('fa-eye');
            }
        };

        const handleEyeBtn3 = () => {
            if (passwordInput3.type === 'password') {
                passwordInput3.setAttribute('type', 'text');
                eyeBtn3.classList.remove('fa-eye');
                eyeBtn3.classList.add('fa-eye-slash');
            } else {
                passwordInput3.setAttribute('type', 'password');
                eyeBtn3.classList.add('fa-eye');
                eyeBtn3.classList.remove('fa-eye-slash');
            }
        };

        passwordInput1.addEventListener('focus', handlePasswordInput1);
        passwordInput1.addEventListener('keyup', handlePasswordInput1);
        eyeBtn1.addEventListener('click', handleEyeBtn1);
        passwordInput2.addEventListener('focus', handlePasswordInput2);
        passwordInput2.addEventListener('keyup', handlePasswordInput2);
        eyeBtn2.addEventListener('click', handleEyeBtn2);
        passwordInput3.addEventListener('focus', handlePasswordInput3);
        passwordInput3.addEventListener('keyup', handlePasswordInput3);
        eyeBtn3.addEventListener('click', handleEyeBtn3);

        return () => {
            passwordInput1.removeEventListener('focus', handlePasswordInput1);
            passwordInput1.removeEventListener('keyup', handlePasswordInput1);
            eyeBtn1.removeEventListener('click', handleEyeBtn1);
            passwordInput2.removeEventListener('focus', handlePasswordInput2);
            passwordInput2.removeEventListener('keyup', handlePasswordInput2);
            eyeBtn2.removeEventListener('click', handleEyeBtn2);
            passwordInput3.removeEventListener('focus', handlePasswordInput3);
            passwordInput3.removeEventListener('keyup', handlePasswordInput3);
            eyeBtn3.removeEventListener('click', handleEyeBtn3);
        };
    }, []);

    const clear = () => {
        setOldPass('');
        setNewPass('');
        setReNewPass('');
    };

    const handleLogout = () => {
        localStorage.setItem('Infor', JSON.stringify(''));
        localStorage.setItem('Name', '');
        localStorage.setItem('Email', JSON.stringify(''));
        localStorage.setItem('Role', '');
        localStorage.removeItem('userToken');

        dispatch({ type: 'logout' });
        history.push('/Login');
    };
    const handleLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };
    const changePassWord = () => {
        let temp = JSON.parse(localStorage.getItem('Email'));
        if (oldPass === '') {
            toast.error('Please enter your old password');
            return;
        }
        if (newPass === '') {
            toast.error('Please enter your new password');
            return;
        }
        if (reNewPass === '') {
            toast.error('Please confirm your password again');
            return;
        }
        if (newPass !== reNewPass) {
            toast.error('You confirm your password is incorrect');
            return;
        }
        temp = encodePath(temp);
        get(child(ref(db), `Account/` + temp)).then((snapshot) => {
            if (snapshot.exists()) {
                const x = snapshot.val();
                var hash = bcrypt.hashSync(oldPass, salt);
                if (bcrypt.compareSync(x.password, hash) === true) {
                    var newHash = bcrypt.hashSync(newPass, salt);
                    update(ref(db, 'Account/' + temp), {
                        password: newHash,
                    })
                        .then(() => {
                            handleLogout();
                            toast.success('Updated sucessfully');
                        })
                        .catch((error) => {
                            alert('lỗi' + error);
                        });
                }
            } else {
                toast.error('Data is not available');
            }
        });
    };
    return (
        <>
            <div className="background">
                <Box className="language">
                    <button onClick={() => handleLanguage('vi')}>Tiếng việt</button>
                    <button onClick={() => handleLanguage('en')}>Tiếng Anh</button>
                </Box>
                <div className="form-container">
                    <div className="col col-1">
                        <div className="image_layer">
                            <img src="assets/login/img/FPTnew.png" className="form_img_main" alt="" />
                        </div>

                        <p className="featured">
                            {t('title.inform changepassword')} <br /> {t('title.or')} <br /> <br />
                            <span>
                                <button onClick={() => history.goBack()} className="btn-getback">
                                    {t('button.get back')}
                                </button>
                            </span>
                        </p>
                    </div>

                    <div className="col col-2">
                        <form action="">
                            <div className="login-form">
                                <br />
                                <br />
                                <div className="form-title">
                                    <span>{t('header')}</span>
                                </div>
                                <div className="form-inputs">
                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field old_pass"
                                            placeholder={t('title.old password')}
                                            required
                                            value={oldPass}
                                            onChange={(e) => setOldPass(e.target.value)}
                                        />
                                        <i className="bx bx-lock-alt icon"></i>
                                        <i className="fa fa-eye eye1 icon"></i>
                                    </div>

                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field new_pass"
                                            placeholder={t('title.new password')}
                                            required
                                            value={newPass}
                                            onChange={(e) => setNewPass(e.target.value)}
                                        />
                                        <i className="bx bx-lock-alt icon"></i>
                                        <i className="fa fa-eye eye2 icon"></i>
                                    </div>

                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field con_pass"
                                            placeholder={t('title.re-new password')}
                                            required
                                            value={reNewPass}
                                            onChange={(e) => setReNewPass(e.target.value)}
                                        />
                                        <i className="bx bx-lock-alt icon"></i>
                                        <i className="fa fa-eye eye3 icon"></i>
                                    </div>
                                    <div className="input-box">
                                        <br />
                                        <Button type="submit" className="input-submit" onClick={changePassWord}>
                                            <span>{t('button.change')}</span>
                                            <i className="bx bx-right-arrow-alt"></i>
                                        </Button>
                                    </div>
                                    <div className="input-box">
                                        <div type="submit" className="input-submit" onClick={clear}>
                                            <span>{t('button.clear')}</span>
                                            <i className="bx bx-right-arrow-alt"></i>
                                        </div>
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
