const products = [
  {
    id: 1,
    name: "Rice Squishy",
    price: 6,
    emoji: "🍚",
    art: "p1",
    desc: "A cute handmade rice squishy."
  },
  {
    id: 2,
    name: "Custom Squishy",
    price: 10,
    emoji: "🎨",
    art: "p2",
    desc: "Make it yours! Choose the color, air, and mini charms."
  },
  {
    id: 3,
    name: "Keychain Fidget",
    price: 2,
    emoji: "🔑",
    art: "p3",
    desc: "A tiny fidget you can take anywhere."
  },
  {
    id: 4,
    name: "Custom Fidget",
    price: 7,
    emoji: "✨",
    art: "p4",
    desc: "A handmade custom fidget made your way."
  }
];

let cart = [];

/* =========================
   SAVE / LOAD CART
========================= */

function saveCart() {
  localStorage.setItem("squishSprinkleCart", JSON.stringify(cart));
}

function loadCart() {
  const savedCart = localStorage.getItem("squishSprinkleCart");

  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
    } catch (error) {
      cart = [];
    }
  }
}

/* =========================
   SHOP
========================= */

function setupShop() {
  const productsContainer = document.getElementById("products");

  if (!productsContainer) return;

  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");

    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image ${product.art}">
        <span class="product-emoji">${product.emoji}</span>
      </div>

      <h3>${product.name}</h3>

      <p>${product.desc}</p>

      <strong>$${product.price.toFixed(2)}</strong>

      <button class="primary full product-button">
        ${product.id === 2 ? "Customize 💕" : "Add to Cart 🛒"}
      </button>
    `;

    const button = card.querySelector(".product-button");

    button.addEventListener("click", () => {
      if (product.id === 2) {
        openCustomizer();
      } else {
        addProductToCart(product);
      }
    });

    productsContainer.appendChild(card);
  });
}

/* =========================
   NORMAL PRODUCTS
========================= */

function addProductToCart(product) {
  cart.push({
    cartId: Date.now() + Math.random(),
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity: 1
  });

  saveCart();
  updateCart();

  showToast(`${product.name} added to your cart! 💕`);
}

/* =========================
   CUSTOM SQUISHY
========================= */

function openCustomizer() {
  const overlay = document.createElement("div");

  overlay.id = "customizerOverlay";

  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(60, 40, 70, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
  `;

  overlay.innerHTML = `
    <div style="
      background: #fffafd;
      width: 100%;
      max-width: 450px;
      max-height: 90vh;
      overflow-y: auto;
      border-radius: 28px;
      padding: 28px;
      box-shadow: 0 20px 60px rgba(0,0,0,.2);
      font-family: inherit;
      position: relative;
    ">

      <button id="closeCustomizer" style="
        position: absolute;
        right: 18px;
        top: 12px;
        border: none;
        background: none;
        font-size: 30px;
        cursor: pointer;
      ">×</button>

      <p style="
        text-align:center;
        margin:0 0 5px;
        font-weight:bold;
      ">♡ CUSTOM SQUISHY ♡</p>

      <h2 style="
        text-align:center;
        margin:0 0 8px;
      ">Make it yours! 🎨</h2>

      <p style="
        text-align:center;
        margin-bottom:24px;
      ">
        Everything below is included in the <strong>$10</strong> price!
      </p>

      <label style="display:block; margin-bottom:8px; font-weight:bold;">
        🎨 Choose a color
      </label>

      <select id="customColor" style="
        width:100%;
        padding:12px;
        border-radius:12px;
        border:2px solid #ead9ed;
        margin-bottom:20px;
        font-size:16px;
      ">
        <option value="Pink">🌸 Pink</option>
        <option value="Purple">💜 Purple</option>
        <option value="Blue">💙 Blue</option>
        <option value="Yellow">💛 Yellow</option>
        <option value="Green">💚 Green</option>
        <option value="White">🤍 White</option>
        <option value="Rainbow">🌈 Rainbow</option>
        <option value="Custom">🎨 Other / Custom Color</option>
      </select>

      <div style="margin-bottom:20px;">
        <strong>💨 Air</strong>

        <label style="display:block; margin-top:10px;">
          <input type="radio" name="customAir" value="Air" checked>
          Air
        </label>

        <label style="display:block; margin-top:8px;">
          <input type="radio" name="customAir" value="No Air">
          No Air
        </label>
      </div>

      <div style="margin-bottom:24px;">
        <strong>✨ Mini charms</strong>

        <label style="display:block; margin-top:10px;">
          <input type="radio" name="customCharms" value="Mini Charms" checked>
          Mini charms
        </label>

        <label style="display:block; margin-top:8px;">
          <input type="radio" name="customCharms" value="No Mini Charms">
          No mini charms
        </label>
      </div>

      <button id="addCustomSquishy" class="primary full" style="
        width:100%;
        padding:14px;
        border:none;
        border-radius:14px;
        cursor:pointer;
        font-size:17px;
        font-weight:bold;
      ">
        Add Custom Squishy — $10 💕
      </button>

    </div>
  `;

  document.body.appendChild(overlay);

  document
    .getElementById("closeCustomizer")
    .addEventListener("click", () => {
      overlay.remove();
    });

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      overlay.remove();
    }
  });

  document
    .getElementById("addCustomSquishy")
    .addEventListener("click", () => {
      const color = document.getElementById("customColor").value;

      const air = document.querySelector(
        'input[name="customAir"]:checked'
      ).value;

      const charms = document.querySelector(
        'input[name="customCharms"]:checked'
      ).value;

      let finalColor = color;

      if (color === "Custom") {
        const customColor = prompt(
          "What color would you like?"
        );

        if (!customColor) {
          return;
        }

        finalColor = customColor;
      }

      cart.push({
        cartId: Date.now() + Math.random(),
        productId: 2,
        name: "Custom Squishy",
        price: 10,
        quantity: 1,
        customization: {
          color: finalColor,
          air: air,
          charms: charms
        }
      });

      saveCart();
      updateCart();

      overlay.remove();

      showToast("Your custom squishy was added! 🎀");
    });
}

