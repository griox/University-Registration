import { Badge, Button, Modal, Space, Table } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { firebaseConfig } from './constants/constants';
import { initializeApp } from 'firebase/app';
import { child, get, getDatabase, query, ref, update } from 'firebase/database';
import { addDoc, collection, doc, getFirestore, onSnapshot, orderBy, updateDoc } from 'firebase/firestore';
import 'firebase/firestore';
const Bin = () => {};
export default Bin;
// const Bin = () => {
//     const [l, setL] = useState([]);
//     const [e, setE] = useState([]);
//     const [ino, setIno] = useState(null);

//     const [loading, setLoading] = useState(false);
//     const [open, setOpen] = useState(false);
//     const [mess, setMess] = useState('');
//     const showModal = () => {
//         setOpen(true);
//         if (l.length !== 0) {
//             l.forEach((item) => {
//                 updateDoc(doc(db, 'cities', item.id), {
//                     seen: true,
//                 });
//             });
//         }
//     };
//     const handleOk = () => {
//         setLoading(true);
//         setTimeout(() => {
//             setLoading(false);
//             setOpen(false);
//         }, 3000);
//     };
//     const handleCancel = () => {
//         setOpen(false);
//     };

//     const app = initializeApp(firebaseConfig);
//     // const db = getDatabase(app);
//     const db = getFirestore(app);
//     // setDoc(doc(db, 'cities', 'LA'), {
//     //     name: 'Los Angeles',
//     //     state: 'CA',
//     //     country: 'USA',
//     // });

//     useEffect(() => {
//         const g = () => {
//             onSnapshot(query(collection(db, 'cities'), orderBy('time', 'desc')), (snapshot) => {
//                 const x = snapshot.docs.map(
//                     (doc) =>
//                         // (doc) => console.log(doc.data(), doc.id),
//                         doc,
//                     // (doc) => setE((pre) => [...pre, { data: doc.data(), id: doc.id }]),
//                 );
//                 setE(x.map((item) => item.data()));
//                 setL(x.filter((item) => item.data().seen === false));
//                 // console.log(list);
//                 // setL(list);
//                 // setL(e.filter((item) => item.data.seen === false));
//             });
//             // get(child(ref(db), `Detail/SV398`)).then((snapshot) => {
//             //     if (snapshot.exists()) {
//             //         const x = snapshot.val();
//             //         // Object.values(x)
//             //         //     .map((item) => item)
//             //         //     .forEach((item) => {
//             //         //         setIno((prev) => [...prev, item]);
//             //         //     });
//             //         setIno(x.inotification.nb1 === undefined ? [] : x.inotification.nb1);
//             //     } else {
//             //         console.log('No data available');
//             //     }
//             // });
//             // addDoc(collection(db, 'cities'), {
//             //     name: 'KhanHoa',
//             //     country: 'DienKhanh',
//             // });
//             // console.log('Document written with ID: ' );
//         };
//         g();

//         // const timer = setTimeout(g, 100);
//         // return () => clearTimeout(timer);
//     }, [db, e]);
//     const handleSend = () => {
//         // setDoc(doc(db, 'cities', 'LA'), {
//         //         name: 'Los Angeles',
//         //         state: 'CA',
//         //         country: 'USA',
//         //     });
//         addDoc(collection(db, 'cities'), {
//             name: mess,
//             country: mess,
//             state: mess,
//             time: new Date(),
//             seen: false,
//         });
//     };
//     const handleIdClick = (record) => {
//         setIno(record);
//         setLoad(!load);
//     };
//     const columns = [
//         {
//             title: 'name',
//             dataIndex: 'name',
//             key: 'name',
//             width: '30%',
//             render: (_, record) => (
//                 <span onClick={() => handleIdClick(record)} className="idOnClick">
//                     {record.name}
//                 </span>
//             ),
//         },
//     ];
//     const [load, setLoad] = useState(false);
//     const handleO = () => {
//         setLoad(false);
//     };

