

const API_URL = "https://fakestoreapi.com";

// Optional DOM elements (avoid null errors)
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const productListEl = document.querySelector(".product-list");

// Read category from URL (e.g., ?category=electronics)
const urlParams = new URLSearchParams(window.location.search);
const initialCategory = urlParams.get("category");

let allProducts = [];

// ✅ Fetch products & categories
async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    allProducts = await res.json();
    renderProducts(allProducts);

    // Populate dropdown if it exists
    if (categoryFilter) {
      populateCategories(allProducts);

      // Set initial category from URL
      if (initialCategory) {
        categoryFilter.value = initialCategory;
        applyFilters();
      }
    } else if (initialCategory) {
      // If no dropdown, still filter from URL
      const filtered = allProducts.filter(p => p.category === initialCategory);
      renderProducts(filtered);
    }

  } catch (err) {
    productListEl.innerHTML = `<p class="error">⚠️ Failed to load products.</p>`;
    console.error(err);
  }
}

// ✅ Render products
function renderProducts(products) {
  if (!products.length) {
    productListEl.innerHTML = `<p class="empty">No products found.</p>`;
    return;
  }

  productListEl.innerHTML = products.map(product => `
    <li class="product-card" data-id="${product.id}">
      <img src="${product.image}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
    </li>
  `).join("");

  // Make each product clickable
  document.querySelectorAll(".product-card").forEach(card => {
    card.addEventListener("click", () => {
      window.location.href = `../product-details.html?id=${card.dataset.id}`;
    });
  });
}

// ✅ Populate category dropdown
function populateCategories(products) {
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });
}

// ✅ Apply filters
function applyFilters() {
  let filtered = allProducts;

  if (searchInput) {
    const searchTerm = searchInput.value.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(searchTerm)
    );
  }

  if (categoryFilter && categoryFilter.value) {
    filtered = filtered.filter(p => p.category === categoryFilter.value);
  }

  renderProducts(filtered);
}

// Attach listeners only if elements exist
if (searchInput) searchInput.addEventListener("input", applyFilters);
if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);

// Start
loadProducts();
