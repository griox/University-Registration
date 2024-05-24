import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import MyComponent from './bin';
import global_en from './translation/en/global.json';
import global_vie from './translation/vie/global.json';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: {
        en: {
            global: global_en,
        },
        vie: {
            global: global_vie,
        },
    },
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <I18nextProvider i18n={i18next}>
            <App />
        </I18nextProvider>
        <MyComponent />
    </BrowserRouter>,
);