//     const handleCance = () => {
//         setLoad(false);
//     };

//     // return (
//     //     <div style={{ marginTop: '50px', cursor: 'pointer' }}>
//     //         <Modal
//     //             open={open}
//     //             title="Title"
//     //             onOk={handleOk}
//     //             onCancel={handleCancel}
//     //             footer={[
//     //                 <Button key="back" onClick={handleCancel}>
//     //                     Return
//     //                 </Button>,
//     //                 <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
//     //                     Submit
//     //                 </Button>,
//     //                 <Button key="link" href="https://google.com" type="primary" loading={loading} onClick={handleOk}>
//     //                     Search on Google
//     //                 </Button>,
//     //             ]}
//     //         >
//     //             {/* {console.log(ino)} */}
//     //             <Modal title="Basic Modal" open={load} onOk={handleO} onCancel={handleCance}>
//     //                 {ino && (
//     //                     <div>
//     //                         <p>Name: {ino.name}</p>
//     //                         <p>Country: {ino.country}</p>
//     //                         <p>State:{ino.state}</p>
//     //                     </div>
//     //                 )}
//     //             </Modal>
//     //             {/* <Table
//     //                 columns={columns}
//     //                 dataSource={e[0]}
//     //                 open={load}
//     //                 onOk=handleIdClick={}
//     //                 pagination={{
//     //                     defaultPageSize: '10',
//     //                     pageSizeOptions: ['10', '20', '40', '100'],
//     //                     showSizeChanger: true,
//     //                     showQuickJumper: true,
//     //                     showTotal: (total) => `Total ${total} items`,
//     //                 }}
//     //                 scroll={{ x: false, y: 'calc(100vh - 580px)' }}
//     //                 bordered
//     //             /> */}
//     //             <Table
//     //                 columns={columns}
//     //                 dataSource={e}
//     //                 pagination={{
//     //                     defaultPageSize: '10',
//     //                     pageSizeOptions: ['10', '20', '40', '100'],
//     //                     showSizeChanger: true,
//     //                     showQuickJumper: true,
//     //                     showTotal: (total) => `Total ${total} items`,
//     //                 }}
//     //                 scroll={{ x: false, y: 'calc(100vh - 580px)' }}
//     //                 bordered
//     //             />
//     //             {/* <p>From: {ino.nb1.from !== undefined ? ino.nb1.date : 'trống'}</p>
//     //         <p>Type: {ino.nb1.type !== undefined ? ino.nb1.type : 'trống'}</p> */}
//     //         </Modal>

//     //         <Badge count={l.length} onClick={showModal}>
//     //             <Space>
//     //                 <BellOutlined style={{ fontSize: '50px' }} />
//     //             </Space>
//     //         </Badge>
//     //         <input onChange={(e) => setMess(e.target.value)} />
//     //         <button onClick={handleSend}> Send</button>
//     //     </div>
//     // );
// };
// const Bin = () => {
//     const app = initializeApp(firebaseConfig);
//     const db = getDatabase(app);
//     const [list, setList] = useState([]);
//     const resetData = () => {
//         get(child(ref(db), `University/`)).then((snapshot) => {
//             if (snapshot.exists()) {
//                 const x = snapshot.val();
//                 setList(Object.values(x).map((item) => item.uniCode));
//             } else {
//                 console.log('No data available');
//             }
//         });
//         get(child(ref(db), `Detail/`)).then((snapshot) => {
//             if (snapshot.exists()) {
//                 const x = snapshot.val();
//                 for (let i in x) {
//                     const listItem = x[i].uniCode.filter((item) => list.includes(item) === true);
//                     update(ref(db, `Detail/` + x[i].id), {
//                         uniCode: listItem,
//                     });
//                 }
//             }
//         });
//     };
//     resetData();
// };

// export default Bin;
