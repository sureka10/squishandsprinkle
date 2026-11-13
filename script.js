
/* SQUISH & SPRINKLE 🍡 */

const products = [
  {id:2,name:"Custom Squishy",price:10,emoji:"🎨",art:"p2",desc:"A custom squishy made just for you."},
  {id:3,name:"Keychain Fidget",price:2,emoji:"🔑",art:"p3",desc:"A tiny fidget you can take anywhere."},
  {id:4,name:"Custom Fidget",price:6,emoji:"✨",art:"p4",desc:"Choose your color and fidget style."},
  {id:5,name:"Balloon Squishy",price:7,emoji:"🎈",art:"p5",desc:"Choose your favorite balloon squishy filling."},
  {id:6,name:"DIY Dumpling",price:8,emoji:"🥟",art:"p6",desc:"A fun DIY dumpling squishy."}
];

const $ = id => document.getElementById(id);

function loadCart(){
  try {
    const saved = JSON.parse(localStorage.getItem("squishCart") || "[]");
    if (!Array.isArray(saved)) return [];

    return saved.filter(item =>
      item &&
      item.id !== 1 &&
      item.baseId !== 1 &&
      item.name !== "Rice Squishy"
    );
  } catch {
    return [];
  }
}

let cart = loadCart();

localStorage.setItem("squishCart", JSON.stringify(cart));

function money(n){
  return "$" + Number(n).toFixed(2);
}

function escapeHTML(value){
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#39;"
  })[char]);
}

function save(){
  localStorage.setItem("squishCart", JSON.stringify(cart));
  renderCart();
}

/* CUSTOMIZATION BUTTON STYLES */

const customStyles = document.createElement("style");

customStyles.textContent = `
.customizer-backdrop {
  position:fixed;
  inset:0;
  background:rgba(35,20,40,.58);
  z-index:99999;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:16px;
  overflow-y:auto;
}

.customizer-box {
  background:#fffafd;
  color:#49394d;
  width:100%;
  max-width:440px;
  max-height:90vh;
  overflow-y:auto;
  border-radius:24px;
  padding:24px;
  box-shadow:0 12px 45px rgba(0,0,0,.2);
  font-family:inherit;
}

.customizer-heading {
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:10px;
  margin-bottom:18px;
}

.customizer-heading h2 {
  margin:0;
  font-size:23px;
}

.customizer-close {
  border:0;
  background:#f2e5f2;
  border-radius:50%;
  width:36px;
  height:36px;
  font-size:22px;
  cursor:pointer;
}

.customizer-section {
  margin:20px 0;
}

.customizer-section h3 {
  font-size:16px;
  margin:0 0 10px;
}

.customizer-options {
  display:flex;
  flex-wrap:wrap;
  gap:9px;
}

.choice-btn {
  border:2px solid #eadbea;
  background:white;
  color:#59465e;
  padding:10px 14px;
  border-radius:15px;
  cursor:pointer;
  font-size:14px;
  font-weight:600;
}

.choice-btn.selected {
  background:#ead8f0;
  border-color:#9165a0;
  color:#493052;
}

.customizer-add {
  width:100%;
  border:0;
  background:#a77db5;
  color:white;
  padding:15px;
  border-radius:16px;
  font-size:16px;
  font-weight:bold;
  cursor:pointer;
  margin-top:12px;
}

.customizer-add:disabled {
  opacity:.45;
  cursor:not-allowed;
}

.customizer-note {
  color:#806e84;
  font-size:13px;
  text-align:center;
  margin-top:12px;
}
`;

document.head.appendChild(customStyles);

/* CUSTOMIZATION WINDOW */

const customizerRoot = document.createElement("div");
document.body.appendChild(customizerRoot);

let activeCustomization = null;

const colors = [
  "Pink","Purple","Blue","Yellow","Green",
  "White","Orange","Red","Black"
];

function choiceGroup(title, field, options){
  return `
    <section class="customizer-section">
      <h3>${title}</h3>
      <div class="customizer-options">
        ${options.map(option => `
          <button
            type="button"
            class="choice-btn"
            data-field="${field}"
            data-value="${option}"
            aria-pressed="false"
          >${option}</button>
        `).join("")}
      </div>
    </section>
  `;
}

