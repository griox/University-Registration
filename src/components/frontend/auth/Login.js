import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
// import 'boxicons/css/boxicons.min.css';
import 'firebase/auth';
import { ref, child, getDatabase, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { Link, Redirect } from 'react-router-dom';
import '../../../assets/css/login.css';
import { useDispatch } from 'react-redux';
// import '../../../assets/js/login';
export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const dispatch = useDispatch();

    function validateEmailFormat(val) {
        return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(val) || /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/.test(val);
    }

    const decodePath = (email) => {
        if (email) return email.replace(/%2E/g, '.');
        else return 0;
    };

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
    const [role, setRole] = useState('');
    function saveOnLocal(role) {
        if (role === 'super_admin') {
            get(child(ref(db), 'Admin/')).then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    for (let item in x) {
                        if (x[item].email === email) {
                            localStorage.setItem('Infor', JSON.stringify(x[item]));
                            localStorage.setItem('Email', JSON.stringify(email));
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
                            localStorage.setItem('Email', JSON.stringify(email));
                        }
                    }
                }
            });
        }
    }

    function getdt(email, password) {
        if (email !== '') {
            if (validateEmailFormat(email) !== true) {
                toast.error('Incorrect format');
            } else {
                if (password !== '') {
                    get(child(ref(db), `Account/`))
                        .then((snapshot) => {
                            if (snapshot.exists()) {
                                const x = snapshot.val();
                                // setDd(x.length);
                                const listItem = Object.values(x).map((user) => user);

                                const y = listItem.filter(
                                    (item) => decodePath(item.email) === email && item.password === password,
                                );
                                if (y.length !== 0) {
                                    localStorage.setItem('Role', y[0].Role);
                                    localStorage.setItem('Name', y[0].name);
                                    
                                    saveOnLocal(y[0].Role);
                                    
                                    setIsLoggedIn(true);
                                    localStorage.setItem('isLoggedIn', 'true');
                                    <Link to="/admin/dashboard" />;
                                } else {
                                    toast.error('Account not found. Please check your email and password again.');
                                }
                            } else {
                                console.log('No data available');
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                } else {
                    toast.error('Please enter your password');
                }
            }
        } else {
            toast.error('Please enter your email');
        }

    }

    return (
        <>
            <div className="background">
                <div className="form-container">
                    <div className="col col-1">
                        <div className="image_layer">
                            <img src="assets/login/img/FPTnew.png" className="form_img_main" alt="" />
                        </div>

                        <p className="featured">
                            Please LOGIN to continue <br /> or <br /> <br />
                            <span>
                                <Link className="btn-getback" to="/">
                                    Get back
                                </Link>
                            </span>
                        </p>
                    </div>

                    <div className="col col-2">
                        <form action="">
                            {/* Trang đăng nhập */}
                            <div className="login-form">
                                <div className="form-title">
                                    <span>LOGIN</span>
                                </div>
                                <div className="form-inputs">
                                    <div className="input-box">
                                        <input
                                            type="email"
                                            className="input-field"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email"
                                            required
                                        />
                                        <i className="bx bx-envelope icon"></i>
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field pass_login"
                                            onChange={(e) => setPassword(e.target.value)}
                                            value={password}
                                            placeholder="Password"
                                            required
                                        />

                                        <i className="bx bx-lock-alt icon"></i>
                                        <i className="fa fa-eye eye icon"></i>
                                    </div>

                                    <div className="forget-pass">
                                        <div className="input-box">
                                            <input type="checkbox" />
                                            <span className="remembertxt_login"> Remember me</span>
                                            <Link to="/forgetpass">Forgot password?</Link>
                                        </div>
                                    </div>

                                    <div className="input-box" onClick={() => getdt(email, password)}>
                                        <div className="input-submit">
                                            <span>Log in</span>
                                            <i className="bx bx-right-arrow-alt"></i>
                                        </div>
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
