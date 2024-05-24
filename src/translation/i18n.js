import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HOME_EN from '../locales/en/home.json';
import HOME_VI from '../locales/vi/home.json';

export const locales = {
    en: 'English',
    vi: 'Tiếng việt',
};
const resources = {
    en: {
        home: HOME_EN,
    },
    vi: {
        home: HOME_VI,
    },
};
const defaultNs = 'product';
i18n.use(initReactI18next).init({
    resources,
    lng: 'vi',
    ns: ['home'],
    fallbackLng: 'vi',
    defaultNs,
    interpolation: {
        escapeValue: false,
    },
});
