import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import Upload, { createUniRecords, useCreateUnitRecordsOnMount } from './bin';
import MyAvatar from './bin';
import Bin from './bin';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    // </React.StrictMode>,
);
