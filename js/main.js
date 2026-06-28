/* =============================================================
   BuildResearch — site interactions
   - Sticky header shadow on scroll
   - Scroll progress bar
   - Mobile navigation (accessible toggle)
   - Scroll-reveal animations (IntersectionObserver)
   - Subtle parallax on [data-parallax]
   - Number count-up for stats
   - Animated hero background (canvas constellation)
   - Footer year + contact form validation
   ============================================================= */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");

  /* ---------- Scroll progress bar ---------- */
  var progress = document.querySelector(".scroll-progress");

  var ticking = false;
  function onScrollFrame() {
    var y = window.scrollY || window.pageYOffset;
    if (header) { header.classList.toggle("is-scrolled", y > 8); }
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? y / h : 0;
      progress.style.transform = "scaleX(" + p.toFixed(4) + ")";
    }
    // Parallax
    if (!prefersReduced) {
      for (var i = 0; i < parallaxEls.length; i++) {
        var el = parallaxEls[i];
        var rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          var speed = parseFloat(el.getAttribute("data-parallax")) || 0.12;
          var offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
          el.style.transform = "translate3d(0," + offset.toFixed(1) + "px,0)";
        }
      }
    }
    ticking = false;
  }
  function requestScroll() {
    if (!ticking) { window.requestAnimationFrame(onScrollFrame); ticking = true; }
  }
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  window.addEventListener("scroll", requestScroll, { passive: true });
  window.addEventListener("resize", requestScroll, { passive: true });
  onScrollFrame();

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.querySelector(".nav__menu");

  if (toggle && menu) {
    var closeMenu = function () {
      toggle.classList.remove("is-open");
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("body-lock");
    };
    var openMenu = function () {
      toggle.classList.add("is-open");
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("body-lock");
    };
    toggle.addEventListener("click", function () {
      if (menu.classList.contains("is-open")) { closeMenu(); } else { openMenu(); }
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { closeMenu(); }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) { closeMenu(); }
    });
  }

  /* ---------- Scroll-reveal + count-up triggers ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-img");
  var countEls = document.querySelectorAll("[data-count]");

  function runCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1400, start = null;
    if (prefersReduced || isNaN(target)) { el.textContent = (isNaN(target) ? el.textContent : target) + suffix; return; }
    function tick(ts) {
      if (!start) { start = ts; }
      var prog = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - prog, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (prog < 1) { requestAnimationFrame(tick); }
    }
    requestAnimationFrame(tick);
  }

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
    countEls.forEach(runCount);
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          if (entry.target.hasAttribute("data-count")) { runCount(entry.target); }
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
    countEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Animated hero background (constellation) ---------- */
  var canvas = document.querySelector(".hero__bg");
  if (canvas && canvas.getContext && !prefersReduced) {
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W, H, points, raf;
    var COUNT = 0;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      COUNT = Math.max(18, Math.min(48, Math.round(W / 32)));
      points = [];
      for (var i = 0; i < COUNT; i++) {
        points.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.6 + 0.6,
          gold: Math.random() < 0.16
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      // Only paint over the left ~62% (right side holds the image panel)
      var limit = W * 0.62;
      for (var i = 0; i < points.length; i++) {
        var p = points[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) { p.vx *= -1; }
        if (p.y < 0 || p.y > H) { p.vy *= -1; }

        // connections
        for (var j = i + 1; j < points.length; j++) {
          var q = points[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && p.x < limit && q.x < limit) {
            var a = (1 - dist / 120) * 0.16;
            ctx.strokeStyle = "rgba(58,82,119," + a.toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        // node
        var fade = p.x < limit ? 1 : Math.max(0, 1 - (p.x - limit) / (W * 0.2));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = (p.gold ? "rgba(200,146,74," : "rgba(58,82,119,") + (0.5 * fade).toFixed(3) + ")";
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    }

    var ro = ("ResizeObserver" in window) ? new ResizeObserver(resize) : null;
    resize();
    if (ro) { ro.observe(canvas.parentElement); } else { window.addEventListener("resize", resize); }
    draw();

    // Pause when off-screen to save battery
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { if (!raf) { draw(); } }
          else { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0 }).observe(canvas);
    }
  }

  /* ---------- Contact form ---------- */
  var form = document.querySelector("#contact-form");
  if (form) {
    var success = document.querySelector("#form-success");
    var setError = function (field, on) {
      var wrap = field.closest(".field");
      if (wrap) { wrap.classList.toggle("is-error", on); }
    };
    var validEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      var name = form.querySelector("#name");
      var email = form.querySelector("#email");
      var message = form.querySelector("#message");

      [name, message].forEach(function (f) {
        var bad = !f.value.trim();
        setError(f, bad);
        if (bad) { ok = false; }
      });
      var emailBad = !validEmail(email.value.trim());
      setError(email, emailBad);
      if (emailBad) { ok = false; }

      if (!ok) {
        var firstErr = form.querySelector(".is-error input, .is-error textarea");
        if (firstErr) { firstErr.focus(); }
        return;
      }
      // No backend wired in this static build — show confirmation.
      // To receive submissions: set the form `action` to your Formspree URL
      // and allow the native POST (remove this preventDefault path).
      form.hidden = true;
      if (success) {
        success.classList.add("is-visible");
        success.setAttribute("tabindex", "-1");
        success.focus();
        success.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
      }
    });

    form.querySelectorAll("input, textarea, select").forEach(function (f) {
      f.addEventListener("input", function () { setError(f, false); });
    });
  }
})();
