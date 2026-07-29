document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('captcha-canvas')) generateCaptcha();
    restoreFormData();
});

// --- Dynamic Form Data Saving ---
function saveFormData() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.id && input.type !== 'password' && input.type !== 'button') {
            sessionStorage.setItem(`temp_${input.id}`, input.value);
        }
    });
}

function restoreFormData() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.id && input.type !== 'password') {
            const val = sessionStorage.getItem(`temp_${input.id}`);
            if (val) input.value = val;
        }
    });
}

function navigateTo(url, event) {
    if (event) event.preventDefault();
    saveFormData();
    window.location.href = url;
}

function toggleDisabilityDetail() {
    const status = document.getElementById('disabilitySelect').value;
    const detailInput = document.getElementById('disabilityDetail');
    if (status === 'No') {
        detailInput.value = 'None';
    }
}

// --- CAPTCHA Logic ---
function generateCaptcha() {
    const canvas = document.getElementById('captcha-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let captchaText = '';
    for (let i = 0; i < 6; i++) captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    
    sessionStorage.setItem('captchaAnswer', captchaText);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for(let i = 0; i < 7; i++){
        ctx.strokeStyle = `rgba(${Math.random()*150}, ${Math.random()*150}, ${Math.random()*150}, 0.5)`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
    }
    
    ctx.font = 'bold 26px "Courier New"';
    ctx.textBaseline = "middle";
    for(let i = 0; i < captchaText.length; i++) {
        ctx.save();
        ctx.fillStyle = `rgb(${Math.random()*100}, ${Math.random()*100}, ${Math.random()*100})`;
        ctx.translate(15 + (i * 25), canvas.height / 2);
        ctx.rotate((Math.random() - 0.5) * 0.4);
        ctx.fillText(captchaText[i], 0, 0);
        ctx.restore();
    }
}

function verifyCaptcha(inputValue) {
    return inputValue === sessionStorage.getItem('captchaAnswer');
}

// --- Mock OTP Logic ---
let isEmailVerified = false;
let isPhoneVerified = false;

function sendOTP(type) {
    const fieldId = type === 'email' ? 'email' : 'phone';
    const val = document.getElementById(fieldId).value;
    
    if (!val) {
        alert(`Please enter a valid ${type} first!`);
        return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem(`otp_${type}`, otp);
    
    alert(`[MOCK SYSTEM MESSAGE]\nAn OTP has been sent to ${val}.\n\nYour OTP is: ${otp}`);
    document.getElementById(`${type}-otp-section`).style.display = 'block';
}

function verifyOTP(type) {
    const enteredOTP = document.getElementById(`${type}OTP`).value;
    const correctOTP = sessionStorage.getItem(`otp_${type}`);
    
    if (enteredOTP === correctOTP) {
        document.getElementById(`btn-${type}-verify`).style.display = 'none';
        document.getElementById(`${type}-otp-section`).style.display = 'none';
        document.getElementById(`${type}Success`).style.display = 'block';
        document.getElementById(type).disabled = true;
        
        if(type === 'email') isEmailVerified = true;
        if(type === 'phone') isPhoneVerified = true;
    } else {
        alert("Incorrect OTP. Please try again.");
    }
}

// --- Registration Submit ---
function completeRegistration(event) {
    event.preventDefault();
    const errorMsg = document.getElementById('error-msg');
    errorMsg.style.display = 'none';

    if (!isEmailVerified || !isPhoneVerified) {
        showError("You must verify BOTH your Email and Phone number via OTP before proceeding.");
        return;
    }

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password !== confirmPassword) {
        showError("Passwords do not match!");
        return;
    }

    if (!verifyCaptcha(document.getElementById('captcha').value)) {
        showError("Incorrect CAPTCHA!");
        generateCaptcha(); 
        document.getElementById('captcha').value = ''; 
        return;
    }

    const email = document.getElementById('email').value;
    const name = sessionStorage.getItem('temp_name') || 'Student';
    
    let students = JSON.parse(localStorage.getItem('students')) || [];
    if (students.find(s => s.email === email)) {
        showError("This email is already registered in our system!");
        return;
    }

    students.push({ name, email, password });
    localStorage.setItem('students', JSON.stringify(students));
    sessionStorage.clear();

    alert("Registration Complete! You may now login.");
    window.location.href = 'index.html';
}

function showError(msg) {
    const errorMsg = document.getElementById('error-msg');
    errorMsg.innerText = msg;
    errorMsg.style.display = 'block';
}

// --- Login Logic ---
function handleLogin(event) {
    event.preventDefault();
    document.getElementById('error-msg').style.display = 'none';

    if (!verifyCaptcha(document.getElementById('captcha').value)) {
        showError("Incorrect CAPTCHA!");
        generateCaptcha();
        document.getElementById('captcha').value = '';
        return;
    }

    let students = JSON.parse(localStorage.getItem('students')) || [];
    let user = students.find(s => 
        s.email === document.getElementById('email').value && 
        s.password === document.getElementById('password').value
    );

    if (user) {
        alert(`Login successful! Welcome back, ${user.name}.`);
        window.location.reload(); 
    } else {
        showError("Invalid email or password!");
        generateCaptcha();
        document.getElementById('captcha').value = '';
    }
}
