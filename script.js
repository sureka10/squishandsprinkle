
const GIFT_PRICE = 2;

const products = [
  { id: 1, name: "Custom Squishy", price: 10, emoji: "🎨", description: "Make your own squishy!" },
  { id: 2, name: "Keychain Fidget", price: 2, emoji: "🔑", description: "A tiny fidget to take anywhere!" },
  { id: 3, name: "Custom Fidget", price: 6, emoji: "✨", description: "Choose your fidget style!" },
  { id: 4, name: "Balloon Squishy", price: 7, emoji: "🎈", description: "Choose your favorite filling!" },
  { id: 5, name: "DIY Dumpling", price: 8, emoji: "🥟", description: "A cute dumpling squishy!" }
];

let cart = [];

try {
  cart = JSON.parse(localStorage.getItem("squishCart") || "[]");
  if (!Array.isArray(cart)) cart = [];
} catch {
  cart = [];
}

cart = cart.filter(item => products.some(p => p.id === item.id));

function saveCart() {
  localStorage.setItem("squishCart", JSON.stringify(cart));
}

function money(amount) {
  return "$" + Number(amount).toFixed(2);
}

// STYLES

const extraStyles = document.createElement("style");
extraStyles.textContent = `
.customizer {
  position: fixed;
  inset: 0;
  background: rgba(45,30,50,.55);
  z-index: 99999;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.customizer.show { display: flex; }

.customizer-box {
  background: #fffaff;
  border-radius: 22px;
  padding: 24px;
  width: 100%;
  max-width: 390px;
  max-height: 85vh;
  overflow-y: auto;
  color: #55445c;
  font-family: inherit;
}

.customizer-box h2 { color: #a66cae; margin-top: 0; }
.customizer-box h3 { font-size: 15px; margin: 18px 0 9px; }

.choice-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.choice-btn {
  border: 2px solid #ead8ef;
  background: white;
  color: #59485f;
  border-radius: 14px;
  padding: 10px 13px;
  cursor: pointer;
  font-size: 14px;
  font-family: inherit;
}

.choice-btn.selected {
  background: #f1dafa;
  border-color: #bd8bc9;
  font-weight: bold;
}

.customizer-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

.customizer-actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
}

.custom-add { background: #d9b8e8; color: #49344f; }
.custom-cancel { background: #f1eaf3; color: #59485f; }

.product-card {
  background: #fffaff;
  border-radius: 20px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 15px #8e6b9912;
}

.product-emoji {
  font-size: 48px;
  background: #f8edf9;
  border-radius: 16px;
  padding: 18px;
  margin-bottom: 12px;
}

.product-card button {
  border: none;
  border-radius: 14px;
  padding: 11px 17px;
  background: #e8cbed;
  color: #59415f;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

.cart-line {
  padding: 12px 0;
  border-bottom: 1px solid #eee2ef;
}

#squishToast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #72547d;
  color: white;
  padding: 12px 20px;
  border-radius: 20px;
  z-index: 100001;
  display: none;
}
`;
document.head.appendChild(extraStyles);

// SHOW PRODUCTS

