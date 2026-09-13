/* Sri Vinayaga Power System - shared site data & cart logic
   Products are stored in localStorage under 'svps_products' so the
   Admin page can edit name/price/text and it reflects across the site.
   NOTE: since this is a plain static site (no server), localStorage is
   used for the cart and for admin edits made on the same browser/device.
*/

/* Where customer enquiries (name, phone, address) get saved.
   -------------------------------------------------------------
   Paste your Google Sheet's web app link here - see the folder
   "google-sheet-setup" (SETUP-INSTRUCTIONS.txt) for the easy,
   5-minute, no-coding steps to get this link from your own
   Google account. Until you set this, the site still works
   perfectly for browsing and WhatsApp enquiries - it just won't
   save a copy of customer details anywhere for you to review. */
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbyF_ffBeutbL54FiZU1oR9uPp6FmF18K88RNhVMCh-0SJqVZAhJNjQbva_K2gvbquyB/exec";

function saveCustomerToBackend(customer){
  if(!BACKEND_URL) return;
  fetch(BACKEND_URL, {
    method: "POST",
    mode: "no-cors", // Google Apps Script web apps require this from a plain website
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(customer),
  }).catch(()=>{ /* offline or not set up yet - WhatsApp flow still works either way */ });
}

const WHATSAPP_NUMBER = "919790868486"; // G. Balamurugan - SVP Systems
const SHOP_PHONES = ["9790868486", "9940660665", "8667411570"];
const SHOP_ADDRESS = "Nandhivaram, Guduvanchery - 603 202";

const DEFAULT_PRODUCTS = [
  { id:"ro-aquajade", cat:"RO Purifier", name:"Aqua Jade", brand:"Nile", desc:"RO+UV+UF purifier range. Ask us for capacity, stages and price.", img:"assets/products/ro-aquajade.png",
    colors:["Black","Blue","Gray","Aqua Green"] },
  { id:"ro-aquaorca", cat:"RO Purifier", name:"Aqua Orca", brand:"Canix", desc:"Advanced RO purification, high storage capacity. Ask us for capacity, stages and price.", img:"assets/products/ro-aquaorca.png",
    colors:["Silver Blue","Slate Grey","Pastel Green","Snow White"] },
  { id:"ro-aquav5", cat:"RO Purifier", name:"Aqua V5", desc:"Multi-stage RO purification with 9L storage tank. Ask us for capacity, stages and price.", img:"assets/products/ro-aquav5.png",
    colors:["Blue (V111)","Maroon (V112)","Black (V101)","Silver Grey (V113)","White (V114)"] },
  { id:"ro-aquaera", cat:"RO Purifier", name:"Aqua Era", desc:"Advanced purification, stylish performance, 9L storage tank. Ask us for capacity, stages and price.", img:"assets/products/ro-aquaera.png",
    colors:["Silk Blue","Forest Blue","Silk Beige","Pearl White","Charcoal Black"] },
  { id:"ro-dolphinera", cat:"RO Purifier", name:"Dolphin Era", desc:"Reverse osmosis system. Ask us for capacity, stages and price.", img:"assets/products/ro-dolphinera.png",
    colors:["Aqua Green"] },
  { id:"batt-amaron", cat:"Battery", name:"Amaron", desc:"Tall tubular inverter batteries. Ask us for Ah rating, warranty and back-up hours.", img:"assets/products/batt-amaron.png" },
  { id:"batt-luminous", cat:"Battery", name:"Luminous", desc:"Tubular inverter batteries with long back-up. Ask us for Ah rating and warranty.", img:"assets/products/batt-luminous.png" },
  { id:"batt-exide", cat:"Battery", name:"Exide", desc:"Tubular inverter batteries. Ask us for Ah rating, warranty and back-up hours.", img:"assets/products/batt-exide.png" },
  { id:"batt-microtek", cat:"Battery", name:"Microtek", desc:"Inverters and advanced tubular batteries. Ask us for Ah rating and warranty.", img:"assets/products/batt-microtek.png" },
  { id:"batt-okaya", cat:"Battery", name:"Okaya", desc:"Tall tubular inverter batteries. Ask us for Ah rating and warranty.", img:"assets/products/batt-okaya.png" },
  { id:"batt-genus", cat:"Battery", name:"Genus", desc:"Inverter batteries. Ask us for available models, Ah rating and warranty.", img:"assets/brands/batt-genus.png" },
  { id:"batt-mtekpower", cat:"Battery", name:"Mtekpower", desc:"Long-life advanced tubular batteries. Ask us for Ah rating and warranty.", img:"assets/products/batt-microtek.png" },
  { id:"batt-livfast", cat:"Battery", name:"Livfast", desc:"Tall tubular inverter batteries. Ask us for Ah rating, warranty and back-up hours.", img:"assets/products/batt-livfast.png" },
];

