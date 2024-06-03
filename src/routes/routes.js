import Dashboard from '../components/admin/Dashboard';
import AddUniversity from '../components/admin/University';
import Student from '../components/admin/Student';
import Profile from '../components/admin/Profile';
import ChatRoom from '../components/admin/ChatRoom'


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
    {
        path:'/admin/ChatRoom',
        exact: true,
        name: 'ChatRoom',
        component: ChatRoom,
    }
];

export default routes;
