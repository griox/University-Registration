import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Masterlayout from './layouts/admin/Masterlayout';
import Home from './components/frontend/Home';
import Login from './components/frontend/auth/Login';
import Register from './components/frontend/auth/Register';
import forgetpass from './components/frontend/auth/Forgetpass';
import changepass from './components/frontend/auth/Changepass';
import resetpass from './components/frontend/auth/Resetpass';

import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './pages/store';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './PrivateRoute';
// import { useCreateInforRecordsOnMount } from './database/Student_details';
// import { useCreateUnitRecordsOnMount } from './database/University';
// import { useCreateAccountRecordsOnMount } from './database/Account';
import './translation/i18n';
import 'react-toastify/dist/ReactToastify.css';
import { ConfigProvider } from 'antd';
import vi_VN from 'antd/locale/vi_VN';

function App() {
    const userToken = localStorage.getItem('userToken');
    const handleRemember = () => {
        localStorage.setItem('selectedMenuItem', 'Dashboard');
        console.log(userToken);
        return Masterlayout;
    };
    return (
        <Provider store={store}>
            <div className="App">
                <Router>
                    <Switch>
                        <Route exact path="/" component={userToken !== null ? handleRemember() : Home} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/forgetpass" component={forgetpass} />
                        <Route path="/changepass" component={changepass} />
                        <Route path="/resetpass" component={resetpass} />
                        <PrivateRoute path="/admin" component={Masterlayout} />
                    </Switch>
                </Router>
            </div>
            <ToastContainer />
        </Provider>
    );
}

export default App;
