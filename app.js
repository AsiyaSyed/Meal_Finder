document.addEventListener("DOMContentLoaded", () => {
    const mealContainer = document.getElementById("meal-container");
    async function fetchCategories(limit, element) {
        try {
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
            const data = await response.json();
            const categories = data.categories.slice(0, limit);
            if (element === mealContainer) {
                element.innerHTML = categories.map(cat => `
                    <div class="meal-card">
                        <div class="meal-name">${cat.strCategory}</div>
                        <img src="${cat.strCategoryThumb}" alt="${cat.strCategory}">
                    </div>
                `).join("");
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }
    fetchCategories(16, mealContainer);
});
