import { getParam } from "../js/utils.mjs";
import { addToCart } from "../js/Cart.mjs";

const API_URL = "https://fakestoreapi.com";
const productId = getParam("id");

const detailEl = document.getElementById("product-detail");

async function loadProduct() {
  try {
    const res = await fetch(`${API_URL}/products/${productId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const product = await res.json();

    detailEl.innerHTML = `
      <h2>${product.title}</h2>
      <img src="${product.image}" alt="${product.title}" />
      <p>${product.description}</p>
      <p><strong>$${product.price}</strong></p>
      <button id="add-to-cart-btn" class="btn">🛒 Add to Cart</button>
    `;

    // Handle Add to Cart
    document.getElementById("add-to-cart-btn").addEventListener("click", () => {
      addToCart(product);
      alert(`${product.title} added to cart ✅`);
    });

  } catch (err) {
    detailEl.innerHTML = `<p class="error">Error loading product.</p>`;
    console.error(err);
  }
}

loadProduct();

