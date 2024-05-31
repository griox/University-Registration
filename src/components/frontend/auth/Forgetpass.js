import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'firebase/auth';
import { Link } from 'react-router-dom';
import '../../../assets/css/login.css';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../constants/constants';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { validateEmailFormat } from '../../../commonFunctions';

export const Forgetpass = () => {
    const { t, i18n } = useTranslation('fogetpassword');
    const app = initializeApp(firebaseConfig);
    const db = getAuth(app);
    const [email, setEmail] = useState('');
    const [loadingResetPass, setLoadingResetPass] = useState(false);
    const handleEmail = () => {
        setLoadingResetPass(true);
        if (email === '') {
            toast.error('Please enter your email');
            setLoadingResetPass(false);

            return;
        }
        if (validateEmailFormat(email) === false) {
            toast.error('Your email is not correct with format');
            setLoadingResetPass(false);

            return;
        }
        localStorage.setItem('Email', email);
        sendPasswordResetEmail(db, 'quang.nm.64cntt@ntu.edu.vn')
            .then(() => {
                setLoadingResetPass(false);
                toast.success('The link will be sent to your email, please check your email');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setLoadingResetPass(false);
                toast.error(`Error ${errorCode}: ${errorMessage}`);
            });
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
    return (
        <>
            <div className="background">
                <div className="form-container">
                    <div className="col col-1">
                        <div className="image_layer">
                            <img src="assets/login/img/FPTnew.png" className="form_img_main" alt="" />
                        </div>

                        <p className="featured">
                            {t('title.inform forget')} <br /> {t('title.or')} <br /> <br />
                            <span>
                                <Link className="btn-getback" to="/login">
                                    {t('button.get back')}
                                </Link>
                            </span>
                        </p>
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
                                            type="email"
                                            className="input-field"
                                            placeholder="Email"
                                            required
                                            onChange={(e) => setEmail(e.target.value)}
                                            value={email === '' ? '' : email}
                                        />
                                        <i className="bx bx-envelope icon"></i>
                                    </div>

                                    <div className="input-box">
                                        <Button
                                            loading={loadingResetPass}
                                            className="input-submit"
                                            onClick={() => handleEmail()}
                                        >
                                            <span>{t('button.continue')}</span>
                                            <i className="bx bx-right-arrow-alt"></i>
                                        </Button>
                                    </div>

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

export default Forgetpass;
