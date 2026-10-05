const products=[
{id:1,name:"Rice Squishy",price:6,emoji:"🍚",art:"p1",desc:"A cute handmade rice squishy."},
{id:2,name:"Custom Squishy",price:10,emoji:"🎨",art:"p2",desc:"A custom squishy made just for you."},
{id:3,name:"Keychain Fidget",price:2,emoji:"🔑",art:"p3",desc:"A tiny fidget you can take anywhere."},
{id:4,name:"Custom Fidget",price:7,emoji:"✨",art:"p4",desc:"A handmade custom fidget made your way."}
];
let cart=JSON.parse(localStorage.getItem("squishCart")||"[]");
const $=id=>document.getElementById(id);
function money(n){return "$"+n.toFixed(2)}
function save(){localStorage.setItem("squishCart",JSON.stringify(cart));renderCart()}
function add(id){const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({...p,qty:1});save();toast("Added to your cart! 💕")}
function change(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);save()}
function renderProducts(){$("products").innerHTML=products.map(p=>`<article class="product"><div class="product-art ${p.art}">${p.emoji}</div><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add" onclick="add(${p.id})">Add +</button></div></article>`).join("")}
function renderCart(){const count=cart.reduce((s,x)=>s+x.qty,0);$("cartCount").textContent=count;const total=cart.reduce((s,x)=>s+x.price*x.qty,0);$("cartTotal").textContent=money(total);$("checkoutTotal").textContent=money(total);$("cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-item"><div><strong>${x.emoji} ${x.name}</strong><div>${money(x.price)} each</div></div><div class="qty"><button onclick="change(${x.id},-1)">−</button><span>${x.qty}</span><button onclick="change(${x.id},1)">+</button></div></div>`).join(""):`<p>Your cart is empty. Add a squishy to get started! 🧸</p>`;$("checkoutButton").disabled=!cart.length}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
$("cartButton").onclick=()=>$("cartOverlay").classList.add("open");
$("closeCart").onclick=()=>$("cartOverlay").classList.remove("open");
$("checkoutButton").onclick=()=>{if(!cart.length)return;$("cartOverlay").classList.remove("open");$("checkoutOverlay").classList.add("open")};
$("closeCheckout").onclick=()=>$("checkoutOverlay").classList.remove("open");
$("checkoutForm").onsubmit=e=>{e.preventDefault();alert("This is a demo checkout. No payment was taken. Your dad will need to connect a real payment processor before launch.");};
renderProducts();renderCart();
