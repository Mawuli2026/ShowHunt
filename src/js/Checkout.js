document.addEventListener("DOMContentLoaded", () => {
  loadCountries();
  loadNews();
  initCheckoutForm();
});

/**
 * Load country options from REST Countries API
 */
async function loadCountries() {
  const countrySelect = document.getElementById("country");

  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2",
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json(); 

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format from REST Countries");
    }

    // Sort by country name
    data.sort((a, b) => a.name.common.localeCompare(b.name.common));

    // Populate dropdown
    data.forEach((country) => {
      const option = document.createElement("option");
      option.value = country.cca2;
      option.textContent = country.name.common;
      countrySelect.appendChild(option);
    });
  } catch (err) {
    console.error("Countries load failed", err);
    countrySelect.innerHTML = `<option value="">⚠️ Failed to load countries</option>`;
  }
}

/**
 * Load latest news using GNews API via Netlify function
 */
async function loadNews() {
  const newsPanel = document.getElementById("news-panel");

  try {
    const res = await fetch("/.netlify/functions/gnews");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error("Invalid news data format");
    }

    renderNews(data.articles);
  } catch (err) {
    console.warn("GNews fetch proxy failed, trying fallback:", err);
    // Try fallback public API (no API key)
    try {
      const res = await fetch(
        "https://gnews.io/api/v4/top-headlines?category=technology&lang=en&country=us&max=5&apikey=demo",
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      if (!data.articles || !Array.isArray(data.articles)) {
        throw new Error("Invalid fallback news data format");
      }

      renderNews(data.articles);
    } catch (fallbackErr) {
      console.error("Fallback news fetch failed", fallbackErr);
      newsPanel.innerHTML = `<p class="error">⚠️ Failed to load news</p>`;
    }
  }
}

function renderNews(articles) {
  const newsPanel = document.getElementById("news-panel");
  newsPanel.innerHTML = articles
    .map(
      (a) => `
      <div class="news-item">
        <a href="${a.url}" target="_blank">${a.title}</a>
      </div>
    `,
    )
    .join("");
}

/**
 * Initialize checkout form validation
 */
function initCheckoutForm() {
  const form = document.getElementById("checkout-form");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const address = form.querySelector("#address").value.trim();
    const country = form.querySelector("#country").value.trim();

    if (!name || !email || !address || !country) {
      alert("Please fill in all fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    alert("✅ Order placed successfully!");
    form.reset();
  });
}

function loadOrderSummary() {
  const summaryItemsEl = document.getElementById("summary-items");
  const summaryTotalEl = document.getElementById("summary-total");

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    summaryItemsEl.innerHTML = "<li>Your cart is empty 🛒</li>";
    summaryTotalEl.textContent = "";
    return;
  }

  let total = 0;
  summaryItemsEl.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <li>
        <span>${item.title} × ${item.quantity}</span>
        <span>$${itemTotal.toFixed(2)}</span>
      </li>
    `;
  }).join("");

  summaryTotalEl.textContent = `Total: $${total.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", loadOrderSummary);

