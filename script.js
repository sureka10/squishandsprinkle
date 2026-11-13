
const products=[
  {id:2,name:"Custom Squishy",price:10,emoji:"🎨",art:"p2",desc:"A custom squishy made just for you."},
  {id:3,name:"Keychain Fidget",price:2,emoji:"🔑",art:"p3",desc:"A tiny fidget you can take anywhere."},
  {id:4,name:"Custom Fidget",price:6,emoji:"✨",art:"p4",desc:"Choose your color and fidget style."},
  {id:5,name:"Balloon Squishy",price:7,emoji:"🎈",art:"p5",desc:"Choose your favorite balloon squishy filling."},
  {id:6,name:"DIY Dumpling",price:8,emoji:"🥟",art:"p6",desc:"A fun DIY dumpling squishy."}
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
  if(!p)return;

  if(id===2){
    customizeSquishy();
    return;
  }

  if(id===4){
    customizeFidget();
    return;
  }

  if(id===5){
    customizeBalloon();
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
  if(!color)return;

  const airChoice=prompt(
    "💨 Choose one:\n\nAir\nNo Air"
  );
  if(!airChoice)return;

  const beadsChoice=prompt(
    "✨ Crunchy beads are included FREE!\n\nWould you like crunchy beads?\n\nYes\nNo"
  );
  if(!beadsChoice)return;

  if(!["yes","no"].includes(beadsChoice.trim().toLowerCase())){
    alert("Please choose Yes or No.");
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
      crunchyBeads:beadsChoice.trim().toLowerCase()==="yes"?"Yes":"No"
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
  if(!color)return;

  const type=prompt(
    "✨ Choose your fidget type:\n\n1. Keychain\n2. Sliding Marble Fidget"
  );
  if(!type)return;

  let fidgetType;

  if(type==="1" || type.toLowerCase()==="keychain"){
    fidgetType="Keychain";
  }
  else if(type==="2" || type.toLowerCase()==="sliding marble fidget"){
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

/* BALLOON SQUISHY */
function customizeBalloon(){
  const filling=prompt(
    "🎈 Choose your Balloon Squishy filling:\n\n1. Soft Kinetic Sand\n2. Gel\n3. Water"
  );
  if(!filling)return;

  let selectedFilling;

  if(filling==="1" || filling.toLowerCase()==="soft kinetic sand"){
    selectedFilling="Soft Kinetic Sand";
  }
  else if(filling==="2" || filling.toLowerCase()==="gel"){
    selectedFilling="Gel";
  }
  else if(filling==="3" || filling.toLowerCase()==="water"){
    selectedFilling="Water";
  }
  else{
    alert("Please choose 1, 2, or 3.");
    return;
  }

  const customItem={
    id:Date.now(),
    baseId:5,
    name:"Balloon Squishy",
    price:7,
    emoji:"🎈",
    qty:1,
    customization:{
      filling:selectedFilling
    }
  };

  cart.push(customItem);
  save();
  toast("Balloon Squishy added! 🎈");
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
        <span class="price">${money(p.price)}</span>

        <button class="add" onclick="add(${p.id})">
          ${
            [2,4,5].includes(p.id)
            ? "Customize 💕"
            : "Add +"
          }
        </button>
      </div>
    </article>
  `).join("");
}

/* CART */
function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0);
  $("cartCount").textContent=count;

  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  $("cartTotal").textContent=money(total);
  $("checkoutTotal").textContent=money(total);

  $("cartItems").innerHTML=cart.length
  ?cart.map(x=>`
    <div class="cart-item">
      <div>
        <strong>${x.emoji} ${x.name}</strong>
        <div>${money(x.price)} each</div>

        ${
          x.customization
          ?`
            <div>
              ${x.customization.color?`🎨 Color: ${x.customization.color}<br>`:""}
              ${x.customization.air?`💨 ${x.customization.air}<br>`:""}
              ${x.customization.crunchyBeads?`✨ Crunchy Beads: ${x.customization.crunchyBeads}<br>`:""}
              ${x.customization.filling?`🎈 Filling: ${x.customization.filling}<br>`:""}
              ${x.customization.type?`🫧 Type: ${x.customization.type}`:""}
            </div>
          `
          :""
        }
      </div>

      <div class="qty">
        <button onclick="change(${x.id},-1)">−</button>
        <span>${x.qty}</span>
        <button onclick="change(${x.id},1)">+</button>
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

  setTimeout(()=>t.classList.remove("show"),1800);
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
    "This is a demo checkout. No payment was taken. Your dad will need to connect real payment processing before launch."
  );
};

/* START */
renderProducts();
renderCart();
