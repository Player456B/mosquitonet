// Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initLoginForms();
    initPasswordToggle();
});

// ===== LOGIN FORMS =====
function initLoginForms() {
    // Customer Login
    const customerForm = document.getElementById('customerLoginForm');
    if (customerForm) {
        customerForm.addEventListener('submit', handleCustomerLogin);
    }
    
    // Dealer Login
    const dealerForm = document.getElementById('dealerLoginForm');
    if (dealerForm) {
        dealerForm.addEventListener('submit', handleDealerLogin);
    }
    
    // Admin Login
    const adminForm = document.getElementById('adminLoginForm');
    if (adminForm) {
        adminForm.addEventListener('submit', handleAdminLogin);
    }
}

function handleCustomerLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.querySelector('input[type="checkbox"]')?.checked || false;
    
    // Simple validation
    if (!email || !password) {
        showToast('Please fill in all fields');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Please enter a valid email address');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters');
        return;
    }
    
    // Simulate login
    showToast('Logging in...');
    
    setTimeout(() => {
        // Here you would normally redirect to dashboard
        showToast('Login successful! Redirecting...');
        
        // Simulate redirect
        setTimeout(() => {
            window.location.href = 'customer-dashboard.html';
        }, 1500);
    }, 1500);
}

function handleDealerLogin(e) {
    e.preventDefault();
    
    const dealerId = document.getElementById('dealerId').value;
    const password = document.getElementById('dealerPassword').value;
    const dealerCode = document.getElementById('dealerCode')?.value || '';
    
    if (!dealerId || !password) {
        showToast('Please fill in all required fields');
        return;
    }
    
    showToast('Accessing dealer portal...');
    
    setTimeout(() => {
        showToast('Login successful!');
        
        setTimeout(() => {
            window.location.href = 'dealer-dashboard.html';
        }, 1500);
    }, 1500);
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const adminKey = document.getElementById('adminKey').value;
    
    if (!username || !password || !adminKey) {
        showToast('Please fill in all fields');
        return;
    }
    
    showToast('Verifying admin credentials...');
    
    setTimeout(() => {
        showToast('Access granted! Loading admin panel...');
        
        setTimeout(() => {
            window.location.href = 'admin-dashboard.html';
        }, 1500);
    }, 1500);
}

// ===== PASSWORD TOGGLE =====
function initPasswordToggle() {
    // Make togglePassword function available globally
    window.togglePassword = function(fieldId) {
        const field = document.getElementById(fieldId);
        const toggleBtn = field.nextElementSibling;
        
        if (field.type === 'password') {
            field.type = 'text';
            toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        } else {
            field.type = 'password';
            toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        }
    };
}

// ===== REGISTRATION FORM =====
function initRegistrationForm() {
    const regForm = document.getElementById('registrationForm');
    
    if (regForm) {
        regForm.addEventListener('submit', handleRegistration);
    }
}

function handleRegistration(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate all fields
    if (!name || !email || !phone || !password || !confirmPassword) {
        showToast('Please fill in all fields');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Please enter a valid email');
        return;
    }
    
    if (!validatePhone(phone)) {
        showToast('Please enter a valid phone number');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match');
        return;
    }
    
    showToast('Creating your account...');
    
    setTimeout(() => {
        showToast('Registration successful! Please login.');
        
        setTimeout(() => {
            window.location.href = 'customer-login.html';
        }, 1500);
    }, 1500);
}

// ===== LOGOUT =====
function logout() {
    showToast('Logging out...');
    
    setTimeout(() => {
        // Clear any stored session data
        localStorage.removeItem('userToken');
        sessionStorage.removeItem('userToken');
        
        window.location.href = '../index.html';
    }, 1000);
}

window.logout = logout;

// ===== PASSWORD RESET =====
function initPasswordReset() {
    const resetForm = document.getElementById('resetPasswordForm');
    
    if (resetForm) {
        resetForm.addEventListener('submit', handlePasswordReset);
    }
}

function handlePasswordReset(e) {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    
    if (!email) {
        showToast('Please enter your email');
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Please enter a valid email');
        return;
    }
    
    showToast('Sending reset instructions...');
    
    setTimeout(() => {
        showToast('Reset link sent! Check your email.');
        
        setTimeout(() => {
            window.location.href = 'customer-login.html';
        }, 2000);
    }, 1500);
}
