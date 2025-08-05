import { getParam } from "../js/utils.mjs";

const API_URL = import.meta.env.VITE_API_URL;
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
  if (!Array.isArray(products)) {
    productListEl.innerHTML = "<li>Invalid data.</li>";
    return;
  }

  productListEl.innerHTML = products
    .map(
      (product) => `
      <li class="product-card">
        <img src="${encodeURI(product.image)}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>$${product.price}</p>
      </li>`,
    )
    .join("");
}

loadProductsByCategory(category);
