import 'firebase/auth';
import { ref, set,get,update } from 'firebase/database';
import { useEffect } from 'react';
import { database } from '../firebaseConfig.js';
import { toast } from 'react-toastify';

let isRecordsCreated = false;
function writeStudentRecord(id, name, email, mathScore, literatureScore, englishScore, averageScore, isRegister, uniCodes, Role) {
  const studentRef = ref(database, 'SinhVien/'+id);
  set(studentRef, { 
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
  }).catch((error) => {
      toast.error(`Error writing record for student with ID ${id}: ${error}`);
  });
}


const userNames = ["HoangVanThang","NguyenVanG","NguyenVanSon","PhamVanD","TranThiI","TranVanB","TranVanNam"];
const userEmails = ["HoangVanThang@gmai.com","NguyenVanG@gmail.com","NguyenVanSon@gmail.com","PhamVanD@gmail.com","TranThiI@gmail.com","TranVanB@gmail.com","TranVanNam@gmail.com"];
let idCounter = 0; 
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
  if (!isRecordsCreated) {
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
     
      isRecordsCreated = true;
     
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
  const studentsRef = ref(database, 'SinhVien');
  try {
    const snapshot = await get(studentsRef);
    if (snapshot.exists()) {
      const studentsData = snapshot.val();
      for (const studentId in studentsData) {
        if (Object.hasOwnProperty.call(studentsData, studentId)) {
          const student = studentsData[studentId];
          const numberOfUniCodes = getRandomNumber(1, 5);
          const randomUniCodes = [];
          for (let i = 0; i < numberOfUniCodes; i++) {
            randomUniCodes.push(unicodes[Math.floor(Math.random() * unicodes.length)]);
          }
          await update(ref(studentsRef.child(studentId)), { uniCodes: randomUniCodes });
        }
      }
    }
  } catch (error) {
    toast.error('Error updating uniCodes')
  }
}
async function updateStudentGender() {
  const studentsRef = ref(database, 'SinhVien');
  try {
    const snapshot = await get(studentsRef);
    if (snapshot.exists()) {
      const studentsData = snapshot.val();
      for (const studentId in studentsData) {
        if (Object.hasOwnProperty.call(studentsData, studentId)) {
          const student = studentsData[studentId];
          const gender = Math.random() < 0.5 ? 'male' : 'female';
          await update(ref(studentsRef.child(studentId)), { gender: gender });
        }
      }
    }
  } catch (error) {
    toast.error('Error updating gender')
  }
}
export function useCreateStudentRecordsOnMount() {
  useEffect(() => {
    updateStudentGender()
  }, []);
}


