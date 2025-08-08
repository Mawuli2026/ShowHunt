import { getCart, removeFromCart } from "/js/Cart.mjs";

const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

function renderCart() {
  const cart = getCart();
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty-cart">🛒 Your cart is empty.</p>`;
    cartTotalEl.textContent = "";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("product-card");

    li.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <h3>${item.title}</h3>
      <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
      <button class="remove-btn">Remove</button>
    `;

    // Remove item event
    li.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromCart(item.id);
      renderCart();
    });

    cartItemsEl.appendChild(li);
    total += item.price * item.quantity;
  });

  cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
}

renderCart();
