import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Masterlayout from './layouts/admin/Masterlayout';
import Home from './components/frontend/Home';
import Login from './components/frontend/auth/Login';
import Register from './components/frontend/auth/Register';
import { Provider } from 'react-redux';
import store from './pages/store';
import { ToastContainer } from 'react-toastify';

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <Router>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/admin" name="Admin" render={(props) => <Masterlayout {...props} />} />
                    </Switch>
                </Router>
            </div>
            <ToastContainer />
        </Provider>
    );
}

export default App;
