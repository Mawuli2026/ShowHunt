import { updateCartCount } from "./Cart.mjs";

const API_URL = "https://fakestoreapi.com";

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const productListEl = document.querySelector(".product-list");

let allProducts = [];

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  // Only run product logic if the list exists on this page
  if (productListEl) {
    loadProducts();
    if (searchInput) searchInput.addEventListener("input", applyFilters);
    if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
  }
});

// Fetch products
async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    allProducts = await res.json();
    renderProducts(allProducts);
    populateCategories(allProducts);
  } catch (err) {
    console.error("Error loading products", err);
    if (productListEl) {
      productListEl.innerHTML = `<p>⚠️ Failed to load products.</p>`;
    }
  }
}

// Render products (now uses anchor links)
function renderProducts(products) {
  if (!productListEl) return;

  if (!products.length) {
    productListEl.innerHTML = `<p>No products found.</p>`;
    return;
  }

  productListEl.innerHTML = products
    .map(
      (product) => `
        <li class="product-card">
          <a href="/product/details.html?id=${product.id}">
            <img src="${product.image}" alt="${product.title}" />
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
          </a>
        </li>
      `,
    )
    .join("");
}

// Populate category dropdown
function populateCategories(products) {
  if (!categoryFilter) return;

  const categories = [...new Set(products.map((p) => p.category))];
  // Reset options except the first default one if you want
  // categoryFilter.innerHTML = `<option value="">All Categories</option>`;
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });
}

// Apply filters
function applyFilters() {
  if (!searchInput || !categoryFilter) return;

  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  let filtered = allProducts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm),
  );

  if (selectedCategory) {
    filtered = filtered.filter((p) => p.category === selectedCategory);
  }

  renderProducts(filtered);
}
