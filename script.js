/* =====================================================================
   F* SMASHING — interactions
   ===================================================================== */
(function () {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---- Image fallback: never show a broken image ---- */
  document.addEventListener("error", (e) => {
    const el = e.target;
    if (el.tagName === "IMG" && !el.dataset.failed && el.id !== "lbImg" &&
        !el.closest(".stack__card") && !el.closest(".delivery__logo") &&
        !el.closest(".signature__media") && el.getAttribute("src")) {
      el.dataset.failed = "1";
      const box = el.closest(".story__media, .signature__media") || el.parentElement;
      box.classList.add("img-fallback");
      if (!box.getAttribute("data-label")) box.setAttribute("data-label", el.getAttribute("alt") || "F* Smashing");
      el.style.visibility = "hidden";
    }
  }, true);

  /* ---- Preloader ---- */
  const preloader = $("#preloader");
  const hidePreloader = () => preloader && preloader.classList.add("done");
  window.addEventListener("load", () => setTimeout(hidePreloader, 350));
  setTimeout(hidePreloader, 2500); // safety net

  /* ---- Year + date minimum ---- */
  $("#year").textContent = new Date().getFullYear();
  const dateInput = $("#r-date");
  if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

  /* ---- Highlight today's opening hours ---- */
  const today = new Date().getDay(); // 0 Sun .. 6 Sat
  $$("#hours li").forEach((li) => {
    const days = (li.dataset.day || "").split(",").map(Number);
    if (days.includes(today)) li.classList.add("today");
  });

  /* ---- Navbar removed (kept in DOM but permanently hidden) ---- */
  const nav = $("#nav");
  let ticking = false;
  function onScroll() {
    ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---- Hero: scroll-driven barbed-wire reveal (circle -> line) ---- */
  const hero = $("#hero");
  const stage = $("#heroStage");
  const wireSvg = $("#heroWire");
  const wireA = $("#wireA");
  const wireB = $("#wireB");
  const wireBarbs = $("#wireBarbs");
  const heroLogo = $("#heroLogo");
  const revs = heroLogo ? $$(".hero-rev", heroLogo) : [];
  const lGap = $(".l-gap");
  const heroTag = $("#heroTag");
  const heroCue = $("#heroCue");
  if (hero && stage && wireSvg) {
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const easeInOut = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
    const easeOut = (x) => 1 - Math.pow(1 - x, 3);
    const N = 300;
    let W = 0, H = 0, R = 0, L = 0, cx = 0, cy = 0;
    function measure() {
      W = stage.clientWidth; H = stage.clientHeight;
      wireSvg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      cx = W / 2; cy = H / 2;
      R = Math.min(W, H) * 0.28;
      L = 2 * Math.PI * R;
    }
    function draw(p) {
      if (!W) measure();
      // Phase 1: the wire opens (circle -> straight line). Phase 2: letters reveal.
      const wireP = clamp(p / 0.55, 0, 1);
      const letterP = clamp((p - 0.55) / 0.4, 0, 1);
      const r = R / Math.max(1 - wireP, 1e-4);
      const Phi = L / r;
      const midY = (cy + R) + (H * 0.86 - (cy + R)) * easeInOut(wireP);
      const A = 2;                         // strand separation (tighter oval, match divider)
      const WL = 96;                       // almond length * 2 (match divider tile)
      let dA = "", dB = "", b = "";
      for (let i = 0; i <= N; i++) {
        const frac = i / N;
        const a = (frac - 0.5) * Phi;
        const cxp = cx + r * Math.sin(a);
        const cyp = midY - r * (1 - Math.cos(a));
        const nrm = -a + Math.PI / 2;
        const nx = Math.cos(nrm), ny = Math.sin(nrm);
        const off = A * Math.sin(frac * L / WL * 2 * Math.PI);
        dA += (i === 0 ? "M" : "L") + (cxp + nx * off).toFixed(1) + " " + (cyp + ny * off).toFixed(1) + " ";
        dB += (i === 0 ? "M" : "L") + (cxp - nx * off).toFixed(1) + " " + (cyp - ny * off).toFixed(1) + " ";
      }
      wireA.setAttribute("d", dA);
      wireB.setAttribute("d", dB);
      const SB = 48, hl = 8, SLASH = -1.05;  // 3 angled slashes at every crossing (match divider)
      for (let s = 0; s < L - 1; s += SB) {
        const frac = s / L, a = (frac - 0.5) * Phi;
        const cxp = cx + r * Math.sin(a), cyp = midY - r * (1 - Math.cos(a));
        const tau = -a;
        const tx = Math.cos(tau), ty = Math.sin(tau);
        const sx = Math.cos(tau + SLASH), sy = Math.sin(tau + SLASH);
        for (const o of [-5, 0, 5]) {
          const mx = cxp + o * tx, my = cyp + o * ty;
          b += "M" + (mx - hl * sx).toFixed(1) + " " + (my - hl * sy).toFixed(1) + "L" + (mx + hl * sx).toFixed(1) + " " + (my + hl * sy).toFixed(1) + " ";
        }
      }
      wireBarbs.setAttribute("d", b);
      // Letters appear one-by-one, each fading from translucent to clear.
      const T = revs.length || 1;
      const stagger = 0.6 / T;
      for (let k = 0; k < revs.length; k++) {
        const lpl = easeOut(clamp((letterP - k * stagger) / (stagger * 2.2), 0, 1));
        const el = revs[k];
        el.style.maxWidth = lpl.toFixed(3) + "em";
        el.style.opacity = lpl.toFixed(3);
        el.style.transform = "translateY(" + ((1 - lpl) * 0.12).toFixed(3) + "em)";
      }
      if (lGap) lGap.style.width = (easeOut(clamp(letterP / 0.16, 0, 1)) * 0.32).toFixed(3) + "em";
      if (heroTag) heroTag.style.opacity = clamp((p - 0.9) / 0.1, 0, 1);
      if (heroCue) heroCue.style.opacity = 1 - clamp(p / 0.06, 0, 1);
    }
    function progress() {
      const total = hero.offsetHeight - stage.offsetHeight;
      return total > 0 ? clamp(-hero.getBoundingClientRect().top, 0, total) / total : 0;
    }
    let hraf = false;
    function onHeroScroll() {
      if (hraf) return; hraf = true;
      requestAnimationFrame(() => { draw(progress()); hraf = false; });
    }
    measure();
    if (reduceMotion) { draw(1); }
    else {
      draw(progress());
      window.addEventListener("scroll", onHeroScroll, { passive: true });
    }
    window.addEventListener("resize", () => { measure(); draw(reduceMotion ? 1 : progress()); });
  }

  /* ---- Mobile drawer ---- */
  const burger = $("#burger");
  const drawer = $("#drawer");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Κλείσιμο μενού" : "Άνοιγμα μενού");
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  $$("#drawer a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---- Smooth in-page links (close drawer; native smooth handles scroll) ---- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); }
      }
    });
  });

  /* ---- Scroll reveal ---- */
  const reveals = $$(".reveal, .wire-edge");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---- Active nav link on scroll ---- */
  const sections = ["#menu", "#gallery", "#reserve", "#contact"]
    .map((id) => document.querySelector(id)).filter(Boolean);
  const navLinks = $$(".nav__links a");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const id = "#" + en.target.id;
          navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---- Counters ---- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const valEl = el.querySelector(".val") || el;
    if (reduceMotion) { valEl.textContent = target.toFixed(decimals); return; }
    const dur = 1500;
    const start = performance.now();
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      valEl.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
      else valEl.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(step);
  }
  const counters = $$(".stat__num");
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => co.observe(c));
  } else counters.forEach(animateCount);

  /* ---- Menu tabs ---- */
  const tabs = $$(".menu__tab");
  const menuArt = $("#menuArt");
  const menuWord = $("#menuWord");
  const menuTitles = {
    burgers: ["το", "smash"],
    chicken: ["το", "chicken"],
    wings: ["τα", "wings"],
    sandos: ["το", "sando"],
    sides: ["τα", "sides"],
    salads: ["τη", "σαλάτα"],
    dips: ["το", "dip"],
  };
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const panelId = tab.dataset.panel;
      tabs.forEach((t) => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      tab.classList.add("active"); tab.setAttribute("aria-selected", "true");
      $$(".menu__panel").forEach((p) => {
        const on = p.id === "panel-" + panelId;
        p.classList.toggle("active", on);
        p.hidden = !on;
      });
      const t = menuTitles[panelId];
      if (t && menuWord) { menuArt.textContent = t[0]; menuWord.textContent = t[1]; }
    });
  });

  /* ---- Gallery: vertical image stack ----
     Your real photos load from assets/gallery/0X.jpg; if a file isn't there yet,
     it falls back to a stock food photo so nothing looks broken. */
  const stackEl = $("#stack");
  const lightbox = $("#lightbox");
  const lbImg = $("#lbImg");

  const uns = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&q=80`;
  const galleryImages = [
    { file: "assets/gallery/1.png", fb: uns("1551782450-a2132b4ba21d"), title: "Signature cocktail",       alt: "Signature cocktail του F* Smashing" },
    { file: "assets/gallery/2.png", fb: uns("1607013251379-e6eecfffe234"), title: "Tenders & πατάτες",       alt: "Chicken tenders με πατάτες και dips στο Silk" },
    { file: "assets/gallery/3.png", fb: uns("1586190848861-99aa4a171e90"), title: "Τραγανές κροκέτες",       alt: "Τραγανές κροκέτες με τυρί παρμεζάνα" },
    { file: "assets/gallery/4.png", fb: uns("1610440042657-612c34d95e9f"), title: "Smash sandwich stack",    alt: "Stack από smash sandwiches" },
    { file: "assets/gallery/5.png", fb: uns("1568901346375-23c9450c58cd"), title: "Crispy chicken sandwich", alt: "Crispy chicken sandwich με coleslaw" },
  ];

  if (stackEl) {
    const viewport = $("#stackViewport");
    const dotsWrap = $("#stackDots");
    const curEl = $("#stackCur");
    const n = galleryImages.length;
    let currentIndex = 0;
    let lastNav = 0;
    const cards = [];
    const dots = [];

    $("#stackTotal").textContent = String(n).padStart(2, "0");

    galleryImages.forEach((img, i) => {
      const card = document.createElement("div");
      card.className = "stack__card";
      const el = document.createElement("img");
      el.alt = img.alt; el.decoding = "async"; el.draggable = false;
      el.addEventListener("error", () => {
        if (!el.dataset.fb) { el.dataset.fb = "1"; el.src = img.fb; }
        else if (!el.dataset.failed) {
          el.dataset.failed = "1"; el.style.visibility = "hidden";
          card.classList.add("img-fallback"); card.setAttribute("data-label", img.title);
        }
      });
      el.src = img.file;
      const cap = document.createElement("div");
      cap.className = "cap"; cap.textContent = img.title;
      card.appendChild(el); card.appendChild(cap);
      viewport.appendChild(card); cards.push(card);

      const dot = document.createElement("button");
      dot.type = "button"; dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Φωτογραφία " + (i + 1) + ": " + img.title);
      dot.addEventListener("click", () => setIndex(i));
      dotsWrap.appendChild(dot); dots.push(dot);
    });

    function layout() {
      const h = stackEl.clientHeight || 600;
      const s1 = h * 0.27, s2 = h * 0.47;
      cards.forEach((card, index) => {
        let diff = index - currentIndex;
        if (diff > n / 2) diff -= n;
        if (diff < -n / 2) diff += n;
        let y = 0, scale = 1, opacity = 1, z = 5, rot = 0;
        if (diff === -1) { y = -s1; scale = .82; opacity = .6; z = 4; rot = 8; }
        else if (diff === -2) { y = -s2; scale = .7; opacity = .3; z = 3; rot = 15; }
        else if (diff === 1) { y = s1; scale = .82; opacity = .6; z = 4; rot = -8; }
        else if (diff === 2) { y = s2; scale = .7; opacity = .3; z = 3; rot = -15; }
        else if (diff !== 0) { y = diff > 0 ? h * 0.66 : -h * 0.66; scale = .6; opacity = 0; z = 0; }
        card.style.transform = `translateY(${y}px) scale(${scale}) rotateX(${rot}deg)`;
        card.style.opacity = opacity;
        card.style.zIndex = z;
        card.style.pointerEvents = diff === 0 ? "auto" : "none";
        card.classList.toggle("is-front", diff === 0);
        card.setAttribute("aria-hidden", String(diff !== 0));
      });
      curEl.textContent = String(currentIndex + 1).padStart(2, "0");
      dots.forEach((d, i) => { d.classList.toggle("active", i === currentIndex); d.setAttribute("aria-selected", String(i === currentIndex)); });
    }

    function navigate(dir) {
      const now = Date.now();
      if (now - lastNav < 380) return;
      lastNav = now;
      currentIndex = (currentIndex + dir + n) % n;
      layout();
    }
    function setIndex(i) { if (i === currentIndex) return; currentIndex = i; layout(); pauseAuto(); resumeAutoSoon(); }

    /* drag (mouse/pen) / tap (touch) */
    let startY = null, startX = 0, startT = 0, moved = 0, dragging = false, isTouch = false;
    viewport.addEventListener("pointerdown", (e) => {
      startY = e.clientY; startX = e.clientX; startT = Date.now(); moved = 0;
      isTouch = e.pointerType === "touch";
      dragging = !isTouch;
      if (dragging) {
        try { viewport.setPointerCapture(e.pointerId); } catch (_) {}
        const f = cards[currentIndex]; if (f) f.style.transition = "none";
      }
      pauseAuto();
    });
    viewport.addEventListener("pointermove", (e) => {
      if (startY === null) return;
      const dy = e.clientY - startY;
      moved = Math.max(moved, Math.abs(dy) + Math.abs(e.clientX - startX));
      if (dragging) { const f = cards[currentIndex]; if (f) f.style.transform = `translateY(${dy * 0.5}px) scale(1) rotateX(0deg)`; }
    });
    function endPointer(e) {
      if (startY === null) return;
      const dy = (e.clientY != null ? e.clientY : startY) - startY;
      const dt = Date.now() - startT;
      const f = cards[currentIndex]; if (f) f.style.transition = "";
      const wasDrag = dragging;
      startY = null; dragging = false;
      if (!isTouch && wasDrag && Math.abs(dy) > 50) navigate(dy < 0 ? 1 : -1);
      else if (moved < 8 && dt < 450) openLB(currentIndex);
      else layout();
      resumeAutoSoon();
    }
    viewport.addEventListener("pointerup", endPointer);
    viewport.addEventListener("pointercancel", () => { startY = null; dragging = false; const f = cards[currentIndex]; if (f) f.style.transition = ""; layout(); });

    /* keyboard */
    viewport.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); navigate(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); navigate(-1); }
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLB(currentIndex); }
    });

    /* autoplay (in-view only, respects reduced motion) */
    let autoT = null, resumeT = null;
    function startAuto() { if (reduceMotion || autoT) return; autoT = setInterval(() => navigate(1), 4800); }
    function pauseAuto() { if (autoT) { clearInterval(autoT); autoT = null; } }
    function resumeAutoSoon() { clearTimeout(resumeT); resumeT = setTimeout(startAuto, 6000); }
    stackEl.addEventListener("mouseenter", pauseAuto);
    stackEl.addEventListener("mouseleave", resumeAutoSoon);
    viewport.addEventListener("focusin", pauseAuto);
    viewport.addEventListener("focusout", resumeAutoSoon);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((ents) => ents.forEach((en) => en.isIntersecting ? startAuto() : pauseAuto()), { threshold: 0.4 }).observe(stackEl);
    } else startAuto();

    /* lightbox */
    let lbIndex = 0;
    function showLb() {
      const im = galleryImages[lbIndex];
      lbImg.onerror = () => { lbImg.onerror = null; lbImg.src = im.fb.replace("w=640", "w=1100"); };
      lbImg.src = im.file; lbImg.alt = im.alt;
    }
    function openLB(i) {
      lbIndex = i; showLb();
      lightbox.classList.add("open"); lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; pauseAuto();
    }
    function closeLB() {
      lightbox.classList.remove("open"); lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = ""; resumeAutoSoon();
    }
    function navLB(dir) { lbIndex = (lbIndex + dir + n) % n; showLb(); }
    $("#lbClose").addEventListener("click", closeLB);
    $(".lb-prev").addEventListener("click", () => navLB(-1));
    $(".lb-next").addEventListener("click", () => navLB(1));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLB(); });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLB();
      if (e.key === "ArrowLeft") navLB(-1);
      if (e.key === "ArrowRight") navLB(1);
    });

    layout();
  }

  /* ---- Reservation form (client-side demo) ---- */
  const form = $("#reserveForm");
  const formMsg = $("#formMsg");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      $$(".field", form).forEach((field) => {
        const input = field.querySelector("input, select, textarea");
        if (!input || !input.hasAttribute("required")) return;
        const ok = input.checkValidity() && input.value.trim() !== "";
        field.classList.toggle("invalid", !ok);
        if (!ok && valid) { valid = false; input.focus(); }
      });
      if (!valid) return;
      formMsg.classList.add("ok");
      form.querySelector("button[type=submit]").textContent = "Στάλθηκε ✓";
      setTimeout(() => {
        form.reset();
        formMsg.classList.remove("ok");
        form.querySelector("button[type=submit]").textContent = "Στείλε αίτημα κράτησης";
        $$(".field", form).forEach((f) => f.classList.remove("invalid"));
      }, 4500);
    });
    $$(".field input, .field select", form).forEach((input) => {
      input.addEventListener("input", () => input.closest(".field").classList.remove("invalid"));
    });
  }

  /* ---- Pointer-driven interactivity (desktop / fine pointers only) ---- */
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  /* Ambient light that trails the cursor on dark sections */
  if (finePointer && !reduceMotion) {
    const zones = $$("[data-glow]");
    zones.forEach((z) => {
      const g = document.createElement("div");
      g.className = "glow-layer"; g.setAttribute("aria-hidden", "true");
      z.prepend(g);
      z._g = g; z._gx = 0; z._gy = 0; z._tx = -9999; z._ty = -9999;
    });
    let activeZone = null, glowRaf = false;
    function glowTick() {
      glowRaf = false;
      if (!activeZone) return;
      activeZone._gx += (activeZone._tx - activeZone._gx) * 0.12;
      activeZone._gy += (activeZone._ty - activeZone._gy) * 0.12;
      activeZone._g.style.setProperty("--gx", activeZone._gx + "px");
      activeZone._g.style.setProperty("--gy", activeZone._gy + "px");
      if (Math.abs(activeZone._tx - activeZone._gx) > 0.4 || Math.abs(activeZone._ty - activeZone._gy) > 0.4) {
        glowRaf = true; requestAnimationFrame(glowTick);
      }
    }
    window.addEventListener("mousemove", (e) => {
      const zone = e.target.closest ? e.target.closest("[data-glow]") : null;
      if (zone !== activeZone) {
        if (activeZone) activeZone._g.classList.remove("active");
        activeZone = zone || null;
        if (activeZone) {
          activeZone._g.classList.add("active");
          const r = activeZone.getBoundingClientRect();
          activeZone._gx = e.clientX - r.left; activeZone._gy = e.clientY - r.top;
        }
      }
      if (activeZone) {
        const r = activeZone.getBoundingClientRect();
        activeZone._tx = e.clientX - r.left; activeZone._ty = e.clientY - r.top;
        if (!glowRaf) { glowRaf = true; requestAnimationFrame(glowTick); }
      }
    }, { passive: true });
  }

  /* Cursor sheen on every button */
  if (finePointer) {
    document.addEventListener("mousemove", (e) => {
      const btn = e.target.closest ? e.target.closest(".btn") : null;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--mx", (e.clientX - r.left) + "px");
      btn.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  /* Delivery cards: 3D tilt + spotlight that follow the cursor */
  if (finePointer && !reduceMotion) {
    $$(".delivery__card").forEach((link) => {
      const card = $(".dcard", link);
      if (!card) return;
      link.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.transform = `rotateX(${(0.5 - py) * 9}deg) rotateY(${(px - 0.5) * 9}deg) translateZ(6px)`;
        card.style.setProperty("--mx", (px * 100) + "%");
        card.style.setProperty("--my", (py * 100) + "%");
      });
      link.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  }
})();
