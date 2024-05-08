<<<<<<< HEAD
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
// import { useState } from "react";
import { Routes, Route } from 'react-router-dom';
import Topbar from './page/global/Topbar';
import Sidebar from './page/global/Sidebar';
import Dashboard from './page/dashboard';
import Student from './page/student';
// import Invoices from "./page/invoices";
// import Contacts from "./page/contacts";
// import Bar from "./page/bar";
// import Form from "./page/form";
// import Line from "./page/line";
// import Pie from "./page/pie";
// import FAQ from "./page/faq";
// import Geography from "./page/geography";

// import Calendar from "./page/calendar/calendar";

function App() {
    const [theme, colorMode] = useMode();
    // const [isSidebar, setIsSidebar] = useState(true);

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className="app">
                    <Sidebar />
                    <main className="content">
                        <Topbar />
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/student" element={<Student />} />
                            {/* <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} /> */}
                        </Routes>
                    </main>
                </div>
            </ThemeProvider>
        </ColorModeContext.Provider>
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import { DashBoard } from './components/DashBoard';
import { ToastContainer } from 'react-toastify';
import { Resigter } from './components/Resigter';

function App() {
    useCreateStudentRecordsOnMount();
    useCreateAccountRecordsOnMount();
   
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/" element={<Resigter />} />
                    <Route path="/dashboard" element={<DashBoard />} />
                </Routes>
            </div>
            <ToastContainer className="toast-position" />
            
        </Router>
>>>>>>> 2c9be1dcbc666b49b1566b2f2ea42aab58eb5f74
    );
}

export default App;
