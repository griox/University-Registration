import 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useEffect } from 'react';
import { database } from '../firebaseConfig.js';
import { toast } from 'react-toastify';


let isUniCreated = false; 
export function writeUniRecord(uniCode,nameU,address,registration,target,averageS,isRegistered) {
  const univerRef = ref(database,`University/${uniCode}` ); 
  set(univerRef, { 
   uniCode:uniCode,
   nameU:nameU,
   address:address,
   registration:registration,
   target:target,
   averageS:averageS,
   isRegistered:isRegistered,
  }).catch((error) => {
      toast.error(`Error writing record for student with ID ${uniCode}: ${error}`)
  });
}

const uniCodes = [
  "ntu", "hcmut", "hust", "vnu", "uet",
  "cantho", "dut", "tdtu", "pteu", "thuapvm",
  "hutech", "uit", "ueh", "fpt", "rmit",
  "uef", "ltu", "hpu", "ussh", "ute",
  "uetv", "vnuhn", "huce", "vnuhcm", "hutechcantho",
  "uetcantho", "uefcantho", "ltucantho", "hpucantho", "usshcantho",
  "utecantho", "dutcantho", "tdtucantho", "pteucantho", "thuapvmcantho",
  "hutechdanang", "uetdanang", "uefdanang", "ltudanang", "hpudanang",
  "usshdanang", "utedanang", "dutdanang", "tdtudanang", "pteudana",
];

const nameUs = [
  "Đại học Nha Trang",
  "Đại học Bách khoa TP.HCM",
  "Đại học Khoa học và Công nghệ Hà Nội",
  "Đại học Quốc gia Hà Nội",
  "Đại học Điện lực",
  "Đại học Cần Thơ",
  "Đại học Duy Tân",
  "Đại học Đà Nẵng",
  "Đại học sư phạm Kỹ thuật TP.HCM",
  "Trường Đại học Thủy sản Nha Trang",
  "Đại học Công nghệ TP.HCM",
  "Đại học Công nghệ Thông tin",
  "Đại học Kinh tế TP.HCM",
  "Đại học FPT",
  "Đại học RMIT Việt Nam",
  "Đại học Kinh tế Tài chính TP.HCM",
  "Đại học Lâm nghiệp",
  "Đại học Hoa Sen",
  "Đại học Khoa học Xã hội & Nhân văn TP.HCM",
  "Đại học Sư phạm TP.HCM",
  "Đại học Điện lực TP.HCM",
  "Đại học Quốc gia Hà Nội - Phân hiệu TP.HCM",
  "Đại học Sư phạm TP.HCM - Phân hiệu Huế",
  "Đại học Quốc gia TP.HCM - Phân hiệu Cần Thơ",
  "Đại học Công nghệ TP.HCM - Phân hiệu Cần Thơ",
  "Đại học Điện lực TP.HCM - Phân hiệu Cần Thơ",
  "Đại học Kinh tế Tài chính TP.HCM - Phân hiệu Cần Thơ",
  "Đại học Lâm nghiệp - Phân hiệu Cần Thơ",
  "Đại học Hoa Sen - Phân hiệu Cần Thơ",
  "Đại học Khoa học Xã hội & Nhân văn TP.HCM - Phân hiệu Cần Thơ",
  "Đại học Sư phạm TP.HCM - Phân hiệu Cần Thơ",
  "Đại học Duy Tân - Phân hiệu Cần Thơ",
  "Đại học Đà Nẵng - Phân hiệu Cần Thơ",
  "Đại học sư phạm Kỹ thuật TP.HCM - Phân hiệu Cần Thơ",
  "Trường Đại học Thủy sản Nha Trang - Phân hiệu Cần Thơ",
  "Đại học Công nghệ TP.HCM - Phân hiệu Đà Nẵng",
  "Đại học Điện lực TP.HCM - Phân hiệu Đà Nẵng",
  "Đại học Kinh tế Tài chính TP.HCM - Phân hiệu Đà Nẵng",
  "Đại học Lâm nghiệp - Phân hiệu Đà Nẵng",
  "Đại học Hoa Sen - Phân hiệu Đà Nẵng",
  "Đại học Khoa học Xã hội & Nhân văn TP.HCM - Phân hiệu Đà Nẵng",
  "Đại học Sư phạm TP.HCM - Phân hiệu Đà Nẵng",
  "Đại học Duy Tân - Phân hiệu Đà Nẵng",
  "Đại học Đà Nẵng - Phân hiệu Đà Nẵng",
  "Đại học sư phạm Kỹ thuật TP.HCM - Phân hiệu Đà Nẵng",

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
export function createUniRecords() {
  if (!isUniCreated) { 
      for (let i = 0; i<addresses.length ; i++) {
        let uniCode = uniCodes[i];
        let nameU =  nameUs[i];
        let address = addresses[i];
        let registration = [];
        let target = Math.floor(getRandomNumber(5,6))*1000;
        let averageS = Math.floor(Math.random() * (30 - 13)) + 10;
        let isRegistered = getRandomNumber(2000,5000)

       writeUniRecord(uniCode,nameU,address,registration,target,averageS,isRegistered)
      }
      isUniCreated = true; 
  }
}
export function useCreateUnitRecordsOnMount() {
  useEffect(() => {
  createUniRecords()
  }, []); 
}

