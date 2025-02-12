document.addEventListener("DOMContentLoaded", () => {
    const hamburgerMenu = document.getElementById("hamburger-menu");
    const menuOverlay = document.getElementById("menu-overlay");
    const closeMenu = document.getElementById("close-menu");
    const menuList = document.getElementById("menu-list");
    const mealContainer = document.getElementById("meal-container");
    const categoryDetails = document.getElementById("category-details");
    const mealDetailsSection = document.getElementById("meal-details-section");

    async function loadMenuCategories() {
        try {
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
            const data = await response.json();
            const categories = data.categories.slice(0, 12);
            
            menuList.innerHTML = categories.map(cat => 
                `<li class="menu-item" data-category="${cat.strCategory}">
                    ${cat.strCategory}
                </li>`
            ).join("");
        } catch (error) {
            console.error("Error fetching menu categories:", error);
            menuList.innerHTML = "<li>Error loading categories</li>";
        }
    }

    hamburgerMenu.addEventListener("click", () => {
        menuOverlay.classList.add("active");
        loadMenuCategories();
    });

    closeMenu.addEventListener("click", () => {
        menuOverlay.classList.remove("active");
    });
        // Close menu when clicking outside the menu
        document.addEventListener("click", (event) => {
        if (!menuOverlay.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            menuOverlay.classList.remove("active");
        }
    });


    async function fetchCategories(limit) {
        try {
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
            const data = await response.json();
            const categories = data.categories.slice(0, limit);
            
            mealContainer.innerHTML = categories.map(cat => 
                `<div class="meal-card" data-category="${cat.strCategory}">
                    <div class="meal-name">${cat.strCategory.toUpperCase()}</div>
                    <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}">
                </div>`
            ).join("");
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    fetchCategories(14);

    async function fetchCategoryDetails(categoryName) {
        try {
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
            const data = await response.json();
            const category = data.categories.find(cat => cat.strCategory === categoryName);

            if (category) {
                // ✅ Hide "Categories" heading
            const categoriesHeading = document.querySelector(".categories h2");
            if (categoriesHeading) {
                categoriesHeading.style.display = "none";  
            }
                categoryDetails.innerHTML = `
                    <div class="category-box">
                         <h2>${category.strCategory}</h2>
                         <p>${category.strCategoryDescription}</p>
                    </div>
                     <h2 class="meals-heading">MEALS</h2> <!-- Add this heading -->
`;
mealContainer.innerHTML = ""; // Clear previous meals
                fetchMealsByCategory(categoryName);
            }
        } catch (error) {
            console.error("Error fetching category details:", error);
        }
    }

    async function fetchMealsByCategory(categoryName) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`);
            const data = await response.json();
            mealContainer.innerHTML = data.meals.map(meal => `
                <div class="meal-card" data-meal-id="${meal.idMeal}">
                   
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                     <div class="meal-name2">${meal.strMeal}</div>
                </div>
            `).join("");
        } catch (error) {
            console.error("Error fetching meals:", error);
        }
    }

    async function fetchMealDetails(mealId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
        const data = await response.json();
        const meal = data.meals?.[0];

        if (!mealDetailsSection || !mealContainer || !categoryDetails) {
            console.error("One or more required elements are missing in the document.");
            return;
        }

        if (meal) {
            mealContainer.innerHTML = ""; // Clear previous content
            categoryDetails.innerHTML = ""; // Clear category details

            const source = meal.strSource ? `<a href="${meal.strSource}" target="_blank">View Source</a>` : "NA";

            // ✅ Format tags
            const tagsArray = meal.strTags ? meal.strTags.split(",") : [];
            const formattedTags = tagsArray.map(tag => `<span class="tag-box">${tag.trim()}</span>`).join("");

            // ✅ Format Instructions
            const formattedInstructions = meal.strInstructions
                .split("\n")
                .filter(step => step.trim() !== "")
                .map(step => `
                    <li style="display: flex; align-items: center; gap: 10px; text-align: justify;">
                        <span>✅</span>
                        <span>${step}</span>
                    </li>`)
                .join("");

                const mealNavbar = `
    <div class="meal-navbar">
        <span class="home-icon">🏠</span>
        <span class="arrow"> >>> </span> 
        <span class="meal-name">${meal.strMeal}</span> 
    </div>
    <h2 class="meal-heading">Meal Details </h2>
`;


            // ✅ Meal Details Section
            mealDetailsSection.innerHTML = `  
                ${mealNavbar} <!-- Orange Navbar -->
                <div class="meal-details">
                    <div class="meal-container2">
                        <div class="meal-image">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                        </div>
                        <div class="meal-info">
                            <p><strong>Category:</strong> ${meal.strCategory.toUpperCase()}</p>
                            <p><strong>Source:</strong> ${source}</p>
                            <p><strong>Tags:</strong> ${formattedTags || "NA"}</p>
                            <div class="bg">
                                <h3>Ingredients</h3>
                                <ul>${getIngredients(meal)}</ul>
                            </div>
                        </div>
                    </div>
                    <div class="meal-extra-details">
                        <div class="measurements">
                            <h3>Measurements</h3>
                            <ul>${getMeasurements(meal)}</ul>
                        </div>
                        <div class="instructions">
                            <h3>Instructions</h3>
                            <ol>${formattedInstructions}</ol>
                        </div>
                    </div>
                </div>
            `;

            mealDetailsSection.style.display = "block";
            mealDetailsSection.scrollIntoView({ behavior: "smooth", block: "start" });

            fetchCategories(14); // Load category cards again after meal details
        }
    } catch (error) {
        console.error("Error fetching meal details:", error);
    }
}

function getIngredients(meal) {
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `
                <li class="ingredient-item">
                    <span class="ingredient-number">${i}</span>
                    ${meal[`strIngredient${i}`]}
                </li>`;
        }
    }
    return ingredients;
}
function getMeasurements(meal) {
    let measurements = "";
    for (let i = 1; i <= 20; i++) {
        if (meal[`strMeasure${i}`] && meal[`strMeasure${i}`].trim()) {
            measurements += `<li style="display: flex; align-items: center; gap: 10px; color: #e26010;">
                <span>🥄</span> <span>${meal[`strMeasure${i}`]}</span>
            </li>`;
        }
    }
    return measurements;
}
    document.addEventListener("click", (event) => {
        const clickedElement = event.target.closest(".meal-card, .menu-item");

        if (clickedElement) {
            if (clickedElement.hasAttribute("data-category")) {
                const categoryName = clickedElement.getAttribute("data-category");
                fetchCategoryDetails(categoryName);
            } else if (clickedElement.hasAttribute("data-meal-id")) {
                const mealId = clickedElement.getAttribute("data-meal-id");
                fetchMealDetails(mealId);
            }
        }
    });
});

