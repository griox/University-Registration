import React from 'react';
import './bin.css'; // Make sure to adjust the path according to your file structure
import { child, get, getDatabase, ref, update } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './constants/constants';
// import bcrypt from 'bcryptjs';
import { encodePath } from './commonFunctions';

const MyComponent = () => {
    // const salt = bcrypt.genSaltSync(10);

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const x = () => {
        get(child(ref(db), `Account/`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    const listItem = Object.values(x).map((user) => user);
                    listItem.forEach((item) => {
                        const temp = encodePath(item.email);
                        // var hash = bcrypt.hashSync(item.password, salt);
                        update(ref(db, 'Account/' + temp), {
                            // password: hash,
                        });
                    });
                } else {
                    console.log('No data available');
                }
            })
            .catch((error) => {
                console.log('No data available');
            });
    };
    x();
};

export default MyComponent;
