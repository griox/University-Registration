import React, { useEffect, useState } from 'react';
import 'firebase/auth';
import { child, get, getDatabase, ref, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import '../../../assets/css/register.css';

const Changepass = () => {
    const history = useHistory();

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
    return (
        <>
            <div className="background">
                <div className="form-container">
                    <div className="col col-1">
                        <div className="image_layer">
                            <img src="assets/login/img/FPTnew.png" className="form_img_main" alt="" />
                            {/* <img src="assets/login/img/white-outline.png" className="form_img_main" alt="" />
                            <img src="assets/login/img/dots.png" className="form_img dots" alt="" />
                            <img src="assets/login/img/coin.png" className="form_img coin" alt="" />
                            <img src="assets/login/img/spring.png" className="form_img spring" alt="" />
                            <img src="assets/login/img/rocket.png" className="form_img rocket" alt="" />
                            <img src="assets/login/img/cloud.png" className="form_img cloud" alt="" />
                            <img src="assets/login/img/stars.png" className="form_img stars" alt="" /> */}
                        </div>

                        <p className="featured">
                            Please REGISTER to continue <br /> or <br /> <br />
                            <span>
                                <button onClick={() => history.goBack()} className="btn-getback">
                                    Get back
                                </button>
                            </span>
                        </p>
                    </div>

                    <div className="col col-2">
                        <form action="">
                            {/* Trang đăng nhập */}
                            <div className="login-form">
                                <br />
                                <br />
                                <div className="form-title">
                                    <span>Change PassWord</span>
                                </div>
                                <div className="form-inputs">
                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field old_pass"
                                            placeholder="Enter Old Password"
                                            required
                                        />
                                        <i className="bx bx-lock-alt icon"></i>
                                        <i className="fa fa-eye eye1 icon"></i>
                                    </div>

                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field new_pass"
                                            placeholder="Enter New Password"
                                            required
                                        />
                                        <i className="bx bx-lock-alt icon"></i>
                                        <i className="fa fa-eye eye2 icon"></i>
                                    </div>

                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field con_pass"
                                            placeholder="Confirm New Password"
                                            required
                                        />
                                        <i className="bx bx-lock-alt icon"></i>
                                        <i className="fa fa-eye eye3 icon"></i>
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
                                        <Button type="primary" className="input-submit">
                                            <span>Change</span>
                                            <i className="bx bx-right-arrow-alt"></i>
                                        </Button>
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
                                    {/* <div className="input-box">
                                        <div type="submit" className="input-submit">
                                            <span>Clear</span>
                                            <i className="bx bx-right-arrow-alt"></i>
                                        </div>
                                    </div> */}
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
