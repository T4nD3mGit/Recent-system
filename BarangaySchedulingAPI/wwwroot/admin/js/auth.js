// Redirect if not logged in
if (sessionStorage.getItem("isLoggedIn") !== "true") {
    window.location.replace("login.html");
}

function logout() {

    sessionStorage.removeItem("isLoggedIn");

    window.location.replace("login.html");
}

// Prevent going back
window.history.pushState(null, "", window.location.href);

window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
};