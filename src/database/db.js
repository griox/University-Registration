import firebase from 'firebase/compat/app';
import 'firebase/auth';
import { ref, set, child, getDatabase, onValue, get, remove, update } from 'firebase/database';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { notification } from 'antd';
const firebaseConfig = {
    apiKey: "AIzaSyD2_evQ7Wje0Nza4txsg5BE_dDSNgmqF3o",
    authDomain: "mock-proeject-b.firebaseapp.com",
    databaseURL: "https://mock-proeject-b-default-rtdb.firebaseio.com",
    projectId: "mock-proeject-b",
    storageBucket: "mock-proeject-b.appspot.com",
    messagingSenderId: "898832925665",
    appId: "1:898832925665:web:bb28598e7c70a0d73188a0"
  };
 

  const app = initializeApp(firebaseConfig);
  const db=getDatabase(app)
export function getdt(setListItem,listItem,email,password){
    
    get(child(ref(db), `Account/`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const x = snapshot.val();
                setListItem(Object.values(x).map((user) => user));
                // Object.values(x).map((user) => user.name===username?setResult(true):setResult(false));
                console.log(listItem)
                const y=listItem.filter(item=>item.id===email&&item.password===password)
                if(y.length!==0){
                    alert("Login sucess")
                }else{
                    notification.error({
                        message: 'Không tìm thấy tài khoản',
                        description: 'Vui lòng kiểm tra lại email và mật khẩu.',
                        placement: 'topLeft',
                      });
                }
            } else {
                console.log('No data available');
            }
        })
        .catch((error) => {
            console.error(error);
        });
  }