import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import 'firebase/auth';
import { ref, child, getDatabase, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { Link, Redirect } from 'react-router-dom';
export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    function saveOnLocal() {
        const emailEncode = email.replace(/\./g, ',');
        get(child(ref(db), 'Infor')).then((snapshot) => {
            if (snapshot.exists()) {
                const x = snapshot.val();
                for (let item in x) {
                    if (item === emailEncode) {
                        localStorage.setItem('Infor', JSON.stringify(x[item]));
                        localStorage.setItem('Email', JSON.stringify(email));
                        localStorage.setItem('LoginState', JSON.stringify(true));
                    }
                }
                // console.log(x);
                // x.forEach((element) => {
                //     if (element.email === email) {
                //         localStorage.setItem('myObject', JSON.stringify(element));
                //         return true;
                //     }
                // });
            }
        });
    }

    function getdt(email, password) {
        // console.log(email,password)
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
                                    saveOnLocal();
                                    <Link to="/admin/dashboard" />;
                                    setIsLoggedIn(true);
                                    // navigate('/Register');
                                    localStorage.setItem('isLoggedIn', 'true');
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
                <link rel="stylesheet" href="assets/login/css/style.css" />
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
                                            placeholder="Enter email here..."
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
                                            placeholder="Enter password here..."
                                            required
                                        />

                                        <i className="bx bx-lock-alt icon"></i>
                                        <i className="fa fa-eye eye icon"></i>
                                    </div>

                                    <div className="forget-pass">
                                        <div className="input-box">
                                            <input type="checkbox" />
                                            <span className="remembertxt_login"> Remember me</span>
                                        </div>
                                        <a href="index.html">Forgot password?</a>
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
              -moz-user-selexact:none;
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
                <script src="assets/login/js/login.js"></script>
            </body>
            {isLoggedIn && <Redirect to="/admin/dashboard" />}
        </>
    );
};

export default Login;