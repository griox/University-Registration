const passwordInput1 = document.querySelector('.pass_login_1');
const eyeBtn1 = document.querySelector('.eye1');
const passwordInput2 = document.querySelector('.con_pass_login');
const eyeBtn2 = document.querySelector('.eye2');

passwordInput1.addEventListener('focus', ()=>{
    if(passwordInput1.value.trim() != ''){
        eyeBtn1.style.display = "block";
    }

    passwordInput1.onkeyup = ()=>{
        let val = passwordInput1.value;
        if(val.trim() != ''){
            eyeBtn1.style.display = "block";
        }
        else{
            eyeBtn1.style.display = "none";
            passwordInput1.setAttribute('type','password');
            eyeBtn1.classList.remove("fa-eye-slash");
            eyeBtn1.classList.add('bx-lock-open-alt');
        }
    }
});

eyeBtn1.addEventListener('click', ()=>{
    if(passwordInput1.type == "password"){
        passwordInput1.setAttribute('type', 'text');
        eyeBtn1.classList.remove("bx-lock-open-alt");
        eyeBtn1.classList.add('fa-eye-slash');
    }

    else{
        passwordInput1.setAttribute('type', 'password');
        eyeBtn1.classList.add("bx-lock-open-alt");
        eyeBtn1.classList.remove('fa-eye-slash');
    }
});

passwordInput2.addEventListener('focus', ()=>{
    if(passwordInput2.value.trim() != ''){
        eyeBtn2.style.display = "block";
    }

    passwordInput2.onkeyup = ()=>{
        let val = passwordInput2.value;
        if(val.trim() != ''){
            eyeBtn2.style.display = "block";
        }
        else{
            eyeBtn2.style.display = "none";
            passwordInput2.setAttribute('type','password');
            eyeBtn2.classList.remove("fa-eye-slash");
            eyeBtn2.classList.add('bx-lock-open-alt');
        }
    }
});

eyeBtn2.addEventListener('click', ()=>{
    if(passwordInput2.type == "password"){
        passwordInput2.setAttribute('type', 'text');
        eyeBtn2.classList.remove("bx-lock-open-alt");
        eyeBtn2.classList.add('fa-eye-slash');
    }

    else{
        passwordInput2.setAttribute('type', 'password');
        eyeBtn2.classList.add("bx-lock-open-alt");
        eyeBtn2.classList.remove('fa-eye-slash');
    }
});