document.addEventListener("DOMContentLoaded", () => {
    const hamburgerMenu = document.getElementById("hamburger-menu");
    const menuOverlay = document.getElementById("menu-overlay");
    const closeMenu = document.getElementById("close-menu");
    const menuList = document.getElementById("menu-list");

    function fetchCategories() {
        fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
            .then(response => response.json())
            .then(data => {
                menuList.innerHTML = data.categories.slice(0, 14).map(category => 
                    `<li>${category.strCategory}</li>`
                ).join("");
            })
            .catch(error => console.error("Error fetching categories:", error));
    }

    hamburgerMenu.addEventListener("click", () => {
        fetchCategories();
        menuOverlay.classList.add("active");
    });

    closeMenu.addEventListener("click", () => {
        menuOverlay.classList.remove("active");
    });

    document.addEventListener("click", (event) => {
        if (!menuOverlay.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            menuOverlay.classList.remove("active");
        }
    });
});
