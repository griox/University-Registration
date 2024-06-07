import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'firebase/auth';
import { Link } from 'react-router-dom';
import '../../../assets/css/login.css';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../constants/constants';
import { DownOutlined, ExclamationCircleOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Dropdown, Form, Input, Space, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { locales } from '../../../translation/i18n';
import { toast } from 'react-toastify';
import {
    HandleError,
    disableButton,
    encodePath,
    validateEmailFormat,
    validatePasswordFormat,
} from '../../../commonFunctions';
import { child, get, getDatabase, ref, update } from 'firebase/database';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export const Forgetpass = () => {
    const { t, i18n } = useTranslation('fogetpassword');
    const currentLanguage = locales[i18n.language === 'vi' ? 'vi' : 'en'];
    const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage === 'Tiếng anh' ? 'Tiếng anh' : 'English');
    const app = initializeApp(firebaseConfig);
    const database = getAuth(app);
    const db = getDatabase(app);
    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [loadingResetPass, setLoadingResetPass] = useState(false);
    const theme = useState(localStorage.getItem('selectedTheme') || 'light');

    const makeid = (length) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    };
    const handleEmail = (e) => {
        e.preventDefault();

        setLoadingResetPass(true);
        if (email === '') {
            toast.error('Please enter your email');
            setLoadingResetPass(false);
            setEmail('');
        } else if (validateEmailFormat(email) === false) {
            toast.error('Your email is not formal');
            setLoadingResetPass(false);
            setEmail('');
        } else {
            const tempEmail = encodePath(email);
            get(child(ref(db), `Account/` + tempEmail))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        localStorage.setItem('Email', email);
                        let result = makeid(10);
                        let url = `https://mock-proeject-b.web.app/resetpasstoken=${result}`;
                        const link = { url: url };
                        sendPasswordResetEmail(database, 'quang.nm.64cntt@ntu.edu.vn', link)
                            .then(() => {
                                update(ref(db, 'Account/' + tempEmail), {
                                    link: result,
                                });
                                toast.success('The link will be sent to your email, please check your email');
                                setLoadingResetPass(false);
                                setEmail('');
                            })
                            .catch((error) => {
                                const errorCode = error.code;
                                const errorMessage = error.message;
                                setLoadingResetPass(false);
                                toast.error(`Error ${errorCode}: ${errorMessage}`);
                                setEmail('');
                            });
                    } else {
                        setLoadingResetPass(false);
                        toast.error('Your account is not found');
                        setEmail('');
                    }
                })
                .catch((error) => {
                    setLoadingResetPass(false);
                    toast.error(error.message);
                    setEmail('');
                });
        }
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
    const handleEnterKey = async (e) => {
        if (e.key === 'Enter') {
            handleEmail(e);
        }
    };

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
                            {t('title.inform forget')} <br /> {t('title.or')}
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
                                        <Input
                                            placeholder="Enter Student's email"
                                            onChange={(e) => onchangeEmail(e.target.value)}
                                            onKeyDown={handleEnterKey}
                                            allowClear
                                            style={{
                                                border: 'none',
                                                padding: '15px',
                                            }}
                                            value={email}
                                        />
                                    </Form.Item>

                                    <div className="input-box">
                                        <Button
                                            loading={loadingResetPass}
                                            className="input-submit"
                                            onClick={(e) => handleEmail(e)}
                                            disabled={disableButton(errorEmail, email) === false ? false : true}
                                            style={{
                                                color: '#fff',
                                                backgroundColor:
                                                    errorEmail === false && email !== ''
                                                        ? ''
                                                        : 'rgba(255, 255, 255, 0.3)',
                                            }}
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

export default Forgetpass;
