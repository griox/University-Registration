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
    );
}

export default App;
