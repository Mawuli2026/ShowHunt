// Replace Vite env with direct value
const API_BASE = "https://fakestoreapi.com"; // change to your actual API

export async function getProductsByCategory(category) {
  const res = await fetch(`${API_BASE}/products/category/${category}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
}
