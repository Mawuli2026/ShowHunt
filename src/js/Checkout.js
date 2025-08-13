document.addEventListener("DOMContentLoaded", async () => {
  // Run the three async tasks in parallel without blocking each other
  await Promise.allSettled([loadCountries(), loadNews(), loadOrderSummary()]);

  // Initialize the checkout form
  initCheckoutForm();
});

/**
 * Load country options from REST Countries API
 */
async function loadCountries() {
  const countrySelect = document.getElementById("country");
  if (!countrySelect) return;

  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2",
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (!Array.isArray(data))
      throw new Error("Invalid data format from REST Countries");

    // Sort by name and populate
    data.sort((a, b) => a.name.common.localeCompare(b.name.common));
    countrySelect.innerHTML = `<option value="">Select Country</option>`;
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
  if (!newsPanel) return;

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
      (a) =>
        `<div class="news-item"><a href="${a.url}" target="_blank">${a.title}</a></div>`,
    )
    .join("");
}

/**
 * Show order summary from localStorage
 */
async function loadOrderSummary() {
  const summaryItemsEl = document.getElementById("summary-items");
  const summaryTotalEl = document.getElementById("summary-total");
  if (!summaryItemsEl || !summaryTotalEl) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    summaryItemsEl.innerHTML = "<li>Your cart is empty 🛒</li>";
    summaryTotalEl.textContent = "";
    return;
  }

  let total = 0;
  summaryItemsEl.innerHTML = cart
    .map((item) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      return `<li><span>${item.title} × ${item.quantity}</span><span>$${itemTotal.toFixed(2)}</span></li>`;
    })
    .join("");
  summaryTotalEl.textContent = `Total: $${total.toFixed(2)}`;
}

/**
 * Initialize checkout form validation and payment method UI
 */
function initCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

 // Payment method logo selection
const paymentOptions = document.querySelectorAll(".payment-option");
const paymentDetailsEl = document.getElementById("payment-details");
let selectedMethod = null;

paymentOptions.forEach(option => {
  option.addEventListener("click", () => {
    // Remove selection from all
    paymentOptions.forEach(opt => opt.classList.remove("selected"));
    option.classList.add("selected");
    selectedMethod = option.dataset.method;

    // Inject corresponding payment form
    if (selectedMethod === "visa" || selectedMethod === "mastercard") {
      paymentDetailsEl.innerHTML = `
        <label>Card Number
          <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required>
        </label>
        <label>Name on Card
          <input type="text" placeholder="John Doe" required>
        </label>
        <label>Expiry
          <input type="text" id="cardExpiry" placeholder="MM/YY" maxlength="5" required>
        </label>
        <label>CVV
          <input type="text" id="cardCVV" placeholder="123" maxlength="4" required>
        </label>
      `;
    } else if (selectedMethod === "paypal") {
      paymentDetailsEl.innerHTML = `<p>You will be redirected to PayPal after placing your order.</p>`;
    } else if (selectedMethod === "mobile") {
      paymentDetailsEl.innerHTML = `
        <label>Mobile Number
          <input type="tel" id="mobileNumber" placeholder="+1 234 567 890" required>
        </label>
        <label>Network
          <select required>
            <option value="">Select Network</option>
            <option value="mtn">MTN</option>
            <option value="vodafone">Vodafone</option>
            <option value="airtel">Airtel</option>
          </select>
        </label>
      `;
    }
  });
});

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fullName = form.querySelector("#fullName").value.trim();
    const email = form.querySelector("#email").value.trim();
    const address = form.querySelector("#address").value.trim();
    const country = form.querySelector("#country").value.trim();
    const paymentMethod = form.querySelector(
      'input[name="paymentMethod"]:checked',
    );

    if (!fullName || !email || !address || !country) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email.");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    // Dynamic payment validation
    if (paymentMethod.value === "card") {
      const cardNumber = form.querySelector("#cardNumber").value.trim();
      const cardExpiry = form.querySelector("#cardExpiry").value.trim();
      const cardCVV = form.querySelector("#cardCVV").value.trim();
      if (!cardNumber || !cardExpiry || !cardCVV) {
        alert("Please fill in all card details.");
        return;
      }
    }
    if (paymentMethod.value === "mobile") {
      const mobileNumber = form.querySelector("#mobileNumber").value.trim();
      if (!mobileNumber) {
        alert("Please enter your mobile money number.");
        return;
      }
    }

    alert(
      `✅ Order placed successfully! Payment method: ${paymentMethod.value}`,
    );
    form.reset();
    localStorage.removeItem("cart");
    loadOrderSummary();
  });
}
