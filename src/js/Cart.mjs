export function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + (product.quantity || 1);
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: product.quantity || 1
    });
  }
  saveCart(cart);
}

export function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((s, it) => s + (it.quantity || 1), 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = total > 0 ? total : "";
}
