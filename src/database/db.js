// import firebase from 'firebase/compat/app';
import { format } from 'react-string-format';
import 'firebase/auth';
import { ref, child, getDatabase, get} from 'firebase/database';
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
export function getdt(setListItem,listItem,email,setEmail,password,setPassword){
    if(email!==''){
        if(password!==''){

            get(child(ref(db), `Account/`))
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const x = snapshot.val();
                        setListItem(Object.values(x).map((user) => user));
                        const y=listItem.filter(item=>item.id===email&&item.password===password)
                        if(y.length!==0){
                        }else{
                            notification.error({
                                message: 'Account not found',
                                description: 'Please check your email and password again.',
                                placement: 'topLeft',
                            });
                        }
                        
                    } else {
                        console.log('No data available');
                    }
                    setEmail('')
                    setPassword('')
                })
                .catch((error) => {
                    console.error(error);
                });
        }else{
            alert("Please, enter passwrord")
        }
    }else{
        alert("Please, enter email")
    }
  }