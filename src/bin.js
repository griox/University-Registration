import { initializeApp } from 'firebase/app';
import { child, get, getDatabase, push, ref, remove, update } from 'firebase/database';
import { useState } from 'react';
import { toast } from 'react-toastify';

// import { Avatar } from '@mui/material';
// import { initializeApp } from 'firebase/app';
// import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
// import { useState } from 'react';

function Bin() {
    const [listUni, setListUni] = useState([]);
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

    const a = () => {
        // get(child(ref(db), `University/`)).then((snapshot) => {
        //     if (snapshot.exists()) {
        //         const x = snapshot.val();
        //         for (let i in x) {
        // let size = Object.keys(x[i].registeration).length;
        // const y = x[i].uniCode + '/' + 'Target';
        // console.log(y);
        // remove(ref(db, 'University/' + y));
        //         }
        //     }
        // });
        // get(child(ref(db), `Detail/`)).then((snapshot) => {
        //     if (snapshot.exists()) {
        //         const x = snapshot.val();
        //         // setListUni(Object.values(x).map((user) => user.uniCode));
        //         for (let i in x) {
        //             update(ref(db, `Account/` + x[i].email.replace(/\./g, ',')), {
        //                 name: x[i].name,
        //             });
        //         }
        //     }
        // });
        // get(child(ref(db), `Detail/`)).then((snapshot) => {
        //     if (snapshot.exists()) {
        //         const x = snapshot.val();
        //         for (let i in x) {
        //             const name = x[i].email;
        //             const id = x[i].id;
        //             const a = x[i].uniCode;
        //             if (a !== undefined) {
        //                 a.forEach((element) => {
        //                     if (listUni.includes(element)) {
        //                         update(ref(db, `University/${element}/registeration/` + name.replace(/\./g, ',')), {
        //                             id: id,
        //                             email: name,
        //                         });
        //                     }
        //                     // console.log('thành công');/
        //                 });
        //             }
        //         }
        //     } else {
        //         console.log('No data available');
        //     }
        // });
    };

    a();
}
export default Bin;
// function Upload() {
//     const [image, setImage] = useState(null);
//     const [url, setUrl] = useState(null);
//     const firebaseConfig = {
//         apiKey: 'AIzaSyD2_evQ7Wje0Nza4txsg5BE_dDSNgmqF3o',
//         authDomain: 'mock-proeject-b.firebaseapp.com',
//         databaseURL: 'https://mock-proeject-b-default-rtdb.firebaseio.com',
//         projectId: 'mock-proeject-b',
//         storageBucket: 'mock-proeject-b.appspot.com',
//         messagingSenderId: '898832925665',
//         appId: '1:898832925665:web:bb28598e7c70a0d73188a0',
//     };
//     const app = initializeApp(firebaseConfig);

//     const db = getStorage(app);
//     const handleImgChange = (e) => {
//         if (e.target.files[0]) {
//             setImage(e.target.files[0]);
//         }
//     };
//     const handleSubmit = () => {
//         uploadBytes(ref(db, 'image'), image)
//             .then(() => {
//                 getDownloadURL(ref(db, 'image'))
//                     .then((url) => {
//                         setUrl(url);
//                     })
//                     .catch((error) => {
//                         console.log(error.message, 'Error');
//                     });
//                 setImage(null);
//             })
//             .catch((error) => {
//                 console.log(error.message, 'Error');
//             });
//     };
//     return (
//         <div className="App">
//             <Avatar alt="Remy Sharp" src={url} sx={{ width: 100, height: 100 }} />
//             <input type="file" onChange={handleImgChange} />
//             <button onClick={handleSubmit}>Submit</button>
//         </div>
//     );
// }

// export default Upload;

// import React, { useState } from 'react';
// import { CameraOutlined } from '@ant-design/icons';
// import { Avatar } from 'antd'; // Assuming you're using Ant Design's Avatar component
// // Assuming you save the CSS in this file
// import '../src/bin.css';
// const MyAvatar = () => {
//     const [image, setImage] = useState('');

//     const handleImgChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setImage(e.target.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     return (
//         <div className="avatar-container">
//             <Avatar alt="Remy Sharp" src={image} className="avatar-img" />
//             <div className="avatar-hover" onClick={() => document.getElementById('fileInput').click()}>
//                 <CameraOutlined />
//             </div>
//             <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleImgChange} />
//         </div>
//     );
// };

// export default MyAvatar;
