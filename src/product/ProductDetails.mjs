import { getParam } from "../js/utils.mjs";
const API_URL = import.meta.env.VITE_API_URL;
const productId = getParam("id");

const detailEl = document.getElementById("product-detail");

async function loadProduct() {
  try {
    const res = await fetch(`${API_URL}/products/${productId}`);
    const product = await res.json();

    detailEl.innerHTML = `
      <h2>${product.title}</h2>
      <img src="${product.image}" alt="${product.title}" />
      <p>${product.description}</p>
      <p><strong>$${product.price}</strong></p>
    `;
  } catch (err) {
    detailEl.innerHTML = "Error loading product.";
    console.error(err);
  }
}

loadProduct();
