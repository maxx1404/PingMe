document.getElementById('loginbutton').addEventListener('click',function() {
    console.log('yesss')

    let phonenumber=document.getElementById('phoneInput').value

    console.log(phonenumber)
    let isValid = true

    if (phonenumber.length !== 10 || isNaN(phonenumber)) {
        document.getElementById('phoneError').textContent = 'Enter a valid 10 digit number'
        isValid = false
    }

    let login_password = document.getElementById('passwordInput').value

    let user = JSON.parse(localStorage.getItem('user_' + phonenumber));
    if (!user) {
        alert('No account found! Please sign up.');
        return;
    }
    if (user.password !== login_password) {
        document.getElementById('passwordError').textContent = 'Wrong password!';
        isValid = false;
    }
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUserPhone', phonenumber);

    if (isValid) {
        alert('Phone Number logged in successfully')


        let otp = Math.floor(1000 + Math.random() * 9000)


        document.getElementById('otpStep').style.display='block'
        document.getElementById('loginbutton').style.display='none'
        document.querySelector('.login-link').style.display = 'none'
        alert('yYour OTP is: ' + otp)

        document.getElementById('verifyOtpBtn').addEventListener('click', function() {
            let userOtp = document.getElementById('otpInput').value

            if (userOtp == otp) {
                localStorage.setItem('isLoggedIn', 'true')
                localStorage.setItem('currentUserPhone',phonenumber)
                alert('Logged in succesfully')
                window.location.href= '../html/index.html'
            } else {
                document.getElementById('otpError').textContent = 'Wrong OTP, try again'
            }
        })
    
    } 
})
