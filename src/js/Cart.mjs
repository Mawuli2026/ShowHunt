// cart.mjs
const CART_KEY = "showhunt-cart";

// ✅ Get cart from localStorage safely
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

// ✅ Save cart to localStorage
export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ✅ Add item to cart
export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  console.log(`🛒 Added to cart: ${product.title}`);
}

// ✅ Remove item by ID
export function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
  console.log(`❌ Removed from cart: ${id}`);
}

// ✅ Clear all cart items
export function clearCart() {
  localStorage.removeItem(CART_KEY);
  console.log("🛒 Cart cleared");
}
