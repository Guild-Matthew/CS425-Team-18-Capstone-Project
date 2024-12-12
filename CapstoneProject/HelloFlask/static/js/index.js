document.addEventListener("DOMContentLoaded", function () {
    const dashboardButton = document.getElementById("dashboardButton");

    if (dashboardButton) {
        dashboardButton.addEventListener("click", function () {
            const loginUrl = this.getAttribute("data-url");
            window.location.href = loginUrl;
        });
    }
});

