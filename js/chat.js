/* =============================================================================
   BuildResearch AI — site-wide chat widget
   Classic <script defer> (works on file:// — no modules). Injects its own DOM,
   so a single tag on each page renders the bubble + panel. No backend: replies
   are a friendly, keyword-routed concierge that points to the right pages and
   to the enquiry form. Cohesive with "The Institute" design system.
   ============================================================================= */
(function () {
  "use strict";
  if (document.getElementById("brchat")) return;
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- icons ---------------------------------------------------------------- */
  // Font Awesome 6 Free — solid "globe" (CC BY 4.0), inlined so it works offline.
  var globe = '<svg viewBox="0 0 512 512" fill="currentColor" aria-hidden="true"><path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/></svg>';
  // Font Awesome 6 Free — solid "comment-dots" (CC BY 4.0).
  var chatIc = '<svg viewBox="0 0 512 512" fill="currentColor" aria-hidden="true"><path d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3 0 0 0 0 0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM128 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm128 0a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm96 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>';
  var closeIc = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  var sendIc = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';

  /* ---- markup --------------------------------------------------------------- */
  var root = document.createElement("div");
  root.id = "brchat";
  root.className = "brchat";
  root.innerHTML =
    '<button class="brchat__fab" type="button" aria-label="Open BuildResearch AI chat" aria-expanded="false" aria-controls="brchat-panel">' +
      '<span class="ic-open" aria-hidden="true">' + chatIc + '</span>' +
      '<span class="ic-close" aria-hidden="true">' + closeIc + '</span>' +
      '<span class="brchat__fab-label">Ask BuildResearch&nbsp;AI</span>' +
    '</button>' +
    '<section class="brchat__panel" id="brchat-panel" role="dialog" aria-label="BuildResearch AI chat">' +
      '<header class="brchat__head">' +
        '<span class="brchat__avatar" aria-hidden="true">' + globe + '</span>' +
        '<div class="brchat__id">' +
          '<span class="name">BuildResearch AI</span>' +
        '</div>' +
        '<button class="brchat__close" type="button" aria-label="Close chat">' + closeIc + '</button>' +
      '</header>' +
      '<div class="brchat__body" aria-live="polite"></div>' +
      '<footer class="brchat__foot">' +
        '<form class="brchat__form" autocomplete="off">' +
          '<input class="brchat__input" type="text" name="q" aria-label="Type your message" placeholder="Ask about our services, work…" maxlength="500">' +
          '<button class="brchat__send" type="submit" aria-label="Send message">' + sendIc + '</button>' +
        '</form>' +
        '<p class="brchat__note">BuildResearch AI · a quick guide. For tailored advice, <a href="contact.html">start an enquiry</a>.</p>' +
      '</footer>' +
    '</section>';
  document.body.appendChild(root);

  var fab = root.querySelector(".brchat__fab");
  var panel = root.querySelector(".brchat__panel");
  var closeBtn = root.querySelector(".brchat__close");
  var body = root.querySelector(".brchat__body");
  var form = root.querySelector(".brchat__form");
  var input = root.querySelector(".brchat__input");

  /* ---- knowledge: keyword-routed replies ----------------------------------- */
  // Ordered by priority: when scores tie, the earlier entry wins. High-intent
  // topics (pricing, contact) sit above generic ones (portfolio) so words like
  // "work" or "project" don't hijack a cost/contact question.
  var FAQ = [
    { k: ["service", "offer", "what do you do", "what you do", "areas you"],
      a: "We work across three areas: <strong>Research &amp; Thought Leadership</strong>, <strong>Consulting</strong>, and <strong>Coaching &amp; Development</strong>. Explore them on our <a href=\"services.html\">Services page</a> — happy to point you to the right one." },
    { k: ["research", "thought leadership", "report", "study", "survey", "evidence", "data storytelling"],
      a: "Our flagship practice is full-service <strong>research &amp; thought leadership</strong> — from framing to publication and launch. See <a href=\"services.html#research\">Research &amp; Thought Leadership</a>." },
    { k: ["consult", "operating model", "governance", "function review", "maturity", "roadmap"],
      a: "Our <strong>consulting</strong> helps you re-vitalise or build a research function — reviews, standards, operating models and roadmaps. More on <a href=\"services.html#consulting\">Consulting</a>." },
    { k: ["coach", "training", "mentor", "develop", "skill", "upskill"],
      a: "We offer <strong>coaching &amp; development</strong> for researchers and teams — 1:1 coaching, capability programmes and methods training. See <a href=\"services.html#coaching\">Coaching &amp; Development</a>." },
    { k: ["think tank", "thinktank", "think-tank", "insight", "article", "blog"],
      a: "BuildResearch also operates as a strategic <strong>think tank</strong> — turning research into direction and insight. Explore the <a href=\"think-tank.html\">Think Tank</a>." },
    { k: ["price", "pricing", "cost", "quote", "fee", "budget", "how much", "rate"],
      a: "Every engagement is scoped to your needs, so we share pricing after a quick chat about your goals. <a href=\"contact.html\">Start an enquiry</a> and we'll put together the right approach." },
    { k: ["start", "project", "enquir", "get in touch", "talk", "speak", "contact", "reach", "work with", "hire", "appoint"],
      a: "The best next step is a short, no-obligation conversation. Tell us what you're working on via our <a href=\"contact.html\">enquiry form</a> and the right person will reply within two working days." },
    { k: ["portfolio", "case", "example", "your work", "client", "sector"],
      a: "We've delivered research for universities, policy bodies, professional bodies and commercial teams. Browse selected case studies in our <a href=\"portfolio.html\">Portfolio</a>." },
    { k: ["about us", "who are you", "who are", "your team", "the team", "company", "collective", "values"],
      a: "BuildResearch is a global research collective that turns evidence into influence. Learn more <a href=\"about.html\">About us</a>." },
    { k: ["thank", "thanks", "cheers", "appreciate"],
      a: "You're welcome! Anything else I can help you find?" },
    { k: ["hello", "hey", "hiya", "good morning", "good afternoon", "greetings"],
      a: "Hello! 👋 Ask me about our <strong>services</strong>, our <strong>work</strong>, the <strong>think tank</strong>, or how to <strong>start a project</strong>." }
  ];
  var FALLBACK = "I can help with our <strong>services</strong>, <strong>portfolio</strong>, the <strong>think tank</strong>, or <strong>starting a project</strong>. For anything specific, the team is happy to help — just <a href=\"contact.html\">start an enquiry</a>.";

  function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function hit(t, k) { return new RegExp("\\b" + esc(k)).test(t); }   // prefix word-boundary (matches stems: enquir→enquiry)
  function reply(text) {
    var t = " " + text.toLowerCase() + " ";
    var best = null, score = 0;
    for (var i = 0; i < FAQ.length; i++) {
      var s = 0;
      for (var j = 0; j < FAQ[i].k.length; j++) { if (hit(t, FAQ[i].k[j])) { s++; } }
      if (s > score) { score = s; best = FAQ[i]; }
    }
    return best ? best.a : FALLBACK;
  }

  /* ---- rendering ------------------------------------------------------------ */
  function scrollDown() { body.scrollTop = body.scrollHeight; }

  function addUser(text) {
    var row = document.createElement("div");
    row.className = "brchat__msg brchat__msg--user";
    var b = document.createElement("div");
    b.className = "brchat__bubble";
    b.textContent = text;                       // escape user input
    row.appendChild(b);
    body.appendChild(row);
    scrollDown();
  }

  function addBot(html) {
    var row = document.createElement("div");
    row.className = "brchat__msg brchat__msg--bot";
    row.innerHTML = '<span class="av" aria-hidden="true">' + globe + '</span><div class="brchat__bubble"></div>';
    var typing = document.createElement("span");
    typing.className = "brchat__typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    row.querySelector(".brchat__bubble").appendChild(typing);
    body.appendChild(row);
    scrollDown();
    var delay = reduce ? 180 : (480 + Math.random() * 360);
    setTimeout(function () {
      row.querySelector(".brchat__bubble").innerHTML = html;
      scrollDown();
    }, delay);
  }

  var suggestions = ["What services do you offer?", "Tell me about your work", "How do I start a project?"];
  function addGreeting() {
    addBot("Hi, I'm <strong>BuildResearch&nbsp;AI</strong> — your guide to our research, services and work. What can I help you find today?");
    var wrap = document.createElement("div");
    wrap.className = "brchat__sugg";
    suggestions.forEach(function (s) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = s;
      btn.addEventListener("click", function () { send(s); });
      wrap.appendChild(btn);
    });
    var hold = reduce ? 200 : 900;
    setTimeout(function () { body.appendChild(wrap); scrollDown(); }, hold);
  }

  function send(text) {
    text = (text || "").trim();
    if (!text) return;
    var sugg = body.querySelector(".brchat__sugg");
    if (sugg) { sugg.parentNode.removeChild(sugg); }
    addUser(text);
    addBot(reply(text));
  }

  /* ---- open / close --------------------------------------------------------- */
  var started = false;
  function isMobile() { return window.matchMedia("(max-width: 560px)").matches; }
  function open() {
    root.classList.add("is-open");
    fab.setAttribute("aria-expanded", "true");
    if (isMobile()) { document.documentElement.classList.add("brchat-lock"); }
    if (!started) { started = true; addGreeting(); }
    setTimeout(function () { input.focus(); }, reduce ? 0 : 280);
  }
  function close() {
    root.classList.remove("is-open");
    fab.setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("brchat-lock");
    fab.focus();
  }
  function toggle() { root.classList.contains("is-open") ? close() : open(); }

  fab.addEventListener("click", toggle);
  closeBtn.addEventListener("click", close);
  form.addEventListener("submit", function (e) { e.preventDefault(); send(input.value); input.value = ""; input.focus(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && root.classList.contains("is-open")) { close(); }
  });
})();
