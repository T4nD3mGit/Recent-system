// Protect admin pages
if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("login.html");
}

function logout() {
    sessionStorage.removeItem("isLoggedIn");
    window.location.replace("login.html");
}