const API_BASE = import.meta.env.VITE_API_URL;

export async function getProductsByCategory(category) {
  const res = await fetch(`${API_BASE}/products/category/${category}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
}
