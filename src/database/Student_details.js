import 'firebase/auth';
import { format } from 'date-fns';
import { ref, getDatabase, set, get, child } from 'firebase/database';
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
let isInforCreated = false; // Biến để đánh dấu xem hàm createStudentRecords đã được gọi hay chưa
function encodeEmail(email) {
  return email.replace('.', ',');
}
function writeInforRecord(name, gender, email, enthicity, dateObirth, placeOBirth, idenNum, MathScore, EnglishScore, LiteratureScore, Address, uniCode, id,AverageScore,isRegister) {
  const DetailRef = ref(db, `Detail/${id}`);
  set(DetailRef, {
    id: id,
    email: email,
    name: name,
    enthicity: enthicity,
    gender: gender,
    dateObirth: dateObirth,
    placeOBirth: placeOBirth,
    idenNum: idenNum,
    MathScore: MathScore,
    EnglishScore: EnglishScore,
    LiteratureScore: LiteratureScore,
    AverageScore: AverageScore,
    Address: Address,
    uniCode: uniCode,
    isRegister:isRegister
  }).then(() => {
  }).catch((error) => {
    console.error( error);
  });
}
const getRandomDateOfBirth = async () => {
  const randomYear = 2004; // Năm sinh từ 1990 đến 2003
  const randomMonth = Math.floor(Math.random() * 12) + 1; // Tháng sinh từ 1 đến 12
  const randomDay = Math.floor(Math.random() * 29) + 1; // Ngày sinh từ 1 đến 28 (tạm thời)
  const dateOfBirth = new Date(randomYear, randomMonth - 1, randomDay); // Tạo đối tượng Date

  return format(dateOfBirth, 'dd/MM/yyyy'); // Định dạng ngày và trả về dưới dạng dd/mm/yy
};
const cities = [
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bạc Liêu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái',
  'Phú Yên',
  'Cần Thơ',
  'Đà Nẵng',
  'Hải Phòng',
  'Hà Nội',
  'Hồ Chí Minh'
];
const addresses = [
  "26 Nguyễn Đình Chiểu, Nha Trang, Khánh Hòa",
  "Đ. Điện Biên Phủ, Phường 26, Bình Thạnh, TP.HCM",
  "1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
  "19 Lê Thánh Tông, Hoàn Kiếm, Hà Nội",
  "144 Xuân Thủy, Cầu Giấy, Hà Nội",
  "390 Nguyễn Văn Cừ, Ninh Kiều, Cần Thơ",
  "Duy Tân, Đà Nẵng",
  "43 Nguyễn Hiệp Thành, Thanh Khê, Đà Nẵng",
  "01 Cao Văn Ngữ, Thủ Đức, TP.HCM",
  "235 Phước Long, Phước Long, Nha Trang, Khánh Hòa",
  "1 Võ Văn Ngân, Thủ Đức, TP.HCM",
  "1 Hoa Lăm, Ba Đình, Hà Nội",
  "Võ Văn Ngân, Thủ Đức, TP.HCM",
  "77 Xuân Thủy, Cầu Giấy, Hà Nội",
  "2 Nguyễn Văn Linh, Tân Phong, Quận 7, TP.HCM",
  "140 Võ Văn Ngân, Thủ Đức, TP.HCM",
  "Xuân Thủy, Cầu Giấy, Hà Nội",
  "204 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM",
  "10 Đinh Tiên Hoàng, Bình Thạnh, TP.HCM",
  "180 Nguyễn Văn Trỗi, Phú Nhuận, TP.HCM",
  "268 Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM",
  "28A Võ Văn Ngân, Thủ Đức, TP.HCM",
  "10 Kim Long, Huế, Thừa Thiên Huế",
  "395 Quang Trung, Ninh Kiều, Cần Thơ",
  "Khu đô thị Tây Đô, Ninh Kiều, Cần Thơ",
  "144 Trần Hưng Đạo, Ninh Kiều, Cần Thơ",
  "299 Mậu Thân, Ninh Kiều, Cần Thơ",
  "820 Đường 30/4, Ninh Kiều, Cần Thơ",
  "92 Cao Văn Lan, Ninh Kiều, Cần Thơ",
  "299 Mậu Thân, Ninh Kiều, Cần Thơ",
  "90 Trần Hưng Đạo, Ninh Kiều, Cần Thơ",
  "Khu đô thị Tây Đô, Ninh Kiều, Cần Thơ",
];
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const unicodes =[ "ntu", "hcmut", "hust", "vnu", "uet",
"cantho", "dut", "tdtu", "pteu", "thuapvm",
"hutech", "uit", "ueh", "fpt", "rmit",
"uef", "ltu", "hpu", "ussh", "ute",
"uetv", "vnuhn", "huce", "vnuhcm", "hutechcantho",
"uetcantho", "uefcantho", "ltucantho", "hpucantho", "usshcantho",
"utecantho", "dutcantho", "tdtucantho", "pteucantho", "thuapvmcantho",
"hutechdanang", "uetdanang", "uefdanang", "ltudanang", "hpudanang",
"usshdanang", "utedanang", "dutdanang", "tdtudanang", "pteudana"]
let idCounter = 0;
function generateUniqueID() {
  let uniqueId = 'SV' + (++idCounter).toString().padStart(3, '0');
  return uniqueId;
}
function round(number, precision) {
  let factor = Math.pow(10, precision);
  return Math.round((number || 0) * factor) / factor;
}
const isRegisters =[];
const idNumber=[];
const names = [];
const mathScores = [];
const EnglishScores = [];
const LiteratureScores = [];
const Emails = [];
const studentMap = {}; // Sử dụng một đối tượng để lưu trữ thông tin sinh viên bằng email và tên
export async function createInforRecords() {
  if (!isInforCreated) {
    await fetchData();
    console.log(names);
    for (let i = 0; i < Emails.length; i++) {
      let id = generateUniqueID(); // Tạo id duy nhất
      console.log(id);
      let email = Emails[i];
      let name = names[i];
      console.log(name);
      let MathScore = parseFloat(mathScores[i])||0;
      let EnglishScore = parseFloat(EnglishScores[i])||0;
      let LiteratureScore = parseFloat(LiteratureScores[i])||0 ;
      let gender = Math.random() < 0.5 ? 'Male' : 'Female';
      let isRegister = isRegisters[i];
      const enthicity = 'Kinh';
      let placeOBirth = cities[Math.floor(Math.random() * cities.length)];
      let idenNum = '05620400' + idNumber[i];
      let Address = addresses[Math.floor(Math.random() * addresses.length)];
      let dateObirth = await getRandomDateOfBirth();
      let uniCode = [];
      let AverageScore = round(MathScore+EnglishScore+LiteratureScore,1);
      for (let j = 0; j < Math.floor(Math.random() * 5); j++) {
        let code = unicodes[Math.floor(Math.random() * unicodes.length)];
        while (uniCode.includes(code)) {
          code = unicodes[Math.floor(Math.random() * unicodes.length)];
        }
        uniCode.push(code);
      } 
      writeInforRecord(
        name,
        gender,
        email,
        enthicity,
        dateObirth,
        placeOBirth,
        idenNum,
        MathScore,
        EnglishScore,
        LiteratureScore,
        Address,
        uniCode,
        id,
        AverageScore, // Truyền id vào hàm
        isRegister, 
      );
    }
    isInforCreated = true;
  }
}
const fetchData = async () => {
  const studentRef = child(ref(db), 'SinhVien/');
  try {
    const snapshot = await get(studentRef);
    if (snapshot.exists()) {
      const allData = snapshot.val();
      const filteredData = Object.values(allData);

      // Lặp qua từng sinh viên và gán các giá trị vào các mảng tương ứng
      filteredData.forEach(student => {
        names.push(student.name);
        mathScores.push(student.mathScore);
        EnglishScores.push(student.englishScore);
        LiteratureScores.push(student.literatureScore);
        Emails.push(student.email);
        idNumber.push(getRandomNumber(1000, 9999));
        isRegisters.push(student.isRegister);
      });
    }
  } catch (error) {
    console.error(error);
    return []; // Trả về mảng rỗng nếu có lỗi
  }
};

export async function useCreateInforRecordsOnMount() {
  useEffect(() => {
    createInforRecords(); // Tạo bản ghi tài khoản
  }, []); // Thực hiện chỉ một lần khi component được mount
}