function openCustomizer(productId){
  let config;

  if(productId === 2){
    config = {
      title:"🎨 Custom Squishy",
      name:"Custom Squishy",
      price:10,
      emoji:"🎨",
      fields:["color","air","crunchyBeads"],
      sections:
        choiceGroup("🎨 Choose your color","color",colors) +
        choiceGroup("💨 Choose air or no air","air",["Air","No Air"]) +
        choiceGroup("✨ Crunchy beads (FREE!)","crunchyBeads",["Yes","No"])
    };
  }

  if(productId === 4){
    config = {
      title:"✨ Custom Fidget",
      name:"Custom Fidget",
      price:6,
      emoji:"✨",
      fields:["color","type"],
      sections:
        choiceGroup("🎨 Choose your color","color",colors) +
        choiceGroup("✨ Choose your fidget type","type",[
          "Keychain","Sliding Marble Fidget"
        ])
    };
  }

  if(productId === 5){
    config = {
      title:"🎈 Balloon Squishy",
      name:"Balloon Squishy",
      price:7,
      emoji:"🎈",
      fields:["filling"],
      sections:
        choiceGroup("🎈 Choose your filling","filling",[
          "Soft Kinetic Sand","Gel","Water"
        ])
    };
  }

  if(!config)return;

  activeCustomization = {
    ...config,
    productId,
    selected:{}
  };

  renderCustomizer();
}

function renderCustomizer(){
  const config = activeCustomization;

  if(!config)return;

  customizerRoot.innerHTML = `
    <div class="customizer-backdrop">
      <div class="customizer-box" role="dialog" aria-modal="true">
        <div class="customizer-heading">
          <h2>${config.title}</h2>
          <button type="button" class="customizer-close" data-action="close">×</button>
        </div>

        ${config.sections}

        <button
          type="button"
          class="customizer-add"
          data-action="add"
          disabled
        >
          Add to Cart 💕
        </button>

        <p class="customizer-note">
          Choose all your options before adding to your cart!
        </p>
      </div>
    </div>
  `;

  updateCustomizer();
}

function updateCustomizer(){
  if(!activeCustomization)return;

  const config = activeCustomization;

  customizerRoot.querySelectorAll(".choice-btn").forEach(button => {
    const selected =
      config.selected[button.dataset.field] === button.dataset.value;

    button.classList.toggle("selected",selected);
    button.setAttribute("aria-pressed",String(selected));
  });

  const complete = config.fields.every(field =>
    Boolean(config.selected[field])
  );

  const addButton = customizerRoot.querySelector('[data-action="add"]');

  if(addButton){
    addButton.disabled = !complete;
  }
}

/* CLICKABLE CUSTOMIZATION OPTIONS */

customizerRoot.addEventListener("click",event => {
  const closeButton = event.target.closest('[data-action="close"]');

  if(closeButton){
    activeCustomization = null;
    customizerRoot.innerHTML = "";
    return;
  }

  if(event.target.classList.contains("customizer-backdrop")){
    activeCustomization = null;
    customizerRoot.innerHTML = "";
    return;
  }

  const choiceButton = event.target.closest(".choice-btn");

  if(choiceButton && activeCustomization){
    const field = choiceButton.dataset.field;
    const value = choiceButton.dataset.value;

    activeCustomization.selected[field] = value;
    updateCustomizer();
    return;
  }

  const addButton = event.target.closest('[data-action="add"]');

  if(addButton && activeCustomization){
    finishCustomization();
  }
});

/* ADD CUSTOMIZED PRODUCT */

function finishCustomization(){
  const config = activeCustomization;

  if(!config)return;

  const complete = config.fields.every(field =>
    Boolean(config.selected[field])
  );

  if(!complete)return;

  const customItem = {
    id:Date.now() + Math.floor(Math.random()*1000),
    baseId:config.productId,
    name:config.name,
    price:config.price,
    emoji:config.emoji,
    qty:1,
    customization:{...config.selected}
  };

  cart.push(customItem);
  save();

  activeCustomization = null;
  customizerRoot.innerHTML = "";

  toast(config.name + " added to your cart! 💕");
}

/* ADD PRODUCTS */

function add(id){
  const product = products.find(item => item.id === id);

  if(!product)return;

  if([2,4,5].includes(id)){
    openCustomizer(id);
    return;
  }

  const existing = cart.find(item =>
    item.id === id && !item.customization
  );

  if(existing){
    existing.qty++;
  }else{
    cart.push({...product,qty:1});
  }

  save();
  toast("Added to your cart! 💕");
}

