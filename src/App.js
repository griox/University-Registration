import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import { DashBoard } from './components/DashBoard';
import { ToastContainer } from 'react-toastify';
import { Resigter } from './components/Resigter';

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    {/* <Route path="/" element={<Login />} /> */}
                    <Route path="/" element={<Resigter />} />
                    {/* <Route path="/dashboard" element={<DashBoard />} /> */}
                </Routes>
            </div>
            <ToastContainer className="toast-position" />
        </Router>
    );
}

export default App;
