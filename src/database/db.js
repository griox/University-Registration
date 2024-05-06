import firebase from 'firebase/compat/app';
import React, { useEffect, useState } from 'react';
import 'firebase/auth';
import { ref, set, child, getDatabase, onValue, get, remove, update } from 'firebase/database';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import { getStorage, deleteObject } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
function Database(props){
    const [list_item,setList_item]=useState([])
    const [result,setResult]=useState(false)
    const firebaseConfig = {
        apiKey: "AIzaSyD2_evQ7Wje0Nza4txsg5BE_dDSNgmqF3o",
        authDomain: "mock-proeject-b.firebaseapp.com",
        databaseURL: "https://mock-proeject-b-default-rtdb.firebaseio.com",
        projectId: "mock-proeject-b",
        storageBucket: "mock-proeject-b.appspot.com",
        messagingSenderId: "898832925665",
        appId: "1:898832925665:web:bb28598e7c70a0d73188a0"
      };
    //   const x=useState('')
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const db=getDatabase(app)
      function k(){
        if(props.duty==="kt"){
            console.log("qunag")
            getdata(props.email,props.password)
        }
      }
      function getdata(username,password){
        get(child(ref(db), `users/`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const x = snapshot.val();
                    setList_item(Object.values(x).map((user) => user));
                    // Object.values(x).map((user) => user.name===username?setResult(true):setResult(false));
                    console.log(list_item)
                    // if(result){
                    //     alert("Đã tìm thấy")
                    //   }else{
                    //     alert("Chưa tìm thấy")
                    //   }
                } else {
                    console.log('No data available');
                }
            })
            .catch((error) => {
                console.error(error);
            });
      }
    //   useEffect(() => {
    //     get(child(ref(db), `users/`))
    //         .then((snapshot) => {
    //             if (snapshot.exists()) {
    //                 const x = snapshot.val();
    //                 // setTemp(Object.values(x).map((user) => user));
    //             } else {
    //                 console.log('No data available');
    //             }
    //         })
    //         .catch((error) => {
    //             console.error(error);
    //         });
    // }, []);
      function write(username,password,setTemp,setUsername,temp) {
        const id = username;
        const ip = { id: username, password: password };
        set(ref(db, 'users/' + id), ip);
        setTemp([...temp, ip]);
        setUsername('');
    }
    // function dele(job) {
    //     remove(ref(db, 'users/' + job.id))
    //         .then(() => {
    //             alert('xóa thành công');
    //         })
    //         .catch((error) => {
    //             alert('lỗi' + error);
    //         });
    //     setTemp(temp.filter((item) => item !== job));
    // }
    // function upda(idx, job) {
    //     update(ref(db, 'users/' + job.id), {
    //         id: job.id,
    //         name: username,
    //     })
    //         .then(() => {
    //             alert('cập nhập thành công');
    //         })
    //         .catch((error) => {
    //             alert('lỗi' + error);
    //         });
    //     const new_list = [...temp];
    //     new_list[idx].name = username;
    //     setTemp(new_list);
    // }
    // function check() {
    //     const y = temp.filter((item) => item.id === username && item.password === password);
    //     if (y.length !== 0) {
    //         alert('Đã tìm thấy tài khoản');
    //     } else {
    //         alert('Không tìm thấy');
    //     }
    // }
    k()
    
}
export default Database