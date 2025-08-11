// product/productListing.mjs
import { addToCart } from "../js/Cart.mjs";

const API_URL = "https://fakestoreapi.com";

// ✅ Only run if we're on the products page
if (document.body.classList.contains("products-page")) {
  const productListEl = document.querySelector(".product-list");

  if (productListEl) {
    loadProducts();
  }

  // Fetch and render products
  async function loadProducts() {
    try {
      const res = await fetch(`${API_URL}/products`);
      const products = await res.json();
      renderProducts(products);
    } catch (err) {
      console.error("Failed to load products:", err);
      productListEl.innerHTML = `<p class="error">⚠️ Could not load products.</p>`;
    }
  }

  // Render products into the list
  function renderProducts(products) {
    if (!products.length) {
      productListEl.innerHTML = `<p class="empty">No products available.</p>`;
      return;
    }

    productListEl.innerHTML = products
      .map(
        (product) => `
        <li class="product-card" data-id="${product.id}">
          <img src="${product.image}" alt="${product.title}" />
          <h3>${product.title}</h3>
          <p>$${product.price}</p>
          <button class="add-to-cart-btn">🛒 Add to Cart</button>
        </li>
      `
      )
      .join("");

    // ✅ Add "Add to Cart" functionality
    document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent card click from firing
        const productId = btn.closest(".product-card").dataset.id;
        const product = products.find((p) => p.id == productId);
        if (product) {
          addToCart(product);
          alert(`${product.title} added to cart ✅`);
        }
      });
    });

    // ✅ Make entire card clickable for product details
    document.querySelectorAll(".product-card").forEach((card) => {
      card.addEventListener("click", () => {
        const productId = card.dataset.id;
        window.location.href = `/product/details.html?id=${productId}`;
      });
    });
  }
}