function getProducts(){
  try{
    const raw = localStorage.getItem("svps_products");
    if(raw) return JSON.parse(raw);
  }catch(e){}
  return DEFAULT_PRODUCTS;
}
function saveProducts(list){
  localStorage.setItem("svps_products", JSON.stringify(list));
}
function resetProducts(){
  localStorage.removeItem("svps_products");
}

function getCart(){
  try{ return JSON.parse(localStorage.getItem("svps_cart")||"[]"); }catch(e){ return []; }
}
function saveCart(cart){
  localStorage.setItem("svps_cart", JSON.stringify(cart));
  updateCartBadge();
}
function addToCart(id, qty, color){
  qty = qty || 1;
  color = color || "";
  const cart = getCart();
  const line = cart.find(c=>c.id===id && (c.color||"")===color);
  if(line){ line.qty += qty; } else { cart.push({id, qty, color}); }
  saveCart(cart);
}
function removeFromCart(id, color){
  color = color || "";
  saveCart(getCart().filter(c=>!(c.id===id && (c.color||"")===color)));
}
function cartCount(){
  return getCart().reduce((n,c)=>n+c.qty,0);
}
function updateCartBadge(){
  document.querySelectorAll("#cart-count").forEach(el=>{
    const n = cartCount();
    el.textContent = n;
    el.style.display = n>0 ? "flex" : "none";
  });
}

function money(n){
  return "\u20b9" + Number(n).toLocaleString("en-IN");
}

function buildWhatsAppMessage(customer){
  const cart = getCart();
  const products = getProducts();
  let lines = [];
  lines.push(`Hi SVP Systems, I'd like to enquire about:`);
  cart.forEach(c=>{
    const p = products.find(p=>p.id===c.id);
    if(!p) return;
    lines.push(`- ${p.name} (${p.cat}) x${c.qty}`);
  });
  if(!cart.length){
    lines.push(`(General enquiry - no items selected)`);
  }
  lines.push(`Please share available models, pricing and warranty details.`);
  if(customer && customer.name) lines.push(`Name: ${customer.name}`);
  if(customer && customer.area) lines.push(`Area: ${customer.area}`);
  if(customer && customer.note) lines.push(`Note: ${customer.note}`);
  return lines.join("\n");
}

function openWhatsApp(message){
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function toggleMobileNav(){
  document.querySelector("nav.links").classList.toggle("open");
}

/* Scroll-reveal animation: any element with class "reveal" fades/slides
   into place the first time it enters the viewport. Cards inside a
   "reveal-group" are staggered automatically via CSS nth-child delays. */
function initScrollReveal(){
  const targets = document.querySelectorAll(".reveal");
  if(!targets.length) return;
  if(!("IntersectionObserver" in window)){
    targets.forEach(el=>el.classList.add("in-view"));
    return;
  }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.12, rootMargin:"0px 0px -40px 0px" });
  targets.forEach(el=>io.observe(el));
}

/* Header shadow + shrink once the page scrolls past the hero. */
function initHeaderScrollState(){
  const header = document.querySelector("header.site");
  if(!header) return;
  const onScroll = ()=> header.classList.toggle("scrolled", window.scrollY > 12);
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();
}

/* Click-to-zoom lightbox: any image with class "zoomable" opens in a
   large centered overlay when clicked, so customers can see product
   photos closely / from a bigger view before enquiring. */
function initImageLightbox(){
  if(document.getElementById("svps-lightbox")) return;
  const overlay = document.createElement("div");
  overlay.id = "svps-lightbox";
  overlay.className = "lightbox-overlay";
  overlay.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <img class="lightbox-img" alt="">
  `;
  document.body.appendChild(overlay);
  const imgEl = overlay.querySelector(".lightbox-img");

  function open(src, alt){
    imgEl.src = src;
    imgEl.alt = alt || "";
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close(){
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  overlay.addEventListener("click", (e)=>{ if(e.target === overlay || e.target.classList.contains("lightbox-close")) close(); });
  document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") close(); });

  document.addEventListener("click", (e)=>{
    const el = e.target.closest(".zoomable");
    if(!el) return;
    e.preventDefault();
    open(el.getAttribute("src"), el.getAttribute("alt"));
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  updateCartBadge();
  initScrollReveal();
  initHeaderScrollState();
  initImageLightbox();
});
