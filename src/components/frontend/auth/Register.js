import React, { useEffect, useState } from 'react';
import 'firebase/auth';
import { child, get, getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { message } from 'antd';
import { useHistory } from 'react-router-dom';
import '../../../assets/css/register.css';
import { firebaseConfig } from '../../../constants/constants';
import { encodePath, validateEmailFormat, validatePasswordFormat } from '../../../commonFunctions';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [againPassword, setAgainPassword] = useState('');
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const history = useHistory();

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

    const clear = () => {
        setFullName('');
        setEmail('');
        setPassword('');
        setAgainPassword('');
    };
    const regist = (props) => {
        if (props.name === '') {
            toast.error('Please enter your name');
            return;
        }
        if (props.email === '') {
            toast.error('Please enter your email');
            return;
        }
        if (validateEmailFormat(props.email) === false) {
            toast.error('Incorrect format');
        }
        if (props.password === '') {
            toast.error('Please enter your password');
        }
        if (validatePasswordFormat(props.password) === false) {
            toast.error('Password must have at least 8 characters');
        }

        get(child(ref(db), `Account/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const x = snapshot.val();
                const listItem = Object.values(x).map((user) => user);
                const y = listItem.find((item) => item.email === email);
                console.log(listItem, y);
                if (y === null || y === undefined) {
                    if (props.againPassword === props.password) {
                        const encodeEmail = encodePath(props.email);
                        const ip = {
                            name: props.name,
                            email: props.email,
                            password: props.password,
                            Role: props.role,
                        };
                        try {
                            set(ref(db, `Account/` + encodeEmail), ip).then(() => toast.success('Sign up sucessfully'));
                        } catch (error) {
                            console.log(error, message);
                        }
                        clear();
                    }
                } else {
                    toast.error('Account already exists');
                }
            } else {
                console.log('No data available');
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
                            Please REGISTER to continue <br /> or <br /> <br />
                            <span>
                                <button className="btn-getback" onClick={() => history.goBack()}>
                                    Get back
                                </button>
                            </span>
                        </p>
                    </div>

                    <div className="col col-2">
                        <form action="">
                            <div className="login-form">
                                <div className="form-title">
                                    <span>Register</span>
                                </div>
                                <div className="form-inputs">
                                    <div className="input-box">
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="First and Last name"
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
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <i className="bx bx-envelope icon"></i>
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field pass_login_1"
                                            placeholder="Password"
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
                                            placeholder="Re-Password"
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
                                                <div
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
                                                    <span>Regist</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div
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
                                                        <span>User</span>
                                                    </div>
                                                    <div
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
                                                        <span>Admin</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="input-box">
                                        <div type="submit" className="input-submit" onClick={clear}>
                                            <span className="clear">Clear</span>
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
export default Register;
