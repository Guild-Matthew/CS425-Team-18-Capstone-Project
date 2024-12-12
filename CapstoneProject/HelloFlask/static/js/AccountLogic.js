document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const signupButton = document.getElementById("signupButton");

    if (loginButton) {
        loginButton.addEventListener("click", function () {
            const loginUrl = this.getAttribute("data-url");
            window.location.href = loginUrl;
        });
    }

    if (signupButton) {
        signupButton.addEventListener("click", function () {
            const signUpUrl = this.getAttribute("data-url");
            window.location.href = signUpUrl;
        });
    }

});
