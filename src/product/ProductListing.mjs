import { getParam } from "../js/utils.mjs";
import { addToCart } from "../js/Cart.mjs"; // Make sure this is imported!

// Hardcode API URL for vanilla deployment
const API_URL = "https://fakestoreapi.com"; // replace with your actual API

const category = getParam("category") || "electronics";
const productListEl = document.getElementById("product-list");

async function loadProductsByCategory(category) {
  try {
    const res = await fetch(`${API_URL}/products/category/${category}`);
    const data = await res.json();
    console.log("Fetched data:", data);
    renderProducts(data);
  } catch (err) {
    productListEl.innerHTML = `<li>Error: ${err.message}</li>`;
    console.error("Fetch failed:", err);
  }
}

function renderProducts(products) {
  const template = document.getElementById("product-template");
  productListEl.innerHTML = "";

  products.forEach((product) => {
    const clone = template.content.cloneNode(true);
    const img = clone.querySelector("img");
    const title = clone.querySelector(".title");
    const price = clone.querySelector(".price");

    img.src = product.image;
    img.alt = product.title;
    title.textContent = product.title;
    price.textContent = `$${product.price}`;

    // ✅ Create "Add to Cart" button per product
    const btn = document.createElement("button");
    btn.textContent = "Add to Cart";
    btn.classList.add("add-to-cart-btn");

    btn.addEventListener("click", () => {
      addToCart(product);
      alert(`${product.title} added to cart`);
    });

    // Append the button inside the product card
    clone.querySelector(".product-card")?.appendChild(btn);

    // ✅ Wrap the product card in a clickable link (optional)
    const link = document.createElement("a");
    link.href = `/product/details.html?id=${product.id}`;
    link.appendChild(clone);

    productListEl.appendChild(link);
  });
}

loadProductsByCategory(category);
