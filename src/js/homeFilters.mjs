document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("home-search");
  const sel = document.getElementById("home-category-filter");
  const cards = [...document.querySelectorAll(".category-card")];

  function apply() {
    const term = search?.value.trim().toLowerCase() || "";
    const cat = sel?.value || "";
    cards.forEach(card => {
      const title = card.dataset.title.toLowerCase();
      const category = card.dataset.category.toLowerCase();
      const match = (!term || title.includes(term) || category.includes(term)) && (!cat || category === cat);
      card.style.display = match ? "" : "none";
    });
  }
  search?.addEventListener("input", apply);
  sel?.addEventListener("change", apply);
});
