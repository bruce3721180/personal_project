// ===== Login Modal 開關 =====
document.addEventListener("DOMContentLoaded", function () {

    const loginBtn = document.querySelector(".nav__login-btn");
    const loginOverlay = document.getElementById("loginOverlay");
    const loginClose = document.getElementById("loginClose");

    loginBtn.addEventListener("click", function (e) {
        e.preventDefault();
        loginOverlay.style.display = "flex";
    });

    loginClose.addEventListener("click", function () {
        loginOverlay.style.display = "none";
    });

    loginOverlay.addEventListener("click", function (e) {
        if (e.target === loginOverlay) {
            loginOverlay.style.display = "none";
        }
    });
});
