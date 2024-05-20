// import React from 'react';
// import { Descriptions } from 'antd';

// const items = [
//     {
//         key: '1',
//         label: 'Name',
//         children: 'Nha Trang University',
//     },
//     {
//         key: '2',
//         label: 'Telephone',
//         children: '1810000000',
//     },
//     {
//         key: '3',
//         label: 'Address',
//         children: '2 Nguyễn Đình Chiểu, Nha Trang, Khánh Hòa',
//     },
//     {
//         key: '4',
//         label: 'University code',
//         children: 'NTU',
//     },
// ];

// const FormDetail = () => (
//     <Descriptions title="University Infomation" column={2}>
//         {items.map((item) => (
//             <Descriptions.Item key={item.key} label={item.label}>
//                 {item.children}
//             </Descriptions.Item>
//         ))}
//     </Descriptions>
// );

// export default FormDetail;


import React, { useEffect, useState } from 'react';
import { Descriptions } from 'antd';
import { getDatabase, ref, child, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';

// const items = [
//     {
//         key: '1',
//         label: 'Name',
//         children: 'Nha Trang University',
//     },
//     {
//         key: '2',
//         label: 'Telephone',
//         children: '1810000000',
//     },
//     {
//         key: '3',
//         label: 'Address',
//         children: '2 Nguyễn Đình Chiểu, Nha Trang, Khánh Hòa',
//     },
//     {
//         key: '4',
//         label: 'University code',
//         children: 'NTU',
//     },
// ];

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

const FormDetail = () => {
    const [universityInfo, setUniversityInfo] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
              const snapshot = await get(child(ref(db), 'University'));
              if (snapshot.exists()) {
                const data = snapshot.val();
                // Chuyển đổi dữ liệu từ object sang mảng
                const infoArray = Object.keys(data).map((key) => ({
                  key: key,
                  label: data[key].label,
                  children: data[key].children,
                }));
                setUniversityInfo(infoArray);
              } else {
                console.log('No data available');
              }
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          };
          fetchData();
    }, [db]);

    return (
        <Descriptions title="University Information" column={2}>
            {universityInfo && universityInfo.map((item) => (
          <Descriptions.Item key={item.key} label={item.label}>
            {item.children}
          </Descriptions.Item>
        ))}
    </Descriptions>
    );
    // <Descriptions title="University Infomation" column={2}>
    //     {items.map((item) => (
    //         <Descriptions.Item key={item.key} label={item.label}>
    //             {item.children}
    //         </Descriptions.Item>
    //     ))}
    // </Descriptions>
};

export default FormDetail;

