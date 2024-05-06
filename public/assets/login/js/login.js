const passwordInput = document.querySelector('.pass_login');
const eyeBtn = document.querySelector('.eye');


passwordInput.addEventListener('focus', ()=>{
    if(passwordInput.value.trim() != ''){
        eyeBtn.style.display = "block";
    }

    passwordInput.onkeyup = ()=>{
        let val = passwordInput.value;
        if(val.trim() != ''){
            eyeBtn.style.display = "block";
        }
        else{
            eyeBtn.style.display = "none";
            passwordInput.setAttribute('type','password');
            eyeBtn.classList.remove("fa-eye-slash");
            eyeBtn.classList.add('bx-lock-open-alt');
        }
    }
});

eyeBtn.addEventListener('click', ()=>{
    if(passwordInput.type == "password"){
        passwordInput.setAttribute('type', 'text');
        eyeBtn.classList.remove("bx-lock-open-alt");
        eyeBtn.classList.add('fa-eye-slash');
    }

    else{
        passwordInput.setAttribute('type', 'password');
        eyeBtn.classList.add("bx-lock-open-alt");
        eyeBtn.classList.remove('fa-eye-slash');
    }
});
