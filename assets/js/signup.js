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

    if ((password!==confirmpassword) || isNaN(password)){
        document.getElementById('confirmError').textContent='Password is not matching'
        isValid=false
    } else {
        document.getElementById('confirmError').textContent=''
    }

    localStorage.setItem('phone_number',phone)
    localStorage.setItem('password',password)

    if (isValid) {
        alert('Account created successfully! please login')
        window.location.href = '../html/login.html'
    }
})