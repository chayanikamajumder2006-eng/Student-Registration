// Stores the currently generated CAPTCHA code
let generatedCaptcha = "";

/*
    Generate a random CAPTCHA when the page loads
*/
window.addEventListener("DOMContentLoaded", function () {
    generateCaptcha();
});

/*
    Generate a random CAPTCHA code
*/
function generateCaptcha() {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    generatedCaptcha = "";

    // Generate a six-character CAPTCHA
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        generatedCaptcha += characters[randomIndex];
    }

    drawCaptcha(generatedCaptcha);

    // Clear the old CAPTCHA input
    document.getElementById("captcha").value = "";

    hideMessages();
}

/*
    Draw the CAPTCHA on the canvas
*/
function drawCaptcha(captchaText) {
    const canvas = document.getElementById("captcha-canvas");
    const context = canvas.getContext("2d");

    // Gradient background
    const gradient = context.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
    );

    gradient.addColorStop(0, "#eef2ff");
    gradient.addColorStop(0.5, "#faf5ff");
    gradient.addColorStop(1, "#fdf2f8");

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw random security lines
    for (let i = 0; i < 7; i++) {
        context.beginPath();

        context.moveTo(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        );

        context.lineTo(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        );

        context.strokeStyle = getRandomColor();
        context.lineWidth = 1;

        context.stroke();
    }

    // Draw random security dots
    for (let i = 0; i < 35; i++) {
        context.beginPath();

        context.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 2,
            0,
            Math.PI * 2
        );

        context.fillStyle = getRandomColor();
        context.fill();
    }

    // Draw CAPTCHA characters
    context.font = "bold 28px Poppins";
    context.textBaseline = "middle";

    const characterSpacing = 27;
    const startingPosition = 17;

    for (let i = 0; i < captchaText.length; i++) {
        context.save();

        const xPosition = startingPosition + i * characterSpacing;
        const yPosition = canvas.height / 2;

        context.translate(xPosition, yPosition);

        // Apply a small random rotation
        const rotation = (Math.random() - 0.5) * 0.4;
        context.rotate(rotation);

        context.fillStyle = getRandomDarkColor();

        context.fillText(captchaText[i], 0, 0);

        context.restore();
    }
}

/*
    Return random light or medium color
*/
function getRandomColor() {
    const colors = [
        "#6366f1",
        "#8b5cf6",
        "#ec4899",
        "#06b6d4",
        "#f59e0b"
    ];

    return colors[Math.floor(Math.random() * colors.length)];
}

/*
    Return random dark color for CAPTCHA text
*/
function getRandomDarkColor() {
    const colors = [
        "#1e3a8a",
        "#4c1d95",
        "#831843",
        "#164e63",
        "#78350f"
    ];

    return colors[Math.floor(Math.random() * colors.length)];
}

/*
    Show or hide the password
*/
function togglePassword() {
    const passwordInput = document.getElementById("password");
    const passwordButton = document.querySelector(".password-toggle");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordButton.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        passwordButton.textContent = "👁";
    }
}

/*
    Handle login form submission
*/
function handleLogin(event) {
    event.preventDefault();

    hideMessages();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const enteredCaptcha = document.getElementById("captcha").value.trim();

    // Check email format
    if (!isValidEmail(email)) {
        showError("Please enter a valid registered email address.");
        return;
    }

    // Check password length
    if (password.length < 6) {
        showError("Password must contain at least 6 characters.");
        return;
    }

    // Check CAPTCHA
    if (enteredCaptcha !== generatedCaptcha) {
        showError("Incorrect security code. Please try again.");
        generateCaptcha();
        return;
    }

    // Successful login
    showSuccess("Login successful! Welcome to the Student Portal.");

    // Clear the password and CAPTCHA fields
    document.getElementById("password").value = "";
    document.getElementById("captcha").value = "";

    // Generate a new CAPTCHA
    setTimeout(generateCaptcha, 2000);
}

/*
    Validate email address
*/
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

/*
    Show error message
*/
function showError(message) {
    const errorMessage = document.getElementById("error-msg");

    errorMessage.textContent = message;
    errorMessage.style.display = "block";
}

/*
    Show success message
*/
function showSuccess(message) {
    const successMessage = document.getElementById("success-msg");

    successMessage.textContent = message;
    successMessage.style.display = "block";
}

/*
    Hide all messages
*/
function hideMessages() {
    const errorMessage = document.getElementById("error-msg");
    const successMessage = document.getElementById("success-msg");

    errorMessage.style.display = "none";
    successMessage.style.display = "none";

    errorMessage.textContent = "";
    successMessage.textContent = "";
}
