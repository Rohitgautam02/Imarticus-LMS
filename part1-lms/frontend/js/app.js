// ============================================
// Shared app utilities and auth helpers
// ============================================

var API_BASE = '/api';

// get stored token
function getToken() {
    return localStorage.getItem('lms_token');
}

// get stored user info
function getUser() {
    var userStr = localStorage.getItem('lms_user');
    if (userStr) {
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// save auth data
function saveAuth(token, user) {
    localStorage.setItem('lms_token', token);
    localStorage.setItem('lms_user', JSON.stringify(user));
}

// clear auth data
function clearAuth() {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
}

// check if user is logged in
function isLoggedIn() {
    return getToken() !== null;
}

// redirect to login if not logged in
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = '/login.html';
        return false;
    }
    
    // enforce payment for protected pages
    var user = getUser();
    var path = window.location.pathname;
    if (user && !user.hasPaid && user.role !== 'admin' && path !== '/payment.html') {
        window.location.href = '/payment.html';
        return false;
    }
    
    return true;
}

// redirect to dashboard if already logged in
function redirectIfLoggedIn() {
    if (isLoggedIn()) {
        var user = getUser();
        if (user && !user.hasPaid && user.role !== 'admin') {
            // Wait, actually if they're on login page but haven't paid, send to payment page!
            window.location.href = '/payment.html';
        } else {
            window.location.href = '/index.html';
        }
    }
}

// logout
function logout() {
    clearAuth();
    window.location.href = '/login.html';
}

// make authenticated API request
async function fetchWithAuth(url, options) {
    var token = getToken();
    if (!options) options = {};
    if (!options.headers) options.headers = {};

    if (token) {
        options.headers['Authorization'] = 'Bearer ' + token;
    }

    // only set content-type for non-FormData requests
    if (options.body && !(options.body instanceof FormData)) {
        options.headers['Content-Type'] = 'application/json';
    }

    var response = await fetch(API_BASE + url, options);

    // if token is invalid, logout
    if (response.status === 401) {
        clearAuth();
        window.location.href = '/login.html';
        return null;
    }

    return response;
}

// render the header/nav bar
function renderHeader() {
    var user = getUser();
    var header = document.getElementById('site-header');

    if (!header) return;

    var navHtml = '';
    if (isLoggedIn() && user) {
        navHtml = '<nav>'
            + '<a href="/index.html">Courses</a>'
            + '<a href="/documents.html">Documents</a>'
            + '<a href="/payment.html">Payment</a>'
            + '<div class="user-info">'
            + '<span class="user-name">' + user.name + '</span>'
            + '<button class="btn btn-sm btn-secondary" onclick="logout()">Logout</button>'
            + '</div>'
            + '</nav>';
    } else {
        navHtml = '<nav>'
            + '<a href="/login.html">Login</a>'
            + '<a href="/register.html">Register</a>'
            + '<a href="/payment.html">Payment</a>'
            + '</nav>';
    }

    header.innerHTML = '<div class="logo">IMARTICUS <span>LMS</span></div>' + navHtml;
}

// show an alert message
function showAlert(containerId, message, type) {
    var container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '<div class="alert alert-' + type + '">' + message + '</div>';

    // auto-clear after 5 seconds
    setTimeout(function() {
        container.innerHTML = '';
    }, 5000);
}

// format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// format date
function formatDate(dateStr) {
    var d = new Date(dateStr);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}
