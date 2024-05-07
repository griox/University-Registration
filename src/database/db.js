import 'firebase/auth';
import { ref, child, getDatabase, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { notification } from 'antd';

const firebaseConfig = {
    apiKey: "AIzaSyD2_evQ7Wje0Nza4txsg5BE_dDSNgmqF3o",
    authDomain: "mock-proeject-b.firebaseapp.com",
    databaseURL: "https://mock-proeject-b-default-rtdb.firebaseio.com",
    projectId: "mock-proeject-b",
    storageBucket: "mock-proeject-b.appspot.com",
    messagingSenderId: "898832925665",
    appId: "1:898832925665:web:bb28598e7c70a0d73188a0"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export async function getdt(setListItem, listItem, email, setEmail, password, setPassword, setSuccess) {
    try {
        if (email !== '' && password !== '') {
            const snapshot = await get(child(ref(db), `Account/`));
            if (snapshot.exists()) {
                const x = snapshot.val();
                const y = Object.values(x).filter(item => item.id === email && item.password === password);
                if (y.length !== 0) {
                    setSuccess(true); // Set success state first
                    setListItem(Object.values(x).map((user) => user)); // Then set the list item
                    console.log('xac nhan tai khoan', true);
                    return true;
                } else {
                    notification.error({
                        message: 'Account not found',
                        description: 'Please check your email and password again.',
                        placement: 'topLeft',
                    });
                    console.log('xac nhan tai khoan', false);
                    return false;
                }
            } else {
                console.log('No data available');
                setSuccess(false);
                return false;
            }
        } else {
            alert("Please, enter email and password");
            return false;
        }
      
    } catch (error) {
        console.error(error);
        throw new Error("Error fetching data from database");
    }
}
