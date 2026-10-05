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
    desc: "A custom squishy made just for you."
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

// Find an element on the page
function $(selector) {
  return document.querySelector(selector);
}

// Add a normal product to the cart
function addToCart(product) {
  cart.push({
    id: product.id,
    name: product.name,
    price: product.price
  });

  updateCart();
  alert(`${product.name} added to your cart! 💕`);
}

// Customize the Custom Squishy
function customizeSquishy(product) {
  const color = prompt(
    "🎨 What color would you like for your Custom Squishy?\n\nExample: Pink, blue, purple, rainbow, etc."
  );

  if (!color) {
    return;
  }

  const airChoice = confirm(
    "💨 Would you like AIR in your squishy?\n\nOK = Air\nCancel = No Air"
  );

  const charmChoice = confirm(
    "✨ Would you like MINI CHARMS?\n\nOK = Mini Charms\nCancel = No Mini Charms"
  );

  const customProduct = {
    id: product.id,
    name: product.name,
    price: 10,
    customization: {
      color: color,
      air: airChoice ? "Air" : "No Air",
      charms: charmChoice ? "Mini Charms" : "No Mini Charms"
    }
  };

  cart.push(customProduct);

  updateCart();

  alert(
    `Custom Squishy added! 🎀\n\n` +
    `Color: ${color}\n` +
    `Air: ${customProduct.customization.air}\n` +
    `Mini Charms: ${customProduct.customization.charms}\n\n` +
    `Price: $10`
  );
}

// Add product
function handleAddToCart(product) {
  if (product.id === 2) {
    customizeSquishy(product);
  } else {
    addToCart(product);
  }
}

// Update cart display
function updateCart() {
  const cartCount = $("#cart-count");
  const cartItems = $("#cart-items");
  const cartTotal = $("#cart-total");

  if (cartCount) {
    cartCount.textContent = cart.length;
  }

  if (!cartItems) {
    return;
  }

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement("div");
    div.className = "cart-item";

    let customizationText = "";

    if (item.customization) {
      customizationText = `
        <div class="cart-customization">
          <div>🎨 Color: ${item.customization.color}</div>
          <div>💨 ${item.customization.air}</div>
          <div>✨ ${item.customization.charms}</div>
        </div>
      `;
    }

    div.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        ${customizationText}
        <div>$${item.price.toFixed(2)}</div>
      </div>

      <button onclick="removeFromCart(${index})">
        Remove
      </button>
    `;

    cartItems.appendChild(div);
  });

  if (cartTotal) {
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }
}

// Remove an item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// Set up the shop
function setupShop() {
  const productContainer =
    $("#products") ||
    $("#product-grid") ||
    $(".products") ||
    $(".product-grid");

  if (!productContainer) {
    return;
  }

  productContainer.innerHTML = "";

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

      <button class="add-to-cart">
        ${product.id === 2 ? "Customize 💕" : "Add to Cart 🛒"}
      </button>
    `;

    const button = card.querySelector(".add-to-cart");

    button.addEventListener("click", () => {
      handleAddToCart(product);
    });

    productContainer.appendChild(card);
  });
}

// Run when the page loads
document.addEventListener("DOMContentLoaded", () => {
  setupShop();
  updateCart();
});
