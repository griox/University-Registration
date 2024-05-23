import React, { useEffect, useState } from 'react';
import 'firebase/auth';
import { child, get, getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';
import { message } from 'antd';
import { useHistory } from 'react-router-dom';
import '../../../assets/css/register.css';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [againPassword, setAgainPassword] = useState('');
    const firebaseConfig = {
        apiKey: 'AIzaSyD2_evQ7Wje0Nza4txsg5BE_dDSNgmqF3o',
        authDomain: 'mock-proeject-b.firebaseapp.com',
        databaseURL: 'https://mock-proeject-b-default-rtdb.firebaseio.com',
        projectId: 'mock-proeject-b',
        storageBucket: 'mock-proeject-b.appspot.com',
        messagingSenderId: '898832925665',
        appId: '1:898832925665:web:bb28598e7c70a0d73188a0',
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    function validateEmailFormat(val) {
        return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(val) || /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/.test(val);
    }
    function validatePasswordFormat(password) {
        if (password.length >= 8) {
            return true;
        } else {
            return false;
        }
    }

    const encodePath = (email) => {
        if (email) return email.replace(/\./g, ',');
        else return 0;
    };

    const history = useHistory();
    const [author, setAuthor] = useState(localStorage.getItem('Role') || '');

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
    function regist(props) {
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
    }
    const [loadings, setLoadings] = useState([]);
    const enterLoading = (index) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
        setTimeout(() => {
            setLoadings((prevLoadings) => {
                regist({
                    name: fullName,
                    email: email,
                    password: password,
                    againPassword: againPassword,
                });
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
        }, 2000);
    };
    const span = { fontSize: '17px' };
    const [isHovered, setIsHovered] = useState(false);
    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isHovered ? '15px' : '10px',
        width: '100%',
        height: '55px',
        padding: '0 15px',
        margin: '5px 0 0 0',
        color: '#fff',
        background: '#003865',
        border: 'none',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        transition: '0.3s',
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
                            {/* Trang đăng nhập */}
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
                                            // required
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
                                        {/* <div
                                            type="submit"
                                            className="input-submit"
                                            onClick={() =>
                                                regist({
                                                    name: fullName,
                                                    email: email,
                                                    password: password,
                                                    againPassword: againPassword,
                                                })
                                            }
                                        >
                                            <span>Regist</span>
                                        </div> */}
                                        <div className="input-box">
                                            {author === 'admin' ? (
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

                                        {/* <Button
                                            type="primary"
                                            loading={loadings[0]}
                                            onClick={() => enterLoading(0)}
                                            className="input-submit"
                                            style={buttonStyle}
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                        >
                                            <span style={span}>Regist</span>
                                            <i className="bx bx-right-arrow-alt"></i>
                                        </Button> */}
                                        {/* <Button
                                            type="primary"
                                            loading={loadings[1]}
                                            onClick={() => enterLoading(1)}
                                            className="input-submit"
                                            style={buttonStyle}
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                        >
                                            <span>Regist</span>
                                            <i className="bx bx-right-arrow-alt"></i>
                                        </Button> */}
                                    </div>
                                    <div className="input-box">
                                        <div type="submit" className="input-submit" onClick={clear}>
                                            <span style={span}>Clear</span>
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
