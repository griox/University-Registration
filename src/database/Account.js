import 'firebase/auth';
import { ref,  getDatabase, set } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { useEffect } from 'react';
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
let isAccountCreated = false; // Biến để đánh dấu xem hàm createStudentRecords đã được gọi hay chưa
function encodeEmail(email) {
  return email.replace('.', ',');
}
function writeAccountRecord(email,password, Role) {
  const emailEncoded = encodeEmail(email); 
  const accountRef = ref(db,`Account/${emailEncoded}` ); // Tạo reference đến đường dẫn của sinh viên trong database
  set(accountRef, { // Sử dụng set để ghi dữ liệu lên đường dẫn đó
    email:email,
    password:password,
    Role: Role
  }).then(() => {
      console.log("Record for student with username " + email+ " has been written successfully!");
  }).catch((error) => {
      console.error("Error writing record for student with ID " + email + ": ", error);
  });
}


const Emails = ["HoangVanThang@gmail.com","NguyenVanG@gmail.com","NguyenVanSon@gmail.com","PhamVanD@gmail.com","TranThiI@gmail.com","TranVanB@gmail.com","TranVanNam@gmail.com"];
export function createAccountRecords() {
  if (!isAccountCreated) { // Chỉ gọi hàm nếu biến isRecordsCreated là false
      for (let i = 0; i < 7; i++) {
        let email = Emails[i];
        const password = '1';
        const Role = "user";

       writeAccountRecord(email,password,Role)
      }
      isAccountCreated = true; // Đánh dấu rằng hàm đã được gọi
  }
}
export function useCreateAccountRecordsOnMount() {
  useEffect(() => {
      createAccountRecords();
  }, []); // Thực hiện chỉ một lần khi component được mount
}

