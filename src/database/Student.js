import 'firebase/auth';
import { ref,  getDatabase, set,get,update } from 'firebase/database';
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
let isRecordsCreated = false; // Biến để đánh dấu xem hàm createStudentRecords đã được gọi hay chưa
function writeStudentRecord(id, name, email, mathScore, literatureScore, englishScore, averageScore, isRegister, uniCodes, Role) {
  const studentRef = ref(db, 'SinhVien/'+id); // Tạo reference đến đường dẫn của sinh viên trong database
  set(studentRef, { // Sử dụng set để ghi dữ liệu lên đường dẫn đó
      id: id,
      name: name,
      email: email,
      mathScore: mathScore,
      literatureScore: literatureScore,
      englishScore: englishScore,
      averageScore: averageScore,
      isRegister: isRegister,
      uniCodes: uniCodes,
      Role: Role
  }).then(() => {
      console.log("Record for student with ID " + id + " has been written successfully!");
  }).catch((error) => {
      console.error("Error writing record for student with ID " + id + ": ", error);
  });
}


const userNames = ["HoangVanThang","NguyenVanG","NguyenVanSon","PhamVanD","TranThiI","TranVanB","TranVanNam"];
const userEmails = ["HoangVanThang@gmai.com","NguyenVanG@gmail.com","NguyenVanSon@gmail.com","PhamVanD@gmail.com","TranThiI@gmail.com","TranVanB@gmail.com","TranVanNam@gmail.com"];
let idCounter = 0; // Biến số liệu để đảm bảo tính duy nhất của ID
// Tạo hàm ngẫu nhiên từ min đến max
function getRandomNumber(min, max) {
  return round(Math.random() * (max - min + 1) + min,1);
}
function round(number, precision) {
  let factor = Math.pow(10, precision);
  return Math.round((number || 0) * factor) / factor;
}


function generateUniqueID() {
    let uniqueId = 'SV' + (++idCounter).toString().padStart(3, '0');
    return uniqueId;
}
export function createStudentRecords() {
  if (!isRecordsCreated) { // Chỉ gọi hàm nếu biến isRecordsCreated là false
      for (let i = 0; i < 7; i++) {
          let id = generateUniqueID();
          let name = userNames[i];
          let email = userEmails[i];
          let mathScore = getRandomNumber(0, 10);
          let literatureScore = getRandomNumber(0, 10);
          let englishScore = getRandomNumber(0, 10);
          let averageScore = mathScore + literatureScore + englishScore;
          let isRegister = true;
          let uniCode = [];
          const Role = "user";

          writeStudentRecord(id, name, email, mathScore, literatureScore, englishScore, averageScore, isRegister, uniCode, Role);
      }
     
      isRecordsCreated = true; // Đánh dấu rằng hàm đã được gọi
     
  }
}
const unicodes = [
  "ntu", "hcmut", "hust", "vnu", "uet",
  "cantho", "dut", "tdtu", "pteu", "thuapvm",
  "hutech", "uit", "ueh", "fpt", "rmit",
  "uef", "ltu", "hpu", "ussh", "ute",
  "uetv", "vnuhn", "huce", "vnuhcm", "hutechcantho",
  "uetcantho", "uefcantho", "ltucantho", "hpucantho", "usshcantho",
  "utecantho", "dutcantho", "tdtucantho", "pteucantho", "thuapvmcantho",
  "hutechdanang", "uetdanang", "uefdanang", "ltudanang", "hpudanang",
  "usshdanang", "utedanang", "dutdanang", "tdtudanang", "pteudana"
];
async function updateUniCodes() {
  const studentsRef = ref(db, 'SinhVien');
  try {
    const snapshot = await get(studentsRef);
    if (snapshot.exists()) {
      const studentsData = snapshot.val();
      for (const studentId in studentsData) {
        if (Object.hasOwnProperty.call(studentsData, studentId)) {
          const student = studentsData[studentId];
          const numberOfUniCodes = getRandomNumber(1, 5); // Số lượng uniCodes ngẫu nhiên từ 1 đến 5
          const randomUniCodes = [];
          // Tạo một mảng chứa các uniCode ngẫu nhiên
          for (let i = 0; i < numberOfUniCodes; i++) {
            randomUniCodes.push(unicodes[Math.floor(Math.random() * unicodes.length)]);
          }
          // Update giá trị uniCodes cho sinh viên
          await update(ref(studentsRef.child(studentId)), { uniCodes: randomUniCodes });
          console.log(`Updated uniCodes for student ${studentId}`);
        }
      }
    }
  } catch (error) {
    console.error('Error updating uniCodes:', error);
  }
}
async function updateStudentGender() {
  const studentsRef = ref(db, 'SinhVien');
  try {
    const snapshot = await get(studentsRef);
    if (snapshot.exists()) {
      const studentsData = snapshot.val();
      for (const studentId in studentsData) {
        if (Object.hasOwnProperty.call(studentsData, studentId)) {
          const student = studentsData[studentId];
          const gender = Math.random() < 0.5 ? 'male' : 'female'; // Chọn giới tính ngẫu nhiên
          // Update giá trị gender cho sinh viên
          await update(ref(studentsRef.child(studentId)), { gender: gender });
          console.log(`Updated gender for student ${studentId}`);
        }
      }
    }
  } catch (error) {
    console.error('Error updating gender:', error);
  }
}
export function useCreateStudentRecordsOnMount() {
  useEffect(() => {
    updateStudentGender()
  }, []); // Thực hiện chỉ một lần khi component được mount
}


