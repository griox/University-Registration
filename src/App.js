import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import { DashBoard } from './components/DashBoard';
import { ToastContainer } from 'react-toastify';
import { useCreateStudentRecordsOnMount } from './database/Student'; 
import { useCreateAccountRecordsOnMount } from './database/Account';
function App() {
    useCreateStudentRecordsOnMount();
    useCreateAccountRecordsOnMount();
   
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<DashBoard />} />
                </Routes>
            </div>
            <ToastContainer className="toast-position" />
        </Router>
    );
}

export default App;
