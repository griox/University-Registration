import Dashboard from '../components/admin/Dashboard';
import AddUniversity from '../components/admin/University';
import Student from '../components/admin/Student';
import Profile from '../components/admin/Profile';

const routes = [
    { path: '/admin', exact: true, name: 'Admin' },
    {
        path: '/admin/dashboard',
        exact: true,
        name: 'Dashboard',
        component: Dashboard,
    },
    {
        path: '/admin/university',
        exact: true,
        name: 'Add University',
        component: AddUniversity,
    },
    {
        path: '/admin/student',
        exact: true,
        name: 'Student',
        component: Student,
    },
    {
        path: '/admin/profile',
        exact: true,
        name: 'Profile',
        component: Profile,
    },
];

export default routes;
