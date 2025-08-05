// src/js/main.js

const API_URL = import.meta.env.VITE_API_URL;

document.addEventListener("DOMContentLoaded", () => {
  console.log("Main.js loaded 🎯");
  loadCategories();
});

/**
 * Fetch and render categories dynamically from the Fake Store API
 */
async function loadCategories() {
  const container = document.querySelector(".category-grid");

  if (!container) return;

  try {
    const response = await fetch(`${API_URL}/products/categories`);
    const categories = await response.json();

    container.innerHTML = categories
      .map((category) => {
        const formatted = formatCategoryLabel(category);
        return `
          <a href="product/index.html?category=${encodeURIComponent(category)}" class="category-card">
            <img src="/assets/images/${getImageForCategory(category)}" alt="${formatted}" />
            <h4>${formatted}</h4>
          </a>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Failed to load categories:", error);
    container.innerHTML = "<p>Failed to load categories.</p>";
  }
}

/**
 * Format category string to a proper label
 */
function formatCategoryLabel(category) {
  return category
    .split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Map categories to image filenames (based on your `/assets/images` folder)
 */
function getImageForCategory(category) {
  const lower = category.toLowerCase();
  if (lower.includes("men")) return "men.png";
  if (lower.includes("women")) return "women.png";
  if (lower.includes("jewel")) return "jewery.png";
  if (lower.includes("elect")) return "electronic.png";
  return "favicon.png"; // fallback image
}
