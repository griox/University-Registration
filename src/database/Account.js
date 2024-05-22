import 'firebase/auth';
import { ref,  getDatabase, set,child,get } from 'firebase/database';
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
function writeAccountRecord(email,password, Role,name) {
  const emailEncoded = encodeEmail(email); 
  const accountRef = ref(db,`Account/${emailEncoded}` ); // Tạo reference đến đường dẫn của sinh viên trong database
  set(accountRef, { // Sử dụng set để ghi dữ liệu lên đường dẫn đó
    email:email,
    password:password,
    Role: Role,
    name:name,
  }).then(() => {
      console.log("Record for student with username " + email+ " has been written successfully!");
  }).catch((error) => {
      console.error("Error writing record for student with ID " + email + ": ", error);
  });
}


const Name =['PhamVanLinh','NgoQuangHuy','NguyenMinhQuang','DoXuanTruong'];
const Email =['PhamVanLinh@gmail.com','NgoQuangHuy@gmail.com','NguyenMinhQuang@gmail.com','DoXuanTruong@gmail.com'];
export async function createAccountRecords() {
  if (!isAccountCreated) { // Chỉ gọi hàm nếu biến isRecordsCreated là false
    await fetchData()
      for (let i = 0; i < Name.length; i++) {
        let email = Email[i];
        let name = Name[i];
        const password = 'Tvx1234@';
        let Role;
        if(i===0){
           Role = 'super_admin';
        }
        if(i<=3){
           Role = 'admin';
        }
        else{
           Role = 'user';
        }
      

       writeAccountRecord(email,password,Role,name)
      }
      isAccountCreated = true; // Đánh dấu rằng hàm đã được gọi
  }
}
const fetchData = async()=>{
  const accountRef = child(ref(db),`Detail/`);
  try{
    const snapshot = await get(accountRef);
    if(snapshot.exists()){
      const allData = snapshot.val();
      const getData = Object.values(allData);
      const filteredStudents = getData.filter(student => student.isRegister === true);

      filteredStudents.forEach(student=>{
        Name.push(student.name);
        Email.push(student.email);
      })
    }
  }catch(error){
    console.error('can not fetch data for Account');
  }
}
export function useCreateAccountRecordsOnMount() {
  useEffect(() => {
      createAccountRecords();
  }, []); // Thực hiện chỉ một lần khi component được mount
}

