import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
// import 'boxicons/css/boxicons.min.css';
import 'firebase/auth';
import { Link } from 'react-router-dom';
import '../../../assets/css/login.css';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../constants/constants';
import { child, get, getDatabase, ref, update } from 'firebase/database';
import { encodePath } from '../../../commonFunctions';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
// import '../../../assets/js/login';
import bcrypt from 'bcryptjs';

export const Forgetpass = () => {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const history = useHistory();
    const [newPass, setNewPass] = useState('');
    const [reNewPass, setReNewPass] = useState('');
    const salt = bcrypt.genSaltSync(10);

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
    const handlePassword = async () => {
        const email = localStorage.getItem('Email');
        get(child(ref(db), `Account/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const x = snapshot.val();

                const listItem = Object.values(x).map((user) => user);
                const encodeEmail = encodePath(email);
                const y = listItem.filter((item) => item.email === email);
                console.log(listItem);
                if (y !== undefined) {
                    if (newPass === reNewPass) {
                        try {
                            var hash = bcrypt.hashSync(newPass, salt);
                            update(ref(db, `Account/` + encodeEmail), {
                                password: hash,
                            }).then(() => handleLogout());
                        } catch (error) {
                            toast.error('Your request is failed');
                        }
                    }
                } else {
                    toast.error('Your account was not found');
                }
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
                            Please enter EMAIL to continue <br /> or <br /> <br />
                            <span>
                                <Link className="btn-getback" to="/login">
                                    Get back
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
                                    <span>RESET PASSWORD</span>
                                </div>
                                <div className="form-inputs">
                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field pass_login_1"
                                            placeholder="New password"
                                            required
                                            value={newPass}
                                            onChange={(e) => setNewPass(e.target.value)}
                                        />
                                        <i className="bx bx-lock-alt icon"></i>
                                        <i className="fa fa-eye eye1 icon"></i>
                                    </div>

                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field con_pass_login"
                                            placeholder="Re-New Password"
                                            required
                                            value={reNewPass}
                                            onChange={(e) => setReNewPass(e.target.value)}
                                        />
                                        <i className="bx bx-lock-alt icon"></i>
                                        <i className="fa fa-eye eye2 icon"></i>
                                    </div>

                                    <div className="input-box" onClick={() => handlePassword()}>
                                        <div className="input-submit">
                                            <span>Continue</span>
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

export default Forgetpass;
