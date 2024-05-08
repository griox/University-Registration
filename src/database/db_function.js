import 'firebase/auth';
import { ref, child, getDatabase, get, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { validateEmailFormat, validatePasswordFormat, encodePath, decodePath } from '../helpers/commonFunctions';

const firebaseConfig = {
    apiKey: 'AIzaSyD2_evQ7Wje0Nza4txsg5BE_dDSNgmqF3o',
    authDomain: 'mock-proeject-b.firebaseapp.com',
    databaseURL: 'https://mock-proeject-b-default-rtdb.firebaseio.com',
    projectId: 'mock-proeject-b',
    storageBucket: 'mock-proeject-b.appspot.com',
    messagingSenderId: '898832925665',
    appId: '1:898832925665:web:bb28598e7c70a0d73188a0',
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export async function getdt(email, password, navigate) {
    // console.log(email,password)
    if (email !== '') {
        if (validateEmailFormat(email) !== true) {
            toast('Incorrect format');
        } else {
            if (password !== '') {
                get(child(ref(db), `Account/`))
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const x = snapshot.val();
                            const listItem = Object.values(x).map((user) => user);
                            console.log(email);
                            const y = listItem.filter(
                                (item) => decodePath(item.email) === email && item.password === password,
                            );
                            if (y.length !== 0) {
                                toast('Correct');
                                navigate('/Register');
                            } else {
                                toast('Account not found. Please check your email and password again.');
                            }
                        } else {
                            console.log('No data available');
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                toast('Please enter your password');
            }
        }
    } else {
        toast('Please enter your email');
    }
}

export function regist(props) {
    if (props.fullname !== '') {
        if (props.email !== '') {
            if (validateEmailFormat(props.email)) {
                if (props.password !== '') {
                    if (validatePasswordFormat(props.password)) {
                        if (props.againPassword === props.password) {
                            const encodeEmail = encodePath(props.email);
                            console.log(encodeEmail);
                            const ip = { email: encodePath(props.email), password: props.password, role: 'user' };
                            set(ref(db, 'Account/' + encodeEmail), ip);
                            props.navigate('/DashBoard');
                            toast('Sign up sucessfully');
                        }
                    } else {
                        toast('Password must have at least 8 characters');
                    }
                } else {
                    toast('Please enter your password');
                }
            } else {
                toast('Incorrect format');
            }
        } else {
            toast('Please enter your email');
        }
    } else {
        toast('Please enter your full name');
    }
}
