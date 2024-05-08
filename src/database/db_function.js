import 'firebase/auth';
import { ref, child, getDatabase, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { toast } from 'react-toastify';
import { validateEmailFormat } from '../helpers/commonFunctions';
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
                            const y = listItem.filter((item) => item.email === email && item.password === password);
                            console.log(y)
                            if (y.length !== 0) {
                                toast('Correct');
                                navigate('/DashBoard');
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
