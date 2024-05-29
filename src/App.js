import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import Masterlayout from './layouts/admin/Masterlayout';
import Home from './components/frontend/Home';
import Login from './components/frontend/auth/Login';
import Register from './components/frontend/auth/Register';
import forgetpass from './components/frontend/auth/Forgetpass';
import changepass from './components/frontend/auth/Changepass';
import resetpass from './components/frontend/auth/Resetpass';

import { Provider } from 'react-redux';
import store from './pages/store';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './PrivateRoute';
// import { useCreateInforRecordsOnMount } from './database/Student_details';
// import { useCreateUnitRecordsOnMount } from './database/University';
// import { useCreateAccountRecordsOnMount } from './database/Account';
import { MenuProvider } from './pages/MenuContext';
import './translation/i18n';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const x = localStorage.getItem('userToken');
    return (
        <Provider store={store}>
            <MenuProvider>
                <div className="App">
                    <Router>
                        <Switch>
                            <Route exact path="/" component={x !== null ? Masterlayout : Home} />
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
            </MenuProvider>
        </Provider>
    );
}

export default App;
