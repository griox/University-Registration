import 'firebase/auth';
import { ref, set, child, get } from 'firebase/database';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { database } from '../firebaseConfig.js';

let isAccountCreated = false;
function encodeEmail(email) {
    return email.replace('.', ',');
}
function writeAccountRecord(email, password, Role, name) {
    const emailEncoded = encodeEmail(email);
    const accountRef = ref(database, `Account/${emailEncoded}`);
    set(accountRef, {
        email: email,
        password: password,
        Role: Role,
        name: name,
    })
        .then(() => {
            toast.error('Record for student with username ' + email + ' has been written successfully!');
        })
        .catch((error) => {
            toast.error('Error writing record for student with ID ' + email + ': ', error);
        });
}

const Name = ['PhamVanLinh', 'NgoQuangHuy', 'NguyenMinhQuang', 'DoXuanTruong'];
const Email = ['PhamVanLinh@gmail.com', 'NgoQuangHuy@gmail.com', 'NguyenMinhQuang@gmail.com', 'DoXuanTruong@gmail.com'];
export async function createAccountRecords() {
    if (!isAccountCreated) {
        await fetchData();
        for (let i = 0; i < Name.length; i++) {
            let email = Email[i];
            let name = Name[i];
            const password = 'Tvx1234@';
            let Role;
            if (i === 0) {
                Role = 'super_admin';
            }
            if (i <= 3) {
                Role = 'admin';
            } else {
                Role = 'user';
            }

            writeAccountRecord(email, password, Role, name);
        }
        isAccountCreated = true;
    }
}
const fetchData = async () => {
    const accountRef = child(ref(database), `Detail/`);
    try {
        const snapshot = await get(accountRef);
        if (snapshot.exists()) {
            const allData = snapshot.val();
            const getData = Object.values(allData);
            const filteredStudents = getData.filter((student) => student.isRegister === true);

            filteredStudents.forEach((student) => {
                Name.push(student.name);
                Email.push(student.email);
            });
        }
    } catch (error) {
        toast.error('can not fetch data for Account');
    }
};
export function useCreateAccountRecordsOnMount() {
    useEffect(() => {
        createAccountRecords();
    }, []);
}
