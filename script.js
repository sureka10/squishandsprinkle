const products=[
{id:1,name:"Rice Squishy",price:6,emoji:"🍚",art:"p1",desc:"A cute handmade rice squishy."},
{id:2,name:"Custom Squishy",price:10,emoji:"🎨",art:"p2",desc:"A custom squishy made just for you."},
{id:3,name:"Keychain Fidget",price:2,emoji:"🔑",art:"p3",desc:"A tiny fidget you can take anywhere."},
{id:4,name:"Custom Fidget",price:6,emoji:"✨",art:"p4",desc:"Choose your color and fidget style."},
{id:5,name:"Balloon Squishy",price:7,emoji:"🎈",art:"p5",desc:"A cute handmade balloon squishy."},
{id:6,name:"DIY Dumpling",price:8,emoji:"🥟",art:"p6",desc:"A fun DIY dumpling squishy kit."}
];

let cart=JSON.parse(localStorage.getItem("squishCart")||"[]");

const $=id=>document.getElementById(id);

function money(n){
  return "$"+n.toFixed(2);
}

function save(){
  localStorage.setItem("squishCart",JSON.stringify(cart));
  renderCart();
}

/* ADD PRODUCTS */
function add(id){

  const p=products.find(x=>x.id===id);

  /* CUSTOM SQUISHY */
  if(id===2){
    customizeSquishy();
    return;
  }

  /* CUSTOM FIDGET */
  if(id===4){
    customizeFidget();
    return;
  }

  const item=cart.find(x=>x.id===id);

  if(item){
    item.qty++;
  }else{
    cart.push({...p,qty:1});
  }

  save();

  toast("Added to your cart! 💕");
}

/* CUSTOM SQUISHY */
function customizeSquishy(){

  const color=prompt(
    "🎨 Choose a color:\n\nPink\nPurple\nBlue\nYellow\nGreen\nWhite\nOrange"
  );

  if(!color){
    return;
  }

  const airChoice=prompt(
    "💨 Choose one:\n\nAir\nNo Air"
  );

  if(!airChoice){
    return;
  }

  const charmsChoice=prompt(
    "✨ Choose one:\n\nMini Charms\nNo Mini Charms"
  );

  if(!charmsChoice){
    return;
  }

  const customItem={
    id:Date.now(),
    baseId:2,
    name:"Custom Squishy",
    price:10,
    emoji:"🎨",
    qty:1,
    customization:{
      color:color,
      air:airChoice,
      charms:charmsChoice
    }
  };

  cart.push(customItem);

  save();

  toast("Custom Squishy added! 🎀");
}

/* CUSTOM FIDGET */
function customizeFidget(){

  const color=prompt(
    "🎨 What color would you like for your Custom Fidget?\n\nYou can choose ANY color!"
  );

  if(!color){
    return;
  }

  const type=prompt(
    "✨ Choose your fidget type:\n\n1. Keychain\n2. Sliding Marble Fidget"
  );

  if(!type){
    return;
  }

  let fidgetType;

  if(
    type==="1" ||
    type.toLowerCase()==="keychain"
  ){
    fidgetType="Keychain";
  }
  else if(
    type==="2" ||
    type.toLowerCase()==="sliding marble fidget"
  ){
    fidgetType="Sliding Marble Fidget";
  }
  else{
    alert("Please choose Keychain or Sliding Marble Fidget.");
    return;
  }

  const customItem={
    id:Date.now(),
    baseId:4,
    name:"Custom Fidget",
    price:6,
    emoji:"✨",
    qty:1,
    customization:{
      color:color,
      type:fidgetType
    }
  };

  cart.push(customItem);

  save();

  toast("Custom Fidget added! ✨");
}

/* CHANGE QUANTITY */
function change(id,delta){

  const item=cart.find(x=>x.id===id);

  if(!item)return;

  item.qty+=delta;

  if(item.qty<=0){
    cart=cart.filter(x=>x.id!==id);
  }

  save();
}

/* PRODUCTS */
function renderProducts(){

  $("products").innerHTML=products.map(p=>`

    <article class="product">

      <div class="product-art ${p.art}">
        ${p.emoji}
      </div>

      <h3>${p.name}</h3>

      <p>${p.desc}</p>

      <div class="product-bottom">

        <span class="price">
          ${money(p.price)}
        </span>

        <button class="add" onclick="add(${p.id})">
          ${
            p.id===2
            ? "Customize 💕"
            : p.id===4
            ? "Customize ✨"
            : "Add +"
          }
        </button>

      </div>

    </article>

  `).join("");
}

/* CART */
function renderCart(){

  const count=cart.reduce(
    (s,x)=>s+x.qty,
    0
  );

  $("cartCount").textContent=count;

  const total=cart.reduce(
    (s,x)=>s+x.price*x.qty,
    0
  );

  $("cartTotal").textContent=money(total);

  $("checkoutTotal").textContent=money(total);

  $("cartItems").innerHTML=cart.length

  ?cart.map(x=>`

    <div class="cart-item">

      <div>

        <strong>
          ${x.emoji} ${x.name}
        </strong>

        <div>
          ${money(x.price)} each
        </div>

        ${
          x.customization
          ?
          `
          <div>
            ${
              x.customization.color
              ? `🎨 Color: ${x.customization.color}<br>`
              : ""
            }

            ${
              x.customization.air
              ? `💨 ${x.customization.air}<br>`
              : ""
            }

            ${
              x.customization.charms
              ? `✨ ${x.customization.charms}<br>`
              : ""
            }

            ${
              x.customization.type
              ? `🫧 Type: ${x.customization.type}`
              : ""
            }
          </div>
          `
          :""
        }

      </div>

      <div class="qty">

        <button onclick="change(${x.id},-1)">
          −
        </button>

        <span>
          ${x.qty}
        </span>

        <button onclick="change(${x.id},1)">
          +
        </button>

      </div>

    </div>

  `).join("")

  :`<p>Your cart is empty. Add a squishy to get started! 🧸</p>`;

  $("checkoutButton").disabled=!cart.length;
}

/* TOAST */
function toast(msg){

  const t=$("toast");

  t.textContent=msg;

  t.classList.add("show");

  setTimeout(
    ()=>t.classList.remove("show"),
    1800
  );
}

/* CART BUTTON */
$("cartButton").onclick=()=>{
  $("cartOverlay").classList.add("open");
};

$("closeCart").onclick=()=>{
  $("cartOverlay").classList.remove("open");
};

/* CHECKOUT */
$("checkoutButton").onclick=()=>{

  if(!cart.length)return;

  $("cartOverlay").classList.remove("open");

  $("checkoutOverlay").classList.add("open");
};

$("closeCheckout").onclick=()=>{
  $("checkoutOverlay").classList.remove("open");
};

/* CHECKOUT FORM */
$("checkoutForm").onsubmit=e=>{

  e.preventDefault();

  alert(
    "This is a demo checkout. No payment was taken. Your dad will need to connect a real payment processor before launch."
  );
};

/* START */
renderProducts();
renderCart();
