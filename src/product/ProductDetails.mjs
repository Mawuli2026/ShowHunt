import { getParam } from "../js/utils.mjs";

const API_URL = "https://fakestoreapi.com"; // Replace with your actual API if needed
const productId = getParam("id");

const detailEl = document.getElementById("product-detail");

async function loadProduct() {
  try {
    const res = await fetch(`${API_URL}/products/${productId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const product = await res.json();

    // Build the responsive layout
    detailEl.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}" />
      </div>
      <div class="product-info">
        <h1>${product.title}</h1>
        <p class="price">$${product.price.toFixed(2)}</p>
        <p class="description">${product.description}</p>
        <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    `;

    // Add to cart button listener
    const addToCartBtn = detailEl.querySelector(".add-to-cart");
    addToCartBtn.addEventListener("click", () => {
      addToCart(product);
    });

  } catch (err) {
    detailEl.innerHTML = `<p class="error">⚠️ Error loading product details.</p>`;
    console.error(err);
  }
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("✅ Product added to cart!");
}

loadProduct();