function renderProducts() {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-emoji">${product.emoji}</div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>${money(product.price)}</strong></p>
      <button onclick="add(${product.id})">Add to Cart</button>
    </div>
  `).join("");
}

// CUSTOMIZATION WINDOW

let selectedProduct = null;
let selections = {};

function choiceButtons(key, choices) {
  return `
    <div class="choice-grid">
      ${choices.map(choice => `
        <button type="button"
          class="choice-btn"
          onclick="selectChoice('${key}', '${choice.replace(/'/g, "\\'")}', this)">
          ${choice}
        </button>
      `).join("")}
    </div>
  `;
}

function selectChoice(key, value, button) {
  selections[key] = value;

  button.parentElement.querySelectorAll(".choice-btn")
    .forEach(btn => btn.classList.remove("selected"));

  button.classList.add("selected");
}

function openCustomizer(id) {
  selectedProduct = products.find(p => p.id === id);
  if (!selectedProduct) return;

  selections = { gift: "No thanks" };

  let options = "";

  if (id === 1) {
    options += `
      <h3>🎨 Choose a color</h3>
      ${choiceButtons("color", ["Pink", "Purple", "Blue", "Green", "Yellow", "Red", "Orange", "Black", "White", "Surprise me!"])}

      <h3>💨 Air or no air?</h3>
      ${choiceButtons("air", ["Air", "No Air"])}

      <h3>✨ Crunchy beads?</h3>
      ${choiceButtons("beads", ["Yes", "No"])}
    `;
  }

  if (id === 3) {
    options += `
      <h3>🎨 Choose a color</h3>
      ${choiceButtons("color", ["Pink", "Purple", "Blue", "Green", "Yellow", "Red", "Orange", "Black", "White", "Surprise me!"])}

      <h3>✨ Choose your fidget type</h3>
      ${choiceButtons("type", ["Keychain", "Sliding Marble Fidget"])}
    `;
  }

  if (id === 4) {
    options += `
      <h3>🎈 Choose your filling</h3>
      ${choiceButtons("filling", ["Soft Kinetic Sand", "Gel", "Water"])}
    `;
  }

  options += `
    <h3>🎁 Gift packaging (optional)</h3>
    <p>Make your order extra special!</p>
    ${choiceButtons("gift", ["No thanks", "Yes, gift packaging (+$2)"])}
  `;

  const modal = document.getElementById("squishCustomizer");

  modal.innerHTML = `
    <div class="customizer-box" onclick="event.stopPropagation()">
      <h2>${selectedProduct.emoji} ${selectedProduct.name}</h2>
      ${options}
      <div class="customizer-actions">
        <button class="custom-cancel" onclick="closeCustomizer()">Cancel</button>
        <button class="custom-add" onclick="finishCustomization()">Add to Cart 💗</button>
      </div>
    </div>
  `;

  modal.classList.add("show");

  // Select "No thanks" by default
  const giftButtons = modal.querySelectorAll(".choice-grid");
  const giftGroup = giftButtons[giftButtons.length - 1];
  if (giftGroup && giftGroup.children[0]) {
    giftGroup.children[0].classList.add("selected");
  }
}

function closeCustomizer() {
  document.getElementById("squishCustomizer").classList.remove("show");
}

// ADD CUSTOMIZED PRODUCT

function finishCustomization() {
  if (!selectedProduct) return;

  const required = {
    1: ["color", "air", "beads"],
    3: ["color", "type"],
    4: ["filling"]
  };

  const missing = (required[selectedProduct.id] || [])
    .filter(key => !selections[key]);

  if (missing.length) {
    showToast("Please choose all the options first! 💗");
    return;
  }

  const gift = selections.gift === "Yes, gift packaging (+$2)";

  cart.push({
    id: selectedProduct.id,
    name: selectedProduct.name,
    emoji: selectedProduct.emoji,
    price: selectedProduct.price + (gift ? GIFT_PRICE : 0),
    basePrice: selectedProduct.price,
    gift: gift,
    customizations: { ...selections }
  });

  saveCart();
  updateCart();
  closeCustomizer();
  showToast("Added to your cart! 💗");
}

// ADD TO CART

function add(id) {
  openCustomizer(id);
}

// CART DISPLAY

function updateCart() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const countElement = document.getElementById("cartCount");
  const totalElement = document.getElementById("cartTotal");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const itemsElement = document.getElementById("cartItems");

  if (countElement) countElement.textContent = cart.length;
  if (totalElement) totalElement.textContent = money(total);
  if (checkoutTotal) checkoutTotal.textContent = money(total);

  if (itemsElement) {
    if (!cart.length) {
      itemsElement.innerHTML = "<p>Your cart is empty! 🥺</p>";
    } else {
      itemsElement.innerHTML = cart.map((item, index) => {
        const details = Object.entries(item.customizations || {})
          .filter(([key]) => key !== "gift")
          .map(([key, value]) => `${key}: ${value}`)
          .join(" • ");

        return `
          <div class="cart-line">
            <strong>${item.emoji} ${item.name}</strong>
            <span> - ${money(item.price)}</span>
            ${details ? `<p>${details}</p>` : ""}
            <p>${item.gift ? "🎁 Gift packaging: +$2.00" : "Gift packaging: No"}</p>
            <button onclick="removeItem(${index})">Remove</button>
          </div>
        `;
      }).join("");
    }
  }
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
  showToast("Removed from cart");
}

// CART WINDOWS

function openCart() {
  const overlay = document.getElementById("cartOverlay");
  if (overlay) {
    overlay.style.display = "flex";
    overlay.classList.add("active");
  }
}

function closeCartWindow() {
  const overlay = document.getElementById("cartOverlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.classList.remove("active");
  }
}

function openCheckout() {
  if (!cart.length) {
    showToast("Your cart is empty! 💗");
    return;
  }

  closeCartWindow();

  const overlay = document.getElementById("checkoutOverlay");
  if (overlay) {
    overlay.style.display = "flex";
    overlay.classList.add("active");
  }
}

function closeCheckoutWindow() {
  const overlay = document.getElementById("checkoutOverlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.classList.remove("active");
  }
}

// TOAST MESSAGE

function showToast(message) {
  let toast = document.getElementById("squishToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "squishToast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.display = "block";

  clearTimeout(window.squishToastTimer);
  window.squishToastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

// START WEBSITE

function initializeShop() {
  const modal = document.createElement("div");
  modal.id = "squishCustomizer";
  modal.className = "customizer";

  modal.addEventListener("click", event => {
    if (event.target === modal) closeCustomizer();
  });

  document.body.appendChild(modal);

  renderProducts();
  updateCart();

  const cartButton = document.getElementById("cartButton");
  const closeCart = document.getElementById("closeCart");
  const checkoutButton = document.getElementById("checkoutButton");
  const closeCheckout = document.getElementById("closeCheckout");

  if (cartButton) cartButton.addEventListener("click", openCart);
  if (closeCart) closeCart.addEventListener("click", closeCartWindow);
  if (checkoutButton) checkoutButton.addEventListener("click", openCheckout);
  if (closeCheckout) closeCheckout.addEventListener("click", closeCheckoutWindow);

  const cartOverlay = document.getElementById("cartOverlay");
  if (cartOverlay) {
    cartOverlay.addEventListener("click", event => {
      if (event.target === cartOverlay) closeCartWindow();
    });
  }

  const checkoutOverlay = document.getElementById("checkoutOverlay");
  if (checkoutOverlay) {
    checkoutOverlay.addEventListener("click", event => {
      if (event.target === checkoutOverlay) closeCheckoutWindow();
    });
  }

  const checkoutForm = document.getElementById("checkoutForm");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", event => {
      event.preventDefault();
      showToast("Payments aren't connected yet. Ask your dad to finish Stripe setup! 💗");
    });
  }
}

window.add = add;
window.removeItem = removeItem;
window.selectChoice = selectChoice;
window.finishCustomization = finishCustomization;
window.closeCustomizer = closeCustomizer;
window.openCart = openCart;
window.closeCartWindow = closeCartWindow;
window.openCheckout = openCheckout;
window.closeCheckoutWindow = closeCheckoutWindow;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeShop);
} else {
  initializeShop();
}
