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
  export function getdt(setListItem,listItem,email,setEmail,password,setPassword,setAnnouce_err){
      function k(val) {
          return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(val) || /w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*/.test(val);
      }
    function i(){

        if(email!==''){
            if(k(email)!==true){
                setAnnouce_err('Incorrect format')
                // annouce_err='Không dúng'
                // alert("k")
                // const temp='Incorrect format'
                // setAnnouce_err(temp)
            
            }else{
    
                if(password!==''){
        
                    get(child(ref(db), `Account/`))
                        .then((snapshot) => {
                            if (snapshot.exists()) {
                                const x = snapshot.val();
                                setListItem(Object.values(x).map((user) => user));
                                const y=listItem.filter(item=>item.id===email&&item.password===password)
                                if(y.length!==0){
                                  
                                    setEmail('')
                                    setPassword('')
                                }else{
                                    setAnnouce_err('Account not found. Please check your email and password again.')
                                    // alert("k t")
                //                     const temp='k t'
                // setAnnouce_err(temp)
                                    // annouce_err='Không thấy'
                                    
                                }
                                
                            } else {
                                console.log('No data available');
                            }
                        })
                        .catch((error) => {
                            console.error(error);
                        });
                }else{
                    setAnnouce_err('Please enter your password')
                    // alert("mk")
                    // const temp='mk'
                // setAnnouce_err(temp)
                // annouce_err='mk'
    
        
                }
            }
        }
        else{
            setAnnouce_err('Please enter your email')
            // alert("em")
            // annouce_err='em'
    
    
        }
    }
    i()
  }

  