const passwordInput = document.querySelector('.pass_login');
const eyeBtn = document.querySelector('.eye');
const passwordInput1 = document.querySelector('.pass_login_1');
const eyeBtn1 = document.querySelector('.eye1');
const passwordInput2 = document.querySelector('.con_pass_login');
const eyeBtn2 = document.querySelector('.eye2');


loginBtn.addEventListener('click', () => {
	loginBtn.style.backgroundColor = "#003865";
	registerBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";

	loginForm.style.left = "50%";
	registerForm.style.left = "-50%";

	loginForm.style.opacity = 1;
	registerForm.style.opacity = 0;

	document.querySelector(".col-1").style.borderRadius = "0 30% 20% 0";
});

registerBtn.addEventListener('click', () => {
	loginBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
	registerBtn.style.backgroundColor = "#003865";

	loginForm.style.left = "150%";
	registerForm.style.left = "50%";

	loginForm.style.opacity = 0;
	registerForm.style.opacity = 1;

	document.querySelector(".col-1").style.borderRadius = "0 20% 30% 0";
});

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