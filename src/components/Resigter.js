import React, { useEffect, useState } from 'react';
import { regist } from '../database/db';
import { useNavigate } from 'react-router-dom';

export const Resigter = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [againPassword, setAgainPassword] = useState('');
    const navigate = useNavigate();

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
                eyeBtn1.classList.add('bx-lock-open-alt');
            }
        };

        const handleEyeBtn1 = () => {
            if (passwordInput1.type === 'password') {
                passwordInput1.setAttribute('type', 'text');
                eyeBtn1.classList.remove('bx-lock-open-alt');
                eyeBtn1.classList.add('fa-eye-slash');
            } else {
                passwordInput1.setAttribute('type', 'password');
                eyeBtn1.classList.add('bx-lock-open-alt');
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
                eyeBtn2.classList.add('bx-lock-open-alt');
            }
        };

        const handleEyeBtn2 = () => {
            if (passwordInput2.type === 'password') {
                passwordInput2.setAttribute('type', 'text');
                eyeBtn2.classList.remove('bx-lock-open-alt');
                eyeBtn2.classList.add('fa-eye-slash');
            } else {
                passwordInput2.setAttribute('type', 'password');
                eyeBtn2.classList.add('bx-lock-open-alt');
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

    return (
        <>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>HOME | Trang Đăng Nhập Và Đăng Ký Tài Khoản</title>

                <script src="https://kit.fontawesome.com/64d58efce2.js" crossOrigin="anonymous"></script>

                {/* BOXICONS */}
                <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet" />

                {/* Font Awesome */}
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
                    integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg=="
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />

                {/* STYLE */}
                <link rel="stylesheet" href="assets/login/css/register.css" />
            </head>
            <body background="hero-1.jpg">
                <div className="form-container">
                    <div className="col col-1">
                        <div className="image_layer">
                            <img src="assets/login/img/white-outline.png" className="form_img_main" alt="" />
                            <img src="assets/login/img/dots.png" className="form_img dots" alt="" />
                            <img src="assets/login/img/coin.png" className="form_img coin" alt="" />
                            <img src="assets/login/img/spring.png" className="form_img spring" alt="" />
                            <img src="assets/login/img/rocket.png" className="form_img rocket" alt="" />
                            <img src="assets/login/img/cloud.png" className="form_img cloud" alt="" />
                            <img src="assets/login/img/stars.png" className="form_img stars" alt="" />
                        </div>

                        <p className="featured">
                            Please REGISTER to continue <br /> or <br />{' '}
                            <span>
                                <button className="btn-getback" href="index.html">
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
                                            placeholder="Enter your first and last name..."
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                        <i class="bx bx-user icon"></i>
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Enter your email..."
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
                                            placeholder="Enter your password..."
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <i className="bx bx-lock-alt icon"></i>
                                        <i className="bx bx-lock-open-alt eye1 icon"></i>
                                    </div>

                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field con_pass_login"
                                            placeholder="Re-enter your password..."
                                            required
                                            value={againPassword}
                                            onChange={(e) => setAgainPassword(e.target.value)}
                                        />
                                        <i className="bx bx-lock-alt icon"></i>
                                        <i className="bx bx-lock-open-alt eye2 icon"></i>
                                    </div>

                                    <div className="input-box">
                                        <div
                                            type="submit"
                                            className="input-submit"
                                            onClick={() =>
                                                regist({
                                                    name: fullName,
                                                    email: email,
                                                    password: password,
                                                    againPassword: againPassword,
                                                    navigate: navigate,
                                                })
                                            }
                                        >
                                            <span>Regist</span>
                                            <i className="bx bx-right-arrow-alt"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="snowflakes" aria-hidden="true">
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                </div>

                <style>
                    {`
            @-webkit-keyframes snowflakes-fall {
              0% {top:-10%}
              100% {top:100%}
            }
            @-webkit-keyframes snowflakes-shake {
              0%,100% {-webkit-transform:translateX(0);transform:translateX(0)}
              50% {-webkit-transform:translateX(80px);transform:translateX(80px)}
            }
            @keyframes snowflakes-fall {
              0% {top:-10%}
              100% {top:100%}
            }
            @keyframes snowflakes-shake {
              0%,100%{ transform:translateX(0)}
              50% {transform:translateX(80px)}
            }
            .snowflake {
              color: #fff;
              font-size: 1em;
              font-family: Arial, sans-serif;
              text-shadow: 0 0 5px #000;
              position:fixed;
              top:-10%;
              z-index:9999;
              -webkit-user-select:none;
              -moz-user-select:none;
              -ms-user-select:none;
              user-select:none;
              cursor:default;
              -webkit-animation-name:snowflakes-fall,snowflakes-shake;
              -webkit-animation-duration:10s,3s;
              -webkit-animation-timing-function:linear,ease-in-out;
              -webkit-animation-iteration-count:infinite,infinite;
              -webkit-animation-play-state:running,running;
              animation-name:snowflakes-fall,snowflakes-shake;
              animation-duration:10s,3s;
              animation-timing-function:linear,ease-in-out;
              animation-iteration-count:infinite,infinite;
              animation-play-state:running,running;
            }
            .snowflake:nth-of-type(0){
              left:1%;-webkit-animation-delay:0s,0s;animation-delay:0s,0s
            }
            .snowflake:nth-of-type(1){
              left:10%;-webkit-animation-delay:1s,1s;animation-delay:1s,1s
            }
            .snowflake:nth-of-type(2){
              left:20%;-webkit-animation-delay:6s,.5s;animation-delay:6s,.5s
            }
            .snowflake:nth-of-type(3){
              left:30%;-webkit-animation-delay:4s,2s;animation-delay:4s,2s
            }
            .snowflake:nth-of-type(4){
              left:40%;-webkit-animation-delay:2s,2s;animation-delay:2s,2s
            }
            .snowflake:nth-of-type(5){
              left:50%;-webkit-animation-delay:8s,3s;animation-delay:8s,3s
            }
            .snowflake:nth-of-type(6){
              left:60%;-webkit-animation-delay:6s,2s;animation-delay:6s,2s
            }
            .snowflake:nth-of-type(7){
              left:70%;-webkit-animation-delay:2.5s,1s;animation-delay:2.5s,1s
            }
            .snowflake:nth-of-type(8){
              left:80%;-webkit-animation-delay:1s,0s;animation-delay:1s,0s
            }
            .snowflake:nth-of-type(9){
              left:90%;-webkit-animation-delay:3s,1.5s;animation-delay:3s,1.5s
            }
            .snowflake:nth-of-type(10){
              left:25%;-webkit-animation-delay:2s,0s;animation-delay:2s,0s
            }
            .snowflake:nth-of-type(11){
              left:65%;-webkit-animation-delay:4s,2.5s;animation-delay:4s,2.5s
            }
          `}
                </style>

                {/* JS */}
                <script></script>
            </body>
        </>
    );
};
