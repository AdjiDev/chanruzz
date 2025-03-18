// theme.js
document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("theme-toggle");

    // Check for saved theme preference
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.textContent = "☀️";
    }

    // Toggle theme on button click
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        // Update button text based on theme
        if (document.body.classList.contains("dark-mode")) {
            themeToggle.textContent = "☀️";
            localStorage.setItem("theme", "dark");
        } else {
            themeToggle.textContent = "🌙";
            localStorage.setItem("theme", "light");
        }
    });
});
