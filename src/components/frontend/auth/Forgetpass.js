import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
// import 'boxicons/css/boxicons.min.css';
import 'firebase/auth';
import { Link } from 'react-router-dom';
import '../../../assets/css/login.css';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../../constants/constants';
import { toast } from 'react-toastify';
// import '../../../assets/js/login';

export const Forgetpass = () => {
    const app = initializeApp(firebaseConfig);
    const db = getAuth(app);
    const [email, setEmail] = useState('');
    const handleEmail = async () => {
        localStorage.setItem('Email', email);
        sendPasswordResetEmail(db, 'quang.nm.64cntt@ntu.edu.vn')
            .then((data) => {
                alert('Check your email');
                <Link to="/resetpass"></Link>;
            })
            .catch((error) => {
                toast.error('Error');
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
                                    <span>FORGET PASSWORD</span>
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
                                        <div className="input-submit" onClick={() => handleEmail()}>
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