/* CHANGE QUANTITY */

function change(id,delta){
  const item = cart.find(item => item.id === id);

  if(!item)return;

  item.qty += delta;

  if(item.qty <= 0){
    cart = cart.filter(item => item.id !== id);
  }

  save();
}

/* DISPLAY PRODUCTS */

function renderProducts(){
  const productArea = $("products");

  if(!productArea)return;

  productArea.innerHTML = products.map(product => `
    <article class="product">

      <div class="product-art ${product.art}">
        ${product.emoji}
      </div>

      <h3>${product.name}</h3>

      <p>${product.desc}</p>

      <div class="product-bottom">

        <span class="price">
          ${money(product.price)}
        </span>

        <button class="add" onclick="add(${product.id})">
          ${[2,4,5].includes(product.id) ? "Customize 💕" : "Add +"}
        </button>

      </div>

    </article>
  `).join("");
}

/* DISPLAY CART */

function renderCart(){
  const cartCount = $("cartCount");
  const cartTotal = $("cartTotal");
  const checkoutTotal = $("checkoutTotal");
  const cartItems = $("cartItems");
  const checkoutButton = $("checkoutButton");

  if(!cartCount || !cartTotal || !checkoutTotal || !cartItems)return;

  const count = cart.reduce((sum,item)=>sum+item.qty,0);

  const total = cart.reduce(
    (sum,item)=>sum+item.price*item.qty,0
  );

  cartCount.textContent = count;
  cartTotal.textContent = money(total);
  checkoutTotal.textContent = money(total);

  cartItems.innerHTML = cart.length
    ? cart.map(item => `
      <div class="cart-item">

        <div>
          <strong>
            ${escapeHTML(item.emoji)} ${escapeHTML(item.name)}
          </strong>

          <div>${money(item.price)} each</div>

          ${
            item.customization
            ? `
              <div>
                ${
                  item.customization.color
                  ? `🎨 Color: ${escapeHTML(item.customization.color)}<br>`
                  : ""
                }

                ${
                  item.customization.air
                  ? `💨 ${escapeHTML(item.customization.air)}<br>`
                  : ""
                }

                ${
                  item.customization.crunchyBeads
                  ? `✨ Crunchy Beads: ${escapeHTML(item.customization.crunchyBeads)}<br>`
                  : ""
                }

                ${
                  item.customization.filling
                  ? `🎈 Filling: ${escapeHTML(item.customization.filling)}<br>`
                  : ""
                }

                ${
                  item.customization.type
                  ? `🫧 Type: ${escapeHTML(item.customization.type)}`
                  : ""
                }
              </div>
            `
            : ""
          }
        </div>

        <div class="qty">
          <button onclick="change(${item.id},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="change(${item.id},1)">+</button>
        </div>

      </div>
    `).join("")
    : `<p>Your cart is empty. Add a squishy to get started! 🧸</p>`;

  if(checkoutButton){
    checkoutButton.disabled = !cart.length;
  }
}

/* TOAST MESSAGE */

function toast(message){
  const t = $("toast");

  if(!t)return;

  t.textContent = message;
  t.classList.add("show");

  setTimeout(()=>{
    t.classList.remove("show");
  },1800);
}

/* CART BUTTONS */

$("cartButton")?.addEventListener("click",()=>{
  $("cartOverlay")?.classList.add("open");
});

$("closeCart")?.addEventListener("click",()=>{
  $("cartOverlay")?.classList.remove("open");
});

/* CHECKOUT BUTTONS */

$("checkoutButton")?.addEventListener("click",()=>{
  if(!cart.length)return;

  $("cartOverlay")?.classList.remove("open");
  $("checkoutOverlay")?.classList.add("open");
});

$("closeCheckout")?.addEventListener("click",()=>{
  $("checkoutOverlay")?.classList.remove("open");
});

/* CHECKOUT FORM */

$("checkoutForm")?.addEventListener("submit",event=>{
  event.preventDefault();

  alert(
    "This is a demo checkout. No payment was taken. Real payment processing still needs to be connected."
  );
});

/* START WEBSITE */

renderProducts();
renderCart();
