// Simple login function (store user status in sessionStorage)
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Credential check
    if (username === 'admin' && password === 'password123') {
        // Store the login state in sessionStorage
        sessionStorage.setItem('isLoggedIn', true);
        
        // Redirect to admin panel
        window.location.href = 'admin-dashboard.html';
        return false;
    } else {
        // Show error message
        document.getElementById('error-message').style.display = 'block';
        return false;
    }
}


// Restrict access to admin panel
if (!sessionStorage.getItem('isLoggedIn')) {
    // Redirect to login if not logged in
    window.location.href = 'admin-login.html';
}

// Logout function
function logout() {
    // Clear sessionStorage and redirect to login page
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = 'admin-login.html';
}