/* =========================
   CART
========================= */

function updateCart() {
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutTotal = document.getElementById("checkoutTotal");

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartCount) {
    cartCount.textContent = totalItems;
  }

  if (cartTotal) {
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
  }

  if (checkoutTotal) {
    checkoutTotal.textContent = `$${totalPrice.toFixed(2)}`;
  }

  if (!cartItems) return;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div style="text-align:center; padding:30px 10px;">
        <div style="font-size:45px;">🛒</div>
        <p>Your cart is empty!</p>
        <p>Go pick a cute squishy. 💕</p>
      </div>
    `;

    return;
  }

  cartItems.innerHTML = "";

  cart.forEach((item) => {
    const cartItem = document.createElement("div");

    cartItem.className = "cart-item";

    let customizationHTML = "";

    if (item.customization) {
      customizationHTML = `
        <div style="
          font-size:14px;
          margin-top:8px;
          line-height:1.6;
        ">
          🎨 Color: ${item.customization.color}<br>
          💨 ${item.customization.air}<br>
          ✨ ${item.customization.charms}
        </div>
      `;
    }

    cartItem.innerHTML = `
      <div style="flex:1;">
        <strong>${item.name}</strong>

        ${customizationHTML}

        <div style="margin-top:8px;">
          $${item.price.toFixed(2)}
        </div>

        <div style="
          display:flex;
          align-items:center;
          gap:8px;
          margin-top:10px;
        ">
          <button class="quantity-button decrease">−</button>

          <span>${item.quantity}</span>

          <button class="quantity-button increase">+</button>
        </div>
      </div>

      <button class="remove-button">
        Remove
      </button>
    `;

    cartItem
      .querySelector(".decrease")
      .addEventListener("click", () => {
        changeQuantity(item.cartId, -1);
      });

    cartItem
      .querySelector(".increase")
      .addEventListener("click", () => {
        changeQuantity(item.cartId, 1);
      });

    cartItem
      .querySelector(".remove-button")
      .addEventListener("click", () => {
        removeFromCart(item.cartId);
      });

    cartItems.appendChild(cartItem);
  });
}

/* =========================
   QUANTITY
========================= */

function changeQuantity(cartId, amount) {
  const item = cart.find((product) => product.cartId === cartId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter((product) => product.cartId !== cartId);
  }

  saveCart();
  updateCart();
}

/* =========================
   REMOVE
========================= */

function removeFromCart(cartId) {
  cart = cart.filter((item) => item.cartId !== cartId);

  saveCart();
  updateCart();

  showToast("Item removed from your cart.");
}

/* =========================
   CART OPEN / CLOSE
========================= */

function openCart() {
  const cartOverlay = document.getElementById("cartOverlay");

  if (cartOverlay) {
    cartOverlay.classList.add("open");
  }
}

function closeCart() {
  const cartOverlay = document.getElementById("cartOverlay");

  if (cartOverlay) {
    cartOverlay.classList.remove("open");
  }
}

/* =========================
   CHECKOUT
========================= */

function openCheckout() {
  if (cart.length === 0) {
    showToast("Your cart is empty! 🛒");
    return;
  }

  const checkoutOverlay =
    document.getElementById("checkoutOverlay");

  if (checkoutOverlay) {
    checkoutOverlay.classList.add("open");
  }
}

function closeCheckout() {
  const checkoutOverlay =
    document.getElementById("checkoutOverlay");

  if (checkoutOverlay) {
    checkoutOverlay.classList.remove("open");
  }
}

/* =========================
   TOAST
========================= */

function showToast(message) {
  const toast = document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

/* =========================
   CHECKOUT FORM
========================= */

function setupCheckout() {
  const form = document.getElementById("checkoutForm");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      showToast("Your cart is empty!");
      return;
    }

    const formData = new FormData(form);

    const customerName = formData.get("name");

    alert(
      `Thank you, ${customerName}! 💕\n\n` +
      `Your order has been received as a demo order.\n\n` +
      `Payment is not connected yet.`
    );

    cart = [];

    saveCart();
    updateCart();

    form.reset();

    closeCheckout();
    closeCart();
  });
}

/* =========================
   START EVERYTHING
========================= */

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  setupShop();
  setupCheckout();
  updateCart();

  const cartButton = document.getElementById("cartButton");

  if (cartButton) {
    cartButton.addEventListener("click", openCart);
  }

  const closeCartButton =
    document.getElementById("closeCart");

  if (closeCartButton) {
    closeCartButton.addEventListener("click", closeCart);
  }

  const checkoutButton =
    document.getElementById("checkoutButton");

  if (checkoutButton) {
    checkoutButton.addEventListener("click", openCheckout);
  }

  const closeCheckoutButton =
    document.getElementById("closeCheckout");

  if (closeCheckoutButton) {
    closeCheckoutButton.addEventListener(
      "click",
      closeCheckout
    );
  }
});
