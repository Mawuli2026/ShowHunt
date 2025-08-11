// js/CartPage.mjs
document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  document.getElementById("clear-cart")?.addEventListener("click", () => {
    localStorage.removeItem("cart");
    renderCart();
  });
});

function renderCart() {
  const cartItemsEl = document.getElementById("cart-items");
  const cartTotalEl = document.getElementById("cart-total");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<li>Your cart is empty 🛒</li>";
    cartTotalEl.textContent = "";
    return;
  }

  let total = 0;

  cartItemsEl.innerHTML = cart.map(item => {
    total += item.price * item.quantity;
    return `
      <li>
        <img src="${item.image}" alt="${item.title}">
        <div class="item-info">
          <div class="item-title">${item.title}</div>
          <div class="item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
        </div>
      </li>
    `;
  }).join("");

  cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
}
