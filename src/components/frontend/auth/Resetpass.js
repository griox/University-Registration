import React, { useState } from 'react';
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

export const Forgetpass = () => {
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const history = useHistory();
    const [newPass, setNewPass] = useState('');
    const [reNewPass, setReNewPass] = useState('');
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('selectedMenuItem');
        history.push('/Login');
    };
    const handlePassword = async () => {
        const email = localStorage.getItem('Email');
        get(child(ref(db), `Account/`)).then((snapshot) => {
            if (snapshot.exists()) {
                const x = snapshot.val();
                const listItem = Object.values(x).map((user) => user);
                const y = listItem.find((item) => item.email === email);
                if (y !== undefined) {
                    if (newPass === reNewPass) {
                        const encodeEmail = encodePath(email);

                        try {
                            update(ref(db, `Account/` + encodeEmail), {
                                password: newPass,
                            }).then(() => toast.success('Your password has been reset'), handleLogout());
                        } catch (error) {
                            toast.error('Your request is failed');
                        }
                    }
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
                                    <span>FORGET PASSWORD</span>
                                </div>
                                <div className="form-inputs">
                                    <div className="input-box">
                                        <input
                                            type="password"
                                            className="input-field"
                                            placeholder="New password"
                                            required
                                            onChange={(e) => setNewPass(e.target.value)}
                                            value={newPass === '' ? '' : newPass}
                                        />
                                        <i className="bx bx-envelope icon"></i>
                                    </div>
                                    <div className="input-box">
                                        <input
                                            type="email"
                                            className="input-field"
                                            placeholder="Re-new password"
                                            required
                                            onChange={(e) => setReNewPass(e.target.value)}
                                            value={reNewPass === '' ? '' : reNewPass}
                                        />
                                        <i className="bx bx-envelope icon"></i>
                                    </div>

                                    <div className="input-box">
                                        <div className="input-submit" onClick={() => handlePassword()}>
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
