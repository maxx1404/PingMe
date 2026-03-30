document.getElementById('signupbutton').addEventListener('click', function(){
    console.log('button clickedjdjdddd')

    let phone=document.getElementById('phoneInput').value
    let password=document.getElementById('passwordInput').value
    let confirmpassword=document.getElementById('confirmpasswordInput').value 

    let isValid=true

    if ((phone.length!==10) || isNaN(phone)) {
        document.getElementById('phoneError').textContent ='enter a valid 10digit number'
        isValid=false
    } else{
        document.getElementById('phoneError').textContent =''
    }

    console.log(isValid)

    if (password.length==0){
        document.getElementById('passwordError').textContent='Password cannot be empty'
        isValid=false;
    }

    if ((password!==confirmpassword)){
        document.getElementById('confirmError').textContent='Password is not matching'
        isValid=false
    } else {
        document.getElementById('confirmError').textContent=''
    }


    if (isValid) {
        localStorage.setItem('user_' + phone, JSON.stringify({
        name: 'User',
        phone: phone,
        password: password
    }));
        localStorage.setItem('currentUserPhone', phone);
        alert('Account created successfully! please login')
        window.location.href = '../html/login.html'
    }
})