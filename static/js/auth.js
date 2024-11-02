// For the login form
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    if (!validateLoginForm()) {
        event.preventDefault();  
    }
});

document.getElementById('email')?.addEventListener('input', toggleLoginButton);
document.getElementById('password')?.addEventListener('input', toggleLoginButton);

// For the signup form
document.getElementById('signupForm')?.addEventListener('submit', function(event) {
    if (!validateSignupForm()) {
        event.preventDefault();  
    }
});

document.getElementById('signupEmail')?.addEventListener('input', toggleSignupButton);
document.getElementById('signupPassword')?.addEventListener('input', toggleSignupButton);

// Form validation logic
function validateLoginForm() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    return validateEmail(email) && validatePassword(password);
}

function validateSignupForm() {
    const email = document.getElementById('signupEmail').value;
    const newPassword = document.getElementById('newPassword').value;
    const password = document.getElementById('signupPassword').value;

    return validateEmail(email) && validatePassword(password,newPassword);
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Password validation
function validatePassword(password, newPassword = null) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (newPassword !== null) {
        return passwordRegex.test(password) && passwordRegex.test(newPassword) && (password === newPassword);
    }
    return passwordRegex.test(password);
}


function toggleLoginButton() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginButton = document.getElementById('loginBtn');

    if (validateEmail(email) && validatePassword(password)) {
        loginButton.disabled = false;
        loginButton.style.opacity = 1;
    } else {
        loginButton.disabled = true;
    }
}

function toggleSignupButton() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('newPassword').value;
    const signupButton = document.getElementById('signupBtn');
    const passwordError = document.getElementById('passwordError');

    if (validateEmail(email) && validatePassword(password, confirmPassword)) {
        signupButton.disabled = false;
        signupButton.style.opacity = 1;
        passwordError.style.display = 'none';
    } else {
        signupButton.disabled = true;
        signupButton.style.opacity = 0.5;
        passwordError.style.display = 'block';
        passwordError.textContent = 'Passwords must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character';
    }
}

