// js/Cart.mjs
export function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

export function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    countEl.textContent = totalItems > 0 ? totalItems : "";
  }
}
