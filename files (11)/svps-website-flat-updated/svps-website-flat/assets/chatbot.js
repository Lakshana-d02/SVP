/* SVP Systems - simple rule-based site chatbot */
(function(){

  var WA_NUMBER = "919790868486";

  var QUICK_OPTIONS = [
    "RO purifier prices",
    "Inverter & battery",
    "Electrical work",
    "Plumbing work",
    "Shop timings & location",
    "Talk to a person"
  ];

  var RESPONSES = [
    {
      keys: ["ro", "purifier", "water", "aqua", "filter"],
      reply: "We sell and service all-brand RO purifiers (Aqualake, Aquaglory, Aquastar, Aquahexa, Aquadigi and more) with 1 year free service. Prices vary by model - check the Cart/Enquiry page or tap below to see the full RO range.",
      options: ["See RO range", "Talk to a person"]
    },
    {
      keys: ["inverter", "battery", "batteries", "ups", "power cut"],
      reply: "We stock tubular batteries and inverters from brands like Exide, Amaron, Luminous, Livfast, Microtek and Okaya. Share your home's load / backup hours need on WhatsApp and we'll suggest the right size.",
      options: ["See battery range", "Talk to a person"]
    },
    {
      keys: ["electric", "electrical", "wiring", "wire", "switch", "socket", "light", "fan", "mcb", "earthing"],
      reply: "Our electrical services (via NS Electrical & Plumbing Work) cover: house wiring, electrical installation, switch & socket repair, lighting installation, fan installation and electrical maintenance. Rates are quoted per square feet - ask us on WhatsApp for a quote.",
      options: ["Enquire on WhatsApp", "Plumbing work"]
    },
    {
      keys: ["plumb", "plumbing", "bathroom", "kitchen", "tap", "pipe", "sump", "motor", "bore"],
      reply: "Plumbing work (via NS Electrical & Plumbing Work) covers bathroom & kitchen fittings, wash basin/washing machine points, bore & sump motor fixing, booster pumps and bath tub/shower panel work. Ask us for a square feet rate on WhatsApp.",
      options: ["Enquire on WhatsApp", "Electrical work"]
    },
    {
      keys: ["time", "timing", "hours", "open", "close", "location", "address", "shop", "map", "where"],
      reply: "We're open Mon-Sat, 9:30 AM to 8:30 PM at Nandhivaram, Guduvanchery - 603 202. The map is on our About & Location page.",
      options: ["Open About page", "Talk to a person"]
    },
    {
      keys: ["price", "cost", "rate", "quote", "quotation"],
      reply: "Prices depend on the product/model or the job size, so the quickest way is to tell us what you need on WhatsApp and we'll quote you directly.",
      options: ["Talk to a person"]
    },
    {
      keys: ["warranty", "service", "guarantee"],
      reply: "RO purifiers come with 1 year free service. For electrical/plumbing work, ask us about the workmanship coverage when you enquire.",
      options: ["Talk to a person"]
    },
    {
      keys: ["number", "phone", "contact", "call", "whatsapp"],
      reply: "You can reach us on WhatsApp or call: +91 97908 68486 (G. Balamurugan) or +91 99406 60665 (T. Sivarajan).",
      options: ["Talk to a person"]
    },
    {
      keys: ["hi", "hello", "hey", "hlo", "hii"],
      reply: "Hi! I'm the SVP Systems assistant. I can help with RO purifiers, inverters & batteries, electrical work, plumbing work, or shop details. What do you need?",
      options: QUICK_OPTIONS
    },
    {
      keys: ["thank", "thanks", "ok", "okay", "great"],
      reply: "You're welcome! Anything else I can help with?",
      options: QUICK_OPTIONS
    }
  ];

  var FALLBACK = {
    reply: "I'm a simple assistant and might not have caught that. Here's what I can help with, or you can chat with our team directly on WhatsApp.",
    options: QUICK_OPTIONS.concat(["Talk to a person"])
  };

  function findResponse(text){
    var t = text.toLowerCase();
    for (var i=0;i<RESPONSES.length;i++){
      var r = RESPONSES[i];
      for (var j=0;j<r.keys.length;j++){
        if (t.indexOf(r.keys[j]) !== -1) return r;
      }
    }
    return null;
  }

  function waLink(msg){
    return "https://wa.me/" + WA_NUMBER + (msg ? ("?text=" + encodeURIComponent(msg)) : "");
  }

  function handleOption(label, addMsgs){
    var lower = label.toLowerCase();
    if (lower === "talk to a person" || lower === "enquire on whatsapp"){
      addMsgs.bot("Opening WhatsApp for you now - our team will reply directly there.", ["RO purifier prices","Inverter & battery","Electrical work","Plumbing work"]);
      window.open(waLink("Hi, I'd like to know more about your products/services."), "_blank");
      return;
    }
    if (lower === "see ro range"){
      addMsgs.bot("Sure - here's our RO purifier range.", ["Inverter & battery","Electrical work","Talk to a person"]);
      window.location.href = "cart.html?cat=ro";
      return;
    }
    if (lower === "see battery range"){
      addMsgs.bot("Sure - here's our inverter & battery range.", ["RO purifier prices","Electrical work","Talk to a person"]);
      window.location.href = "cart.html?cat=battery";
      return;
    }
    if (lower === "open about page"){
      addMsgs.bot("Taking you to our About & Location page.", ["Talk to a person"]);
      window.location.href = "about.html";
      return;
    }
    respond(label, addMsgs);
  }

  function respond(text, addMsgs){
    var match = findResponse(text);
    if (match){
      addMsgs.bot(match.reply, match.options || QUICK_OPTIONS);
    } else {
      addMsgs.bot(FALLBACK.reply, FALLBACK.options);
    }
  }

  function init(){
    if (document.getElementById("svp-chat-toggle")) return;

    var toggle = document.createElement("button");
    toggle.id = "svp-chat-toggle";
    toggle.className = "chat-toggle";
    toggle.setAttribute("aria-label", "Chat with SVP Systems assistant");
    toggle.innerHTML =
      '<svg class="chat-chat-icon" viewBox="0 0 24 24"><path d="M4 4h16a1 1 0 011 1v11a1 1 0 01-1 1H8l-4 4V5a1 1 0 011-1z"/></svg>' +
      '<svg class="chat-close-icon" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';

    var win = document.createElement("div");
    win.className = "chat-window";
    win.innerHTML =
      '<div class="chat-head">' +
        '<div class="chat-avatar">SV</div>' +
        '<div><div class="chat-title">SVP Systems Assistant</div><div class="chat-sub">Usually replies instantly</div></div>' +
        '<button class="chat-x" aria-label="Close chat">&times;</button>' +
      '</div>' +
      '<div class="chat-body" id="svp-chat-body"></div>' +
      '<div class="chat-options" id="svp-chat-options"></div>' +
      '<div class="chat-foot">' +
        '<input id="svp-chat-input" type="text" placeholder="Type your question...">' +
        '<button id="svp-chat-send" aria-label="Send">' +
          '<svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>' +
        '</button>' +
      '</div>';

    document.body.appendChild(toggle);
    document.body.appendChild(win);

    var body = win.querySelector("#svp-chat-body");
    var optsWrap = win.querySelector("#svp-chat-options");
    var input = win.querySelector("#svp-chat-input");
    var sendBtn = win.querySelector("#svp-chat-send");
    var closeBtn = win.querySelector(".chat-x");

    function scrollDown(){ body.scrollTop = body.scrollHeight; }

    function addMsg(role, text){
      var el = document.createElement("div");
      el.className = "chat-msg " + role;
      el.textContent = text;
      body.appendChild(el);
      scrollDown();
    }

    function setOptions(list){
      optsWrap.innerHTML = "";
      (list || []).forEach(function(label){
        var b = document.createElement("button");
        b.className = "chat-opt-btn";
        b.textContent = label;
        b.onclick = function(){
          addMsg("user", label);
          handleOption(label, addMsgs);
        };
        optsWrap.appendChild(b);
      });
    }

    var addMsgs = {
      bot: function(text, options){ addMsg("bot", text); setOptions(options); }
    };

    var opened = false;
    function openChat(){
      win.classList.add("open");
      toggle.classList.add("open");
      if (!opened){
        opened = true;
        addMsgs.bot("Hi! I'm the SVP Systems assistant. I can help with RO purifiers, inverters & batteries, electrical work, plumbing work, or shop details. What do you need?", QUICK_OPTIONS);
      }
    }
    function closeChat(){
      win.classList.remove("open");
      toggle.classList.remove("open");
    }

    toggle.onclick = function(){
      if (win.classList.contains("open")) closeChat(); else openChat();
    };
    closeBtn.onclick = closeChat;

    function submit(){
      var val = input.value.trim();
      if (!val) return;
      addMsg("user", val);
      input.value = "";
      respond(val, addMsgs);
    }
    sendBtn.onclick = submit;
    input.addEventListener("keydown", function(e){
      if (e.key === "Enter") submit();
    });
  }

  if (document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
