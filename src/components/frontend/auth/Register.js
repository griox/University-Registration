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
import { DownOutlined, ExclamationCircleOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Dropdown, Form, Input, Radio, Space, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import bcrypt from 'bcryptjs';
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
    const salt = bcrypt.genSaltSync(10);
    const [loadingRegist, setLoadingRegist] = useState(false);
    const secretKey = 'Tvx1234@';

    const [value1, setValue1] = useState('User');

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
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input!',
                                            },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Full name"
                                            onChange={(e) => setFullName(e.target.value)}
                                            onKeyDown={handleEnterKey}
                                            allowClear
                                            style={{
                                                border: 'none',
                                                padding: '10px',
                                                color: '#000',
                                                backgroundColor: 'blue',
                                            }}
                                            value={fullName}
                                        />
                                    </Form.Item>
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
                                            placeholder="Email"
                                            onChange={(e) => onchangeEmail(e.target.value)}
                                            onKeyDown={handleEnterKey}
                                            allowClear
                                            style={{
                                                border: 'none',
                                                padding: '10px',
                                                color: '#000',
                                                backgroundColor: 'blue',
                                            }}
                                            value={email}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="email"
                                        validateStatus={errorPassword ? 'error' : ''}
                                        help={errorPassword ? <HandleError string="password" /> : ''}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input!',
                                            },
                                        ]}
                                    >
                                        <Input.Password
                                            placeholder="Password"
                                            onChange={(e) => onchangePassword(e.target.value)}
                                            onKeyDown={handleEnterKey}
                                            allowClear
                                            style={{
                                                border: 'none',
                                                padding: '10px',
                                                color: '#000',
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
                                        validateStatus={errorAgainPassword ? 'error' : ''}
                                        help={errorAgainPassword ? <HandleError string="password" /> : ''}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input!',
                                            },
                                        ]}
                                    >
                                        <Input.Password
                                            placeholder="Re-enter password"
                                            onChange={(e) => onchangeAgainPassword(e.target.value)}
                                            onKeyDown={handleEnterKey}
                                            allowClear
                                            style={{
                                                border: 'none',
                                                padding: '10px',
                                                color: '#000',
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
                                        <h1 style={{ fontSize: '15px', marginTop: '5px', color: '#fff' }}>
                                            Regist for
                                        </h1>
                                        <Radio.Group
                                            name="radiogroup"
                                            defaultValue={value1}
                                            onChange={(e) => setValue1(e.target.value)}
                                        >
                                            <Radio value={'Admin'} style={{ color: '#fff' }}>
                                                Admin
                                            </Radio>
                                            <Radio value={'User'} style={{ color: '#fff' }}>
                                                User
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
                                                                ? '#003865'
                                                                : 'rgba(255, 255, 255, 0.3)',
                                                    }}
                                                >
                                                    <span>Regist</span>
                                                </Button>
                                            </>
                                        )}
                                    </div>

                                    <Button className=" input-submit">
                                        <span className="clear">{t('button.clear')}</span>
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
        </>
    );
};
export default Register;
