
import { notification } from 'antd';
import { get, child, ref } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { initializeApp } from 'firebase/app';

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
export function getdt(setListItem, listItem, email, password) {
    get(child(ref(db), `Account/`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const x = snapshot.val();
                setListItem(Object.values(x).map((user) => user));
                console.log(listItem);
                const y = listItem.filter(item => item.id === email && item.password === password);
                if (y.length !== 0) {
                    return true;
                } else {
                    notification.error({
                        message: 'Không tìm thấy tài khoản',
                        description: 'Vui lòng kiểm tra lại email và mật khẩu.',
                        placement: 'topLeft',
                    });
                    return false; // Return false if login fails
                }
            } else {
                console.log('No data available');
                return false; // Return false if login fails
            }
        })
        .catch((error) => {
            console.error(error);
            return false; // Return false if login fails
        });
}

