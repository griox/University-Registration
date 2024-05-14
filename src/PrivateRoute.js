import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const isLoggedIn = !!localStorage.getItem('isLoggedIn'); // Kiểm tra trạng thái đăng nhập từ localStorage

    return <Route {...rest} render={(props) => (isLoggedIn ? <Component {...props} /> : <Redirect to="/" />)} />;
};

export default PrivateRoute;
