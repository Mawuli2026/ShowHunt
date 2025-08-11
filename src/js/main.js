const API_URL = import.meta.env.VITE_API_URL;

const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const productListEl = document.querySelector(".product-list");

let allProducts = [];

// Fetch products
async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/products`);
    allProducts = await res.json();
    renderProducts(allProducts);
    populateCategories(allProducts);
  } catch (err) {
    console.error("Error loading products", err);
    productListEl.innerHTML = `<p>⚠️ Failed to load products.</p>`;
  }
}

// Render products
function renderProducts(products) {
  if (!products.length) {
    productListEl.innerHTML = `<p>No products found.</p>`;
    return;
  }

  productListEl.innerHTML = products
    .map(
      (product) => `
    <li class="product-card" data-id="${product.id}">
      <img src="${product.image}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
    </li>
  `,
    )
    .join("");

  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => {
      window.location.href = `product-details.html?id=${card.dataset.id}`;
    });
  });
}

// Populate category dropdown
function populateCategories(products) {
  const categories = [...new Set(products.map((p) => p.category))];
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });
}

// Apply filters
function applyFilters() {
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

searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);

loadProducts();
