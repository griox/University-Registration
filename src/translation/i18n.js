import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HOME_EN from '../locales/en/home.json';
import HOME_VI from '../locales/vi/home.json';
import PROFILE_EN from '../locales/en/profile.json';
import PROFILE_VI from '../locales/vi/profile.json';
import UNIVERSITY_EN from '../locales/en/university.json';
import UNIVERSITY_VI from '../locales/vi/university.json';
import STUDENT_EN from '../locales/en/student.json';
import STUDENT_VI from '../locales/vi/student.json';
import DASHBOARD_EN from '../locales/en/dashboard.json';
import DASHBOARD_VI from '../locales/vi/dashboard.json';
import REGISTER_EN from '../locales/en/register.json';
import REGISTER_VI from '../locales/vi/register.json';
import LOGIN_EN from '../locales/en/login.json';
import LOGIN_VI from '../locales/vi/login.json';
import CHANGEPASSWORD_EN from '../locales/en/changePassword.json';
import CHANGEPASSWORD_VI from '../locales/vi/changePassword.json';
import NAVBAR_EN from '../locales/en/navbar.json';
import NAVBAR_VI from '../locales/vi/navbar.json';

export const locales = {
    en: 'English',
    vi: 'Tiếng việt',
};
const resources = {
    en: {
        home: HOME_EN,
        profile: PROFILE_EN,
        university: UNIVERSITY_EN,
        student: STUDENT_EN,
        dashboard: DASHBOARD_EN,
        register: REGISTER_EN,
        login: LOGIN_EN,
        changePassword: CHANGEPASSWORD_EN,
        navbar: NAVBAR_EN,
    },
    vi: {
        home: HOME_VI,
        profile: PROFILE_VI,
        university: UNIVERSITY_VI,
        student: STUDENT_VI,
        dashboard: DASHBOARD_VI,
        register: REGISTER_VI,
        login: LOGIN_VI,
        changePassword: CHANGEPASSWORD_VI,
        navbar: NAVBAR_VI,
    },
};
const defaultNs = 'product';
i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    ns: ['home', 'profile', 'university', 'student', 'dashboard', 'register', 'login', 'changePassword', 'navbar'],
    fallbackLng: 'en',
    defaultNs,
    interpolation: {
        escapeValue: false,
    },
});
