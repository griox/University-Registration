import React, { useEffect, useState } from 'react';
import 'firebase/auth';
import { child, get, getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import '../../../assets/css/register.css';
import { firebaseConfig } from '../../../constants/constants';
import {
    HandleError,
    disableButton,
    encodePath,
    validateEmailFormat,
    validatePasswordFormat,
} from '../../../commonFunctions';
import { DownOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Dropdown, Form, Input, Radio, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { locales } from '../../../translation/i18n';
import CryptoJS from 'crypto-js';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [againPassword, setAgainPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [errorAgainPassword, setErrorAgainPassword] = useState(false);
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const history = useHistory();
    const { t, i18n } = useTranslation('register');
    const storedLanguage = localStorage.getItem('language') || 'en';
    const currentLanguage = locales[storedLanguage === 'vi' ? 'vi' : 'en'];
    const [selectedLanguage, setSelectedLanguage] = useState(storedLanguage === 'vi' ? 'Tiếng Việt' : 'English');
    const [loadingRegist, setLoadingRegist] = useState(false);
    const secretKey = 'Tvx1234@';

    const [value1, setValue1] = useState('User');

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

    const regist = (props) => {
        setLoadingRegist(true);
        if (props.name === '') {
            toast.error('Please enter your name');
            setLoadingRegist(false);

            return;
        }
        if (props.email === '') {
            toast.error('Please enter your email');
            setLoadingRegist(false);

            return;
        }
        if (validateEmailFormat(props.email) === false) {
            toast.error('Incorrect format');
            setLoadingRegist(false);

            return;
        }
        if (props.password === '') {
            toast.error('Please enter your password');
            setLoadingRegist(false);

            return;
        }
        if (props.againPassword === '') {
            toast.error('Please re-enter your password');
            setLoadingRegist(false);

            return;
        }
        if (validatePasswordFormat(props.password) === false) {
            toast.error(
                'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number, and be a minimum of 8 characters long.',
            );
            setLoadingRegist(false);

            return;
        }

        get(child(ref(db), `Account/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const x = snapshot.val();
                const listItem = Object.values(x).map((user) => user);
                const y = listItem.find((item) => item.email === email);
                if (y === null || y === undefined) {
                    if (props.againPassword === props.password) {
                        var hash = CryptoJS.AES.encrypt(props.password, secretKey).toString();
                        const encodeEmail = encodePath(props.email);
                        const ip = {
                            name: props.name,
                            email: props.email,
                            password: hash,
                            Role: props.role,
                        };
                        try {
                            set(ref(db, `Account/` + encodeEmail), ip).then(() => {
                                setLoadingRegist(false);
                            }, toast.success('Sign up sucessfully'));
                        } catch (error) {
                            toast.error('Your request is failed');
                        }
                    } else {
                        setLoadingRegist(false);

                        toast.error('Two passwords do not match together');
                    }
                } else {
                    setLoadingRegist(false);

                    toast.error('Account already exists');
                }
            } else {
                setLoadingRegist(false);

                toast.error('No data available');
            }
        });
    };

    const handleEnterKey = (e) => {
        if (e.key === 'Enter') {
            regist({
                role: 'user',
                name: fullName,
                email: email,
                password: password,
                againPassword: againPassword,
            });
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
    const onchangePassword = (e) => {
        if (e === '') {
            setPassword(e);
            setErrorPassword(false);
        } else if (validatePasswordFormat(e) === false) {
            setPassword(e);
            setErrorPassword(true);
        } else {
            setPassword(e);
            setErrorPassword(false);
        }
    };
    const onchangeAgainPassword = (e) => {
        if (e === '') {
            setAgainPassword(e);
            setErrorAgainPassword(false);
        } else if (validatePasswordFormat(e) === false) {
            setAgainPassword(e);
            setErrorAgainPassword(true);
        } else {
            setAgainPassword(e);
            setErrorAgainPassword(false);
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
                            {t('title.inform register')}
                            <br /> {t('title.or')}
                        </p>

                        <Button className="btn-getback" onClick={() => history.goBack()}>
                            <span>{t('button.get back')}</span>
                        </Button>
                    </div>

                    <div className="col col-2">
                        <form action="">
                            <div className="login-form">
                                <div className="form-title">
                                    <span>{t('header')}</span>
                                </div>
                                <div className="form-inputs">
                                    <Form.Item
                                        name="email"
                                        validateStatus={
                                            fullName === '' ||
                                            fullName.trim().replace(/\s{2,}/g, ' ') === '' ||
                                            /^[A-Za-zđĐÁÀẢÃẠÂẮẰẲẴẶẤẦẨẪẬÉÈẺẼẸẾỀỂÊỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤỨƯỪỬỮỰÝỲỶỸỴáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọốôồổỗộớờởơỡợúùủũụứưừửữựýỳỷỹỵ\s]+$/.test(
                                                fullName,
                                            ) === false
                                                ? 'error'
                                                : ''
                                        }
                                        help={
                                            fullName === '' || fullName.trim().replace(/\s{2,}/g, ' ') === '' ? (
                                                <span style={{ color: 'red' }}>Please input</span>
                                            ) : /^[A-Za-zđĐÁÀẢÃẠÂẮẰẲẴẶẤẦẨẪẬÉÈẺẼẸẾỀỂÊỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤỨƯỪỬỮỰÝỲỶỸỴáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọốôồổỗộớờởơỡợúùủũụứưừửữựýỳỷỹỵ\s]+$/.test(
                                                  fullName,
                                              ) === false ? (
                                                <span style={{ color: 'red' }}>Only cotain A-Z a-z and space</span>
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
                                        <Input
                                            placeholder={t('placeholder.fullname')}
                                            onChange={(e) => setFullName(e.target.value)}
                                            onKeyDown={handleEnterKey}
                                            allowClear
                                            style={{
                                                border: 'none',
                                                padding: '10px',
                                            }}
                                            value={fullName}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="email"
                                        validateStatus={
                                            errorEmail || email === '' || email.trim().replace(/\s{2,}/g, ' ') === ''
                                                ? 'error'
                                                : ''
                                        }
                                        help={
                                            errorEmail ? (
                                                <HandleError string="Email format is not correct" />
                                            ) : email === '' || email.trim().replace(/\s{2,}/g, ' ') === '' ? (
                                                <span style={{ color: 'red' }}>Please input</span>
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
                                        <Input
                                            placeholder={t('placeholder.email')}
                                            onChange={(e) => onchangeEmail(e.target.value)}
                                            onKeyDown={handleEnterKey}
                                            allowClear
                                            style={{
                                                border: 'none',
                                                padding: '10px',
                                            }}
                                            value={email}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="email"
                                        validateStatus={
                                            errorPassword ||
                                            password === '' ||
                                            password.trim().replace(/\s{2,}/g, ' ') === ''
                                                ? 'error'
                                                : ''
                                        }
                                        help={
                                            errorPassword ? (
                                                <HandleError string="'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number, and be a minimum of 8 characters long.'" />
                                            ) : password === '' || password.trim().replace(/\s{2,}/g, ' ') === '' ? (
                                                <span style={{ color: 'red' }}>Please input</span>
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
                                            placeholder={t('placeholder.password')}
                                            onChange={(e) => onchangePassword(e.target.value)}
                                            onKeyDown={handleEnterKey}
                                            allowClear
                                            style={{
                                                border: 'none',
                                                padding: '10px',

                                                backgroundColor: 'blue',
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
                                    </Form.Item>
                                    <Form.Item
                                        name="email"
                                        validateStatus={
                                            errorAgainPassword ||
                                            againPassword === '' ||
                                            againPassword.trim().replace(/\s{2,}/g, ' ') === ''
                                                ? 'error'
                                                : ''
                                        }
                                        help={
                                            errorAgainPassword ? (
                                                <HandleError string="'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, 1 number, and be a minimum of 8 characters long.'" />
                                            ) : againPassword === '' ||
                                              againPassword.trim().replace(/\s{2,}/g, ' ') === '' ? (
                                                <span style={{ color: 'red' }}>Please input</span>
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
                                            placeholder={t('placeholder.repass')}
                                            onChange={(e) => onchangeAgainPassword(e.target.value)}
                                            onKeyDown={handleEnterKey}
                                            allowClear
                                            style={{
                                                border: 'none',
                                                padding: '10px',

                                                backgroundColor: 'blue',
                                            }}
                                            value={againPassword}
                                            iconRender={(visible) =>
                                                visible ? (
                                                    <EyeTwoTone style={{ fontSize: '20px' }} />
                                                ) : (
                                                    <EyeInvisibleOutlined style={{ fontSize: '20px' }} />
                                                )
                                            }
                                        />
                                    </Form.Item>
                                    <div
                                        className="register-checkbox"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            columnGap: '20px',
                                        }}
                                    >
                                        <h1 style={{ fontSize: '14px', marginTop: '5px', color: '#fff' }}>
                                            {t('title.role')}
                                        </h1>
                                        <Radio.Group
                                            name="radiogroup"
                                            defaultValue={value1}
                                            onChange={(e) => setValue1(e.target.value)}
                                        >
                                            <Radio value={'Admin'} style={{ color: '#fff', fontSize: '14px' }}>
                                                {t('title.admin')}
                                            </Radio>
                                            <Radio value={'User'} style={{ color: '#fff', fontSize: '14px' }}>
                                                {t('title.user')}
                                            </Radio>
                                        </Radio.Group>
                                    </div>
                                    <div className="input-box">
                                        {localStorage.getItem('Role') === 'admin' ? (
                                            <Button
                                                loading={loadingRegist}
                                                className="input-submit"
                                                onClick={() =>
                                                    regist({
                                                        role: 'user',
                                                        name: fullName,
                                                        email: email,
                                                        password: password,
                                                        againPassword: againPassword,
                                                        setFullName: setFullName,
                                                    })
                                                }
                                                onKeyDown={handleEnterKey}
                                            >
                                                <span>{t('button.regist')}</span>
                                            </Button>
                                        ) : (
                                            <>
                                                <Button
                                                    loading={loadingRegist}
                                                    className=" input-submit"
                                                    onClick={() =>
                                                        regist({
                                                            role: value1,
                                                            name: fullName,
                                                            email: email,
                                                            password: password,
                                                            againPassword: againPassword,
                                                        })
                                                    }
                                                    onKeyDown={handleEnterKey}
                                                    disabled={
                                                        fullName !== '' &&
                                                        disableButton(errorEmail, email) === false &&
                                                        disableButton(errorPassword, password) === false &&
                                                        disableButton(errorAgainPassword, againPassword) === false
                                                            ? false
                                                            : true
                                                    }
                                                    style={{
                                                        color: '#fff',
                                                        backgroundColor:
                                                            fullName !== '' &&
                                                            errorEmail === false &&
                                                            email !== '' &&
                                                            errorPassword === false &&
                                                            password !== '' &&
                                                            errorAgainPassword === false &&
                                                            againPassword !== ''
                                                                ? ''
                                                                : 'rgba(255, 255, 255, 0.3)',
                                                    }}
                                                >
                                                    <span>{t('button.regist')}</span>
                                                </Button>
                                            </>
                                        )}
                                    </div>

                                    <div>
                                        <Dropdown
                                            className="drop-menu1"
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
export default Register;
