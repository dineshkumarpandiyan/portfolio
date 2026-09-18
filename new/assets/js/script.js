// ==============================
// Shared Components
// ==============================

document.addEventListener("DOMContentLoaded", async () => {
  const BASE = basePath(); // "." at root, ".." inside /pages/

  async function loadComponent(id, path) {
    const el = document.getElementById(id);

    if (!el) return;

    try {
      const response = await fetch(`${BASE}/${path}`);

      if (!response.ok) {
        throw new Error(`${path}: ${response.status}`);
      }

      el.innerHTML = await response.text();
    } catch (error) {
      console.error(error);
    }
  }

  await Promise.all([
    loadComponent("site-header", "components/header/desktop-header.html"),
    loadComponent("mobile-site-header", "components/header/mobile-header.html"),
    loadComponent("site-footer", "components/footer/footer.html"),
    loadComponent("home-content", "components/home/home.html"),
  ]);

  // Fix relative paths in the injected components when on a /pages/ file
  if (BASE === "..") rewriteComponentPaths();

  // Init header after markup is in the DOM
  initDesktopNav();
  initOfferSlider();
  initLocation();
  initProfileMenu();
  initMobileNav();
  initMobileDrawer();
  initMobileOffers();
  initSearch();
  initFooter();
  initHome();
  if (typeof refreshHeaderBadges === "function") refreshHeaderBadges();
});

// ==============================
// Search with live suggestions
// ==============================
function initSearch() {
  setupSearchBox("site-search", "site-search-panel");
  setupSearchBox("site-search-mobile", "site-search-panel-mobile");
}

function setupSearchBox(inputId, panelId) {
  const input = document.getElementById(inputId);
  const panel = document.getElementById(panelId);
  if (!input || !panel) return;

  const money = (n) => `₹${n.toLocaleString("en-IN")}`;
  let activeIndex = -1;
  let items = []; // navigable [{type, ...}]

  const go = (q) => {
    const query = (q || "").trim();
    if (query) window.location.href = plpUrl({ q: query });
  };

  function hasProducts() {
    return typeof PRODUCTS !== "undefined";
  }

  function search(term) {
    if (!hasProducts()) return { products: [], cats: [] };
    const t = term.toLowerCase();
    const products = PRODUCTS.filter((p) => `${p.name} ${p.seller} ${p.subcategory}`.toLowerCase().includes(t)).slice(
      0,
      5,
    );
    const cats = [];
    Object.entries(CATEGORY_MAP).forEach(([key, val]) => {
      if (val.label.toLowerCase().includes(t)) cats.push({ label: val.label, category: key });
      val.subs.forEach((s) => {
        const lbl = SUBCATEGORY_LABELS[s] || s;
        if (lbl.toLowerCase().includes(t)) cats.push({ label: `${lbl} in ${val.label}`, category: key, sub: s });
      });
    });
    return { products, cats: cats.slice(0, 4) };
  }

  function renderTrending() {
    if (typeof TRENDING_SEARCHES === "undefined") return "";
    return `
      <div class="p-3">
        <p class="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-muted">Trending searches</p>
        <div class="flex flex-wrap gap-2 px-2">
          ${TRENDING_SEARCHES.map(
            (t) =>
              `<button class="s-trend rounded-full border border-border px-3 py-1 text-xs text-body transition-colors hover:border-primary hover:text-primary" data-q="${t}">${t}</button>`,
          ).join("")}
        </div>
      </div>`;
  }

  function open() {
    panel.classList.remove("hidden");
  }
  function close() {
    panel.classList.add("hidden");
    activeIndex = -1;
  }

  function build() {
    const term = input.value.trim();
    items = [];

    if (!term) {
      panel.innerHTML = renderTrending();
      wire();
      return;
    }

    const { products, cats } = search(term);

    if (products.length === 0 && cats.length === 0) {
      panel.innerHTML = `<div class="p-4 text-sm text-muted">No matches. Press Enter to search "<span class="font-semibold text-heading">${term}</span>".</div>`;
      return;
    }

    let html = "";

    if (cats.length) {
      html += `<div class="border-b border-border-light py-2">`;
      cats.forEach((c) => {
        items.push({ type: "cat", category: c.category, sub: c.sub });
        html += `
          <a href="${plpUrl({ category: c.category, sub: c.sub })}" data-idx="${items.length - 1}"
             class="s-item flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-neutral-50">
            <i class="bx bx-search text-lg text-muted"></i>
            <span class="text-body">${c.label}</span>
          </a>`;
      });
      html += `</div>`;
    }

    if (products.length) {
      html += `<div class="py-2">`;
      products.forEach((p) => {
        items.push({ type: "product", q: p.name });
        const off = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
        html += `
          <a href="${plpUrl({ q: p.name })}" data-idx="${items.length - 1}"
             class="s-item flex items-center gap-3 px-4 py-2 transition-colors hover:bg-neutral-50">
            <span class="h-12 w-10 shrink-0 overflow-hidden rounded bg-neutral-100">
              <img src="${p.image}" alt="${p.name}" class="h-full w-full object-cover" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium text-heading">${p.name}</span>
              <span class="block truncate text-xs text-muted">${p.seller}</span>
            </span>
            <span class="shrink-0 text-sm font-semibold text-heading">${money(p.price)}${off ? ` <span class="text-xs font-normal text-primary">${off}%</span>` : ""}</span>
          </a>`;
      });
      html += `</div>`;
    }

    html += `
      <a href="${plpUrl({ q: term })}" class="block border-t border-border-light bg-neutral-50 px-4 py-2.5 text-center text-sm font-semibold text-primary hover:bg-neutral-100">
        View all results for "${term}"
      </a>`;

    panel.innerHTML = html;
    wire();
  }

  function wire() {
    panel.querySelectorAll(".s-trend").forEach((b) =>
      b.addEventListener("mousedown", (e) => {
        e.preventDefault();
        input.value = b.getAttribute("data-q");
        go(input.value);
      }),
    );
  }

  function highlight() {
    const nodes = panel.querySelectorAll(".s-item");
    nodes.forEach((n, i) => {
      n.classList.toggle("bg-neutral-50", i === activeIndex);
    });
  }

  input.addEventListener("focus", () => {
    build();
    open();
  });
  input.addEventListener("input", () => {
    build();
    open();
  });
  input.addEventListener("keydown", (e) => {
    const nodes = panel.querySelectorAll(".s-item");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, nodes.length - 1);
      highlight();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, -1);
      highlight();
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && nodes[activeIndex]) {
        nodes[activeIndex].click();
      } else {
        go(input.value);
      }
    } else if (e.key === "Escape") {
      close();
      input.blur();
    }
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && e.target !== input) close();
  });
}

// ==============================
// Home page sections
// ==============================
function initHome() {
  initHeroCarousel();

  const cats = document.getElementById("home-categories");
  if (cats && typeof HOME_CATEGORIES !== "undefined") {
    cats.innerHTML = HOME_CATEGORIES.map(
      (c) => `
      <a href="${plpUrl({ category: c.cat, sub: c.sub })}" class="group block w-32 shrink-0 snap-start sm:w-auto">
        <span class="relative block aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-border transition-all duration-300 group-hover:ring-2 group-hover:ring-primary">
          <img src="${c.image}" alt="${c.label}" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <span class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></span>
          <span class="absolute inset-x-0 bottom-0 p-3 text-center text-sm font-semibold text-white">${c.label}</span>
        </span>
      </a>`,
    ).join("");
  }

  const steps = document.getElementById("home-steps");
  if (steps && typeof HOME_STEPS !== "undefined") {
    steps.innerHTML = HOME_STEPS.map(
      (s) => `
      <div class="relative rounded-2xl border border-border bg-surface p-8 transition-shadow hover:shadow-soft">
        <span class="absolute right-6 top-6 font-display text-4xl font-bold text-neutral-100">${s.step}</span>
        <span class="flex h-14 w-14 items-center justify-center rounded-xl bg-sendmystyle-50 text-primary">
          <i class="bx ${s.icon} text-2xl"></i>
        </span>
        <h3 class="mt-5 font-display text-xl font-bold text-heading">${s.title}</h3>
        <p class="mt-2 text-sm leading-relaxed text-body">${s.text}</p>
      </div>`,
    ).join("");
  }

  renderCollections();
  renderProducts();
  renderTube();
  renderSellers();
  renderInstaBrands();

  // Resolve static home CTAs with a data-plp attribute into real PLP links
  document.querySelectorAll("[data-plp]").forEach((el) => {
    const cat = el.getAttribute("data-plp");
    el.setAttribute("href", plpUrl(cat ? { category: cat } : {}));
  });

  // "View all" section links → all products PLP
  document.querySelectorAll('main a[href="#"]').forEach((el) => {
    if (/view all/i.test(el.textContent)) el.setAttribute("href", plpUrl({}));
  });
}

// Instagram Famous Brands (social-viral discovery)
function renderInstaBrands() {
  const el = document.getElementById("home-insta");
  if (!el || typeof HOME_INSTA_BRANDS === "undefined") return;

  el.innerHTML = HOME_INSTA_BRANDS.map(
    (b) => `
    <a href="#" class="group block w-56 shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-soft sm:w-auto">
      <div class="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <img src="${b.image}" alt="${b.name}" loading="lazy" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></span>
        <span class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-primary">
          <i class="bx bxl-instagram text-lg"></i>
        </span>
        <span class="absolute inset-x-0 bottom-0 p-4">
          <span class="block font-display text-lg font-bold text-white">${b.name}</span>
          <span class="block text-xs text-neutral-200">${b.handle}</span>
        </span>
      </div>
      <div class="flex items-center justify-between px-4 py-3">
        <span class="flex items-center gap-1.5 text-xs text-body">
          <i class="bx bx-group text-sm text-primary"></i> ${b.followers} followers
        </span>
        <span class="text-xs font-semibold text-primary group-hover:underline">Follow</span>
      </div>
    </a>`,
  ).join("");
}

// Featured collections (1 large + stacked small)
function renderCollections() {
  const el = document.getElementById("home-collections");
  if (!el || typeof HOME_COLLECTIONS === "undefined") return;

  const large = HOME_COLLECTIONS.find((c) => c.size === "large");
  const smalls = HOME_COLLECTIONS.filter((c) => c.size !== "large");

  const card = (c, tall) => `
    <a href="${c.href}" class="group relative block overflow-hidden rounded-2xl ${tall ? "min-h-[300px] lg:min-h-[440px]" : "min-h-[200px]"}">
      <img src="${c.image}" alt="${c.title}" loading="lazy" class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <span class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></span>
      <span class="absolute bottom-0 left-0 p-6">
        <span class="block font-display text-2xl font-bold text-white">${c.title}</span>
        <span class="mt-1 block text-sm text-neutral-200">${c.text}</span>
        <span class="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white">
          Shop now <i class="bx bx-right-arrow-alt transition-transform duration-200 group-hover:translate-x-1"></i>
        </span>
      </span>
    </a>`;

  el.innerHTML = `
    ${large ? card(large, true) : ""}
    <div class="grid gap-5">
      ${smalls.map((c) => card(c, false)).join("")}
    </div>`;
}

// Trending product cards
function renderProducts() {
  const el = document.getElementById("home-products");
  if (!el) return;

  // Prefer the real catalog (so cards link to PDP); fall back to HOME_PRODUCTS
  const useCatalog = typeof PRODUCTS !== "undefined";
  const list = useCatalog
    ? [...PRODUCTS].sort((a, b) => b.ratingCount - a.ratingCount).slice(0, 6)
    : typeof HOME_PRODUCTS !== "undefined"
      ? HOME_PRODUCTS
      : [];
  if (list.length === 0) return;

  const b = basePath();

  el.innerHTML = list
    .map((p) => {
      const off = p.mrp && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
      const href = p.id ? `${b}/pages/product.html?id=${p.id}` : plpUrl({ q: p.name });
      return `
      <a href="${href}" class="group block overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-soft">
        <div class="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          <img src="${p.image}" alt="${p.name}" loading="lazy" class="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
          ${p.customizable ? '<span class="absolute left-2 top-2 rounded-full bg-sendmystyle-50 px-2 py-0.5 text-[10px] font-bold text-primary">Customisable</span>' : ""}
          <button onclick="event.preventDefault();event.stopPropagation();" class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-heading transition-colors hover:text-primary" aria-label="Add to wishlist">
            <i class="bx bx-heart text-lg"></i>
          </button>
        </div>
        <div class="p-3">
          <p class="truncate text-xs text-muted">${p.seller}</p>
          <h3 class="mt-0.5 truncate text-sm font-semibold text-heading">${p.name}</h3>
          <div class="mt-1.5 flex items-center gap-2">
            <span class="text-sm font-bold text-heading">₹${p.price.toLocaleString("en-IN")}</span>
            ${off ? `<span class="text-xs text-muted line-through">₹${p.mrp.toLocaleString("en-IN")}</span><span class="text-xs font-semibold text-primary">${off}% off</span>` : ""}
          </div>
          <div class="mt-1.5 inline-flex items-center gap-1 rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-semibold text-heading">
            <i class="bx bxs-star text-primary"></i> ${(typeof p.rating === "number" ? p.rating : 4.5).toFixed(1)}
          </div>
        </div>
      </a>`;
    })
    .join("");
}

// Style Tube cards (video/reel style)
function renderTube() {
  const el = document.getElementById("home-tube");
  if (!el || typeof HOME_TUBE === "undefined") return;

  el.innerHTML = HOME_TUBE.map(
    (v) => `
    <a href="#" class="group block">
      <div class="relative aspect-[9/12] overflow-hidden rounded-xl bg-neutral-800">
        <img src="${v.image}" alt="${v.title}" loading="lazy" class="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" />
        <span class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></span>
        <span class="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary transition-transform duration-200 group-hover:scale-110">
          <i class="bx bx-play text-2xl"></i>
        </span>
        <span class="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">${v.duration}</span>
      </div>
      <h3 class="mt-3 line-clamp-2 text-sm font-semibold text-white">${v.title}</h3>
      <p class="mt-1 text-xs text-neutral-400">${v.author}</p>
    </a>`,
  ).join("");
}

// Top sellers cards
function renderSellers() {
  const el = document.getElementById("home-sellers");
  if (!el || typeof HOME_SELLERS === "undefined") return;

  el.innerHTML = HOME_SELLERS.map(
    (s) => `
    <a href="#" class="group overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-soft">
      <div class="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <img src="${s.image}" alt="${s.name}" loading="lazy" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
      <div class="flex items-center justify-between p-4">
        <span class="leading-tight">
          <span class="block text-sm font-semibold text-heading group-hover:text-primary">${s.name}</span>
          <span class="block text-xs text-muted">${s.tag}</span>
        </span>
        <span class="inline-flex shrink-0 items-center gap-1 rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-semibold text-heading">
          <i class="bx bxs-star text-primary"></i> ${s.rating}
        </span>
      </div>
    </a>`,
  ).join("");
}

// ------------------------------
// Hero carousel
// ------------------------------
function initHeroCarousel() {
  const track = document.getElementById("hero-track");
  const dotsWrap = document.getElementById("hero-dots");
  if (!track || typeof HERO_SLIDES === "undefined" || HERO_SLIDES.length === 0) return;

  const btn = (b, filled) =>
    b
      ? `<a href="${plpUrl(b.to || {})}" class="inline-flex h-12 items-center justify-center gap-2 rounded-lg px-7 text-sm font-semibold transition-colors ${
          filled ? "bg-primary text-white hover:bg-primary-hover" : "bg-white text-heading hover:bg-neutral-100"
        }">${b.icon ? `<i class="bx ${b.icon} text-lg ${filled ? "" : "text-primary"}"></i>` : ""}${b.text}</a>`
      : "";

  const total = HERO_SLIDES.length;
  const slideMarkup = (s) => `
    <div class="hero-slide relative w-full shrink-0">
      <img src="${s.image}" alt="${s.label}" class="absolute inset-0 h-full w-full object-cover object-center" />
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20"></div>
      <div class="relative mx-auto flex min-h-[68vh] w-full max-w-[1400px] items-center px-6 py-16 lg:px-10">
        <div class="max-w-xl text-white">
          <span class="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur">
            ${s.label}
          </span>
          <h1 class="mt-5 font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">${s.titleHtml}</h1>
          <p class="mt-5 max-w-lg text-base leading-relaxed text-neutral-200 sm:text-lg">${s.text}</p>
          <div class="mt-8 flex flex-wrap gap-3">
            ${btn(s.primary, true)}
            ${btn(s.secondary, false)}
          </div>
          <div class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-neutral-300">
            ${(s.trust || [])
              .map(
                (t) =>
                  `<span class="flex items-center gap-2"><i class="bx bx-check-circle text-sendmystyle-300"></i> ${t}</span>`,
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>`;

  // Track = flex row. Clone the FIRST slide at the end for a seamless loop.
  track.className = "flex";
  track.innerHTML = HERO_SLIDES.map(slideMarkup).join("") + (total > 1 ? slideMarkup(HERO_SLIDES[0]) : "");

  const TRANS = "transform 700ms ease-in-out";
  track.style.transition = TRANS;

  // Dots (real slides only)
  if (dotsWrap) {
    dotsWrap.innerHTML = HERO_SLIDES.map(
      (_, i) =>
        `<button class="hero-dot h-2 rounded-full transition-all ${
          i === 0 ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
        }" data-dot="${i}" aria-label="Go to slide ${i + 1}"></button>`,
    ).join("");
  }
  const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll(".hero-dot")) : [];

  let pos = 0; // physical position (0..total, where `total` is the clone)
  let timer = null;

  function move(withAnim = true) {
    track.style.transition = withAnim ? TRANS : "none";
    track.style.transform = `translateX(-${pos * 100}%)`;
    const real = pos % total;
    dots.forEach((d, idx) => {
      d.className = `hero-dot h-2 rounded-full transition-all ${
        idx === real ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
      }`;
    });
  }

  // After reaching the clone (first-slide copy), snap back to the real first
  // slide with no animation so the loop is seamless.
  track.addEventListener("transitionend", () => {
    if (pos === total) {
      pos = 0;
      move(false);
    }
  });

  function next() {
    if (pos >= total) return; // ignore while a wrap is pending
    pos += 1;
    move(true);
  }
  function prev() {
    // if at the real first, jump (no anim) to the clone, then step back
    if (pos === 0) {
      pos = total;
      move(false);
      // force reflow so the next transform animates
      void track.offsetWidth;
    }
    pos -= 1;
    move(true);
  }

  function start() {
    stop();
    if (total > 1) timer = setInterval(next, 5500);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  document.getElementById("hero-next")?.addEventListener("click", () => {
    next();
    start();
  });
  document.getElementById("hero-prev")?.addEventListener("click", () => {
    prev();
    start();
  });
  dots.forEach((d) =>
    d.addEventListener("click", () => {
      pos = Number(d.getAttribute("data-dot"));
      move(true);
      start();
    }),
  );

  const carousel = document.getElementById("hero-carousel");
  carousel?.addEventListener("mouseenter", stop);
  carousel?.addEventListener("mouseleave", start);

  move(false);
  start();
}

// ==============================
// Footer
// ==============================
function initFooter() {
  const trust = document.getElementById("footer-trust");
  if (trust && typeof FOOTER_TRUST !== "undefined") {
    trust.innerHTML = FOOTER_TRUST.map(
      (t) => `
      <div class="flex items-center gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sendmystyle-50 text-primary">
          <i class="bx ${t.icon} text-xl"></i>
        </span>
        <span class="leading-tight">
          <span class="block text-sm font-semibold text-heading">${t.title}</span>
          <span class="block text-xs text-muted">${t.text}</span>
        </span>
      </div>`,
    ).join("");
  }

  const links = document.getElementById("footer-links");
  if (links && typeof FOOTER_LINKS !== "undefined") {
    links.innerHTML = FOOTER_LINKS.map(
      (col) => `
      <div>
        <h4 class="text-sm font-semibold text-heading">${col.title}</h4>
        <ul class="mt-4 space-y-2.5">
          ${col.links
            .map(
              (link) =>
                `<li><a href="#" class="text-sm text-body transition-colors hover:text-primary">${link}</a></li>`,
            )
            .join("")}
        </ul>
      </div>`,
    ).join("");
  }

  const social = document.getElementById("footer-social");
  if (social && typeof FOOTER_SOCIAL !== "undefined") {
    social.innerHTML = FOOTER_SOCIAL.map(
      (s) => `
      <a href="${s.href}" aria-label="${s.label}"
         class="flex h-10 w-10 items-center justify-center rounded-full border border-border text-body transition-colors hover:border-primary hover:bg-primary hover:text-white">
        <i class="bx ${s.icon} text-lg"></i>
      </a>`,
    ).join("");
  }

  const policies = document.getElementById("footer-policies");
  if (policies && typeof FOOTER_POLICIES !== "undefined") {
    policies.innerHTML = FOOTER_POLICIES.map(
      (p) => `<a href="#" class="text-xs text-muted transition-colors hover:text-primary">${p}</a>`,
    ).join("");
  }

  const popular = document.getElementById("footer-popular");
  if (popular && typeof FOOTER_POPULAR !== "undefined") {
    popular.innerHTML = FOOTER_POPULAR.map(
      (term, i) =>
        `${i > 0 ? '<span class="text-border">|</span>' : ""}<a href="#" class="text-xs text-muted transition-colors hover:text-primary">${term}</a>`,
    ).join("");
  }

  // Newsletter
  const form = document.getElementById("newsletter-form");
  const email = document.getElementById("newsletter-email");
  const msg = document.getElementById("newsletter-msg");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = (email?.value || "").trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (msg) {
      msg.classList.remove("hidden");
      if (valid) {
        msg.textContent = "Thanks for subscribing!";
        msg.className = "mt-2 text-xs font-medium text-primary";
        if (email) email.value = "";
      } else {
        msg.textContent = "Please enter a valid email address.";
        msg.className = "mt-2 text-xs font-medium text-primary";
      }
    }
  });
}

// Prefix "../" to root-relative asset/link paths inside injected components
function rewriteComponentPaths() {
  document.querySelectorAll("header [src], header [href], footer [src], footer [href]").forEach((el) => {
    ["src", "href"].forEach((attr) => {
      const val = el.getAttribute(attr);
      if (!val) return;
      // skip anchors, external links, and already-relative ".." paths
      if (/^(#|https?:|mailto:|tel:|\.\.\/)/.test(val)) return;
      if (val === "index.html" || val.startsWith("assets/") || val.startsWith("pages/")) {
        el.setAttribute(attr, `../${val}`);
      }
    });
  });
}

// ------------------------------
// Product Listing Page links
// ------------------------------
function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Build a link to the product listing page with optional category / sub / query
function plpUrl({ category, sub, q } = {}) {
  const b = basePath();
  const params = new URLSearchParams();
  if (category) params.set("category", slugify(category));
  if (sub) params.set("sub", slugify(sub));
  if (q) params.set("q", q);
  const qs = params.toString();
  return `${b}/pages/products.html${qs ? `?${qs}` : ""}`;
}

// ==============================
// Profile Menu (guest / logged-in)
// ==============================
function initProfileMenu() {
  const b = basePath();
  const user = Auth.getUser();
  const isLoggedIn = !!user;

  // Mobile drawer account row
  const mAccount = document.getElementById("mobile-account");
  const mTitle = document.getElementById("mobile-account-title");
  const mSub = document.getElementById("mobile-account-sub");
  if (mAccount) {
    if (isLoggedIn) {
      mAccount.href = `${b}/pages/account.html?tab=profile`;
      if (mTitle) mTitle.textContent = `Hi, ${user.name}`;
      if (mSub) mSub.textContent = "View orders, designs & more";
    } else {
      mAccount.href = `${b}/pages/login.html`;
      if (mTitle) mTitle.textContent = "Login / Sign up";
      if (mSub) mSub.textContent = "Access orders & designs";
    }
  }

  const menu = document.getElementById("profile-menu");
  if (!menu) return;

  const label = document.getElementById("profile-label");

  const acct = (tab) => `${b}/pages/account.html?tab=${tab}`;

  if (isLoggedIn) {
    if (label && user.name) label.textContent = user.name;
    menu.innerHTML = `
      <div class="flex items-center gap-3 border-b border-border px-4 py-3">
        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-sendmystyle-50 text-primary">
          <i class="bx bx-user text-xl"></i>
        </span>
        <span class="leading-tight">
          <span class="block text-sm font-semibold text-heading">Hello, ${user.name}</span>
          <span class="block text-xs text-muted">Welcome back</span>
        </span>
      </div>
      <nav class="py-1">
        ${profileLink("bx-user", "My Profile", acct("profile"))}
        ${profileLink("bx-package", "My Orders", acct("orders"))}
        ${profileLink("bx-pencil", "My Designs", acct("designs"))}
        ${profileLink("bx-palette", "My Personalisation", acct("personalisation"))}
        ${profileLink("bx-ruler", "My Measurements", acct("measurements"))}
        ${profileLink("bx-map", "Saved Addresses", acct("addresses"))}
        ${profileLink("bx-wallet", "SendMyStyle Wallet", acct("wallet"))}
        ${profileLink("bx-cog", "Settings", acct("settings"))}
      </nav>
      <div class="border-t border-border p-2">
        <a href="#" id="logout-btn" class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-sendmystyle-50">
          <i class="bx bx-log-out text-lg"></i> Log out
        </a>
      </div>`;

    menu.querySelector("#logout-btn")?.addEventListener("click", (e) => {
      e.preventDefault();
      Auth.logout();
      window.location.href = `${b}/index.html`;
    });
  } else {
    if (label) label.textContent = "Profile";
    menu.innerHTML = `
      <div class="border-b border-border p-4 text-center">
        <a href="${b}/pages/login.html" class="block w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">Sign in</a>
        <p class="mt-2 text-xs text-muted">
          New customer?
          <a href="${b}/pages/signup.html" class="font-medium text-primary hover:underline">Start here.</a>
        </p>
      </div>
      <nav class="py-1">
        ${profileLink("bx-package", "My Orders", `${b}/pages/login.html`)}
        ${profileLink("bx-pencil", "My Designs", `${b}/pages/login.html`)}
        ${profileLink("bx-ruler", "My Measurements", `${b}/pages/login.html`)}
        ${profileLink("bx-gift", "Offers", "#")}
        ${profileLink("bx-help-circle", "Help & Support", "#")}
      </nav>`;
  }
}

function profileLink(icon, text, href = "#") {
  return `
    <a href="${href}" class="flex items-center gap-3 px-4 py-2.5 text-sm text-body transition-colors hover:bg-neutral-50 hover:text-primary">
      <i class="bx ${icon} text-lg text-muted"></i>${text}
    </a>`;
}

// ==============================
// Mobile Nav (accordion)
// ==============================
function initMobileNav() {
  const navRoot = document.getElementById("mobile-nav");
  if (!navRoot || typeof NAV_MENU === "undefined") return;

  navRoot.innerHTML = NAV_MENU.map((item) => {
    const isBrands = item.type === "brands";
    const hasSub =
      (Array.isArray(item.columns) && item.columns.length > 0) ||
      (isBrands && Array.isArray(item.groups) && item.groups.length > 0);
    const highlight = item.highlight ? "text-primary" : "text-heading";

    if (!hasSub) {
      const href = isBrands ? item.href : plpUrl({ category: item.label });
      return `
        <a href="${href}" class="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold ${highlight}">
          ${item.label}
          <i class="bx bx-chevron-right text-xl text-muted"></i>
        </a>`;
    }

    let sub;
    if (isBrands) {
      sub = item.groups
        .map(
          (group) => `
        <div class="mb-3">
          <p class="mb-1.5 flex items-center gap-1.5 px-3 text-xs font-bold uppercase tracking-wide text-muted">
            <i class="bx ${group.icon} text-sm text-primary"></i>${group.title}
          </p>
          ${group.sellers
            .map((s) => {
              const avatar = s.image
                ? `<span class="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border">
                       <img src="${s.image}" alt="${s.name}" loading="lazy" class="h-full w-full object-cover" />
                     </span>`
                : `<span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-bold text-heading">${s.initials}</span>`;
              return `
            <a href="#" class="flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-neutral-50">
              ${avatar}
              <span class="leading-tight">
                <span class="block text-sm font-medium text-heading">${s.name}</span>
                <span class="block text-xs text-muted">${s.tag}</span>
              </span>
            </a>`;
            })
            .join("")}
        </div>`,
        )
        .join("");
    } else {
      sub = item.columns
        .map(
          (col) => `
        <div class="mb-3">
          <p class="mb-1.5 px-3 text-xs font-bold uppercase tracking-wide text-muted">${col.title}</p>
          ${col.links
            .map(
              (link) =>
                `<a href="${plpUrl({ category: item.label, sub: link })}" class="block rounded-md px-3 py-2 text-sm text-body transition-colors hover:bg-neutral-50 hover:text-primary">${link}</a>`,
            )
            .join("")}
        </div>`,
        )
        .join("");
    }

    return `
      <div class="acc-item border-b border-border-light last:border-0">
        <button class="acc-trigger flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold ${highlight}">
          ${item.label}
          <i class="bx bx-chevron-down acc-icon text-xl text-muted transition-transform duration-200"></i>
        </button>
        <div class="acc-body grid grid-rows-[0fr] transition-all duration-300">
          <div class="overflow-hidden">
            <div class="pb-2 pt-1">${sub}</div>
          </div>
        </div>
      </div>`;
  }).join("");

  // accordion toggle
  navRoot.querySelectorAll(".acc-trigger").forEach((btn) => {
    btn.addEventListener("click", () => {
      const body = btn.nextElementSibling;
      const icon = btn.querySelector(".acc-icon");
      const isOpen = body.classList.contains("grid-rows-[1fr]");

      // close others
      navRoot.querySelectorAll(".acc-body").forEach((b) => {
        b.classList.remove("grid-rows-[1fr]");
        b.classList.add("grid-rows-[0fr]");
      });
      navRoot.querySelectorAll(".acc-icon").forEach((ic) => ic.classList.remove("rotate-180"));

      if (!isOpen) {
        body.classList.remove("grid-rows-[0fr]");
        body.classList.add("grid-rows-[1fr]");
        icon.classList.add("rotate-180");
      }
    });
  });
}

// ==============================
// Mobile Drawer toggle
// ==============================
function initMobileDrawer() {
  const drawer = document.getElementById("mobile-drawer");
  if (!drawer) return;

  const panel = drawer.querySelector(".drawer-panel");
  const openBtn = document.getElementById("menu-open");
  const closeBtn = document.getElementById("menu-close");
  const overlay = drawer.querySelector(".drawer-overlay");

  const open = () => {
    drawer.classList.remove("hidden");
    requestAnimationFrame(() => panel?.classList.remove("-translate-x-full"));
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    panel?.classList.add("-translate-x-full");
    document.body.style.overflow = "";
    setTimeout(() => drawer.classList.add("hidden"), 300);
  };

  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  overlay?.addEventListener("click", close);
}

// ==============================
// Mobile offer rotation
// ==============================
function initMobileOffers() {
  const el = document.getElementById("offer-mobile");
  if (!el || typeof OFFER_MESSAGES === "undefined") return;

  let i = 0;
  setInterval(() => {
    i = (i + 1) % OFFER_MESSAGES.length;
    el.style.opacity = "0";
    setTimeout(() => {
      el.textContent = OFFER_MESSAGES[i];
      el.style.opacity = "1";
    }, 300);
  }, 3500);
}

// ==============================
// Location / Pincode Modal
// ==============================
function initLocation() {
  const modal = document.getElementById("location-modal");
  if (!modal) return;

  const openBtn = document.getElementById("location-btn");
  const openBtnMobile = document.getElementById("location-btn-mobile");
  const label = document.getElementById("location-label");
  const labelMobile = document.getElementById("location-label-mobile");
  const form = document.getElementById("pincode-form");
  const input = document.getElementById("pincode-input");
  const error = document.getElementById("pincode-error");
  const detectBtn = document.getElementById("detect-location");
  const detectStatus = document.getElementById("detect-status");
  const detectSpinner = document.getElementById("detect-spinner");

  const open = () => modal.classList.remove("hidden");
  const close = () => modal.classList.add("hidden");

  const setLocation = (text) => {
    if (label) {
      label.innerHTML = `${text} <i class="bx bx-chevron-down text-sm text-muted"></i>`;
    }
    if (labelMobile) labelMobile.textContent = text;
    localStorage.setItem("sms_location", text);
  };

  // Wire up the modal's navigation links (guest sign-in, add address)
  const b = basePath();
  const signinLink = document.getElementById("location-signin");
  if (signinLink) signinLink.href = `${b}/pages/login.html`;
  const addAddrLink = document.getElementById("location-add-address");
  if (addAddrLink) addAddrLink.href = `${b}/pages/account.html?tab=addresses`;

  // Toggle guest vs logged-in views, render saved addresses
  const user = Auth.getUser();
  const isLoggedIn = !!user;
  setupLocationViews(isLoggedIn, user, setLocation, close);

  // Show "Use current location" only on GPS-capable touch devices (phone/tab),
  // never on laptop/desktop where the position is inaccurate.
  if (isGpsDevice() && "geolocation" in navigator) {
    detectBtn?.classList.remove("hidden");
    detectBtn?.classList.add("flex");
  }

  // Restore any previously chosen location (no auto-popup on load)
  const saved = localStorage.getItem("sms_location");
  if (saved) setLocation(saved);

  // ---- Reverse geocode current coordinates into "City - Pincode" ----
  // Primary: OpenStreetMap Nominatim — gives the exact street-level pincode.
  // Fallback: BigDataCloud if Nominatim fails or returns no postcode.
  async function reverseGeocode(lat, lon) {
    let city = "Your area";
    let pin = "";

    // Primary: Nominatim (accurate Indian pincode at building/street level)
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
      const res = await fetch(url, { headers: { "Accept-Language": "en" } });
      if (res.ok) {
        const data = await res.json();
        const a = data.address || {};
        pin = a.postcode || "";
        city = a.city || a.town || a.village || a.suburb || a.county || a.state_district || city;
      }
    } catch {
      /* ignore, try fallback */
    }

    // Fallback: BigDataCloud (approximate postcode, only if Nominatim gave none)
    if (!pin || city === "Your area") {
      try {
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (!pin) pin = data.postcode || "";
          if (city === "Your area") {
            city = data.city || data.locality || data.principalSubdivision || city;
          }
        }
      } catch {
        /* ignore */
      }
    }

    return { city, pin };
  }

  function detectLocation() {
    if (!("geolocation" in navigator)) {
      detectStatus && (detectStatus.textContent = "Location not supported on this device");
      return;
    }
    detectSpinner?.classList.remove("hidden");
    detectStatus && (detectStatus.textContent = "Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { city, pin } = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          if (pin) {
            setLocation(`${city} - ${pin}`);
            detectStatus && (detectStatus.textContent = "Location detected");
            close();
          } else {
            // Got the city but no pincode — prefill and ask to confirm
            setLocation(city);
            if (input) input.value = "";
            detectStatus && (detectStatus.textContent = `Detected ${city}. Add your pincode below for exact delivery.`);
          }
        } catch {
          detectStatus && (detectStatus.textContent = "Could not fetch address. Enter pincode instead.");
        } finally {
          detectSpinner?.classList.add("hidden");
        }
      },
      (err) => {
        detectSpinner?.classList.add("hidden");
        detectStatus &&
          (detectStatus.textContent =
            err.code === err.PERMISSION_DENIED
              ? "Permission denied. Enter pincode manually."
              : "Location unavailable. Enter pincode manually.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 },
    );
  }

  openBtn?.addEventListener("click", open);
  openBtnMobile?.addEventListener("click", open);
  detectBtn?.addEventListener("click", detectLocation);
  modal.querySelector(".location-overlay")?.addEventListener("click", close);
  modal.querySelector(".location-close")?.addEventListener("click", close);

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = (input?.value || "").trim();
    if (/^\d{6}$/.test(value)) {
      error?.classList.add("hidden");
      setLocation(`Pincode ${value}`);
      close();
    } else {
      error?.classList.remove("hidden");
    }
  });

  modal.querySelectorAll(".city-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const city = chip.getAttribute("data-city");
      const pin = chip.getAttribute("data-pin");
      setLocation(`${city} - ${pin}`);
      close();
    });
  });
}

// Detect a GPS-capable touch device (phone / tablet), not a laptop/desktop
function isGpsDevice() {
  const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
  const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  return coarse && touch;
}

// Switch the modal between guest and logged-in layouts
function setupLocationViews(isLoggedIn, user, setLocation, close) {
  const guest = document.getElementById("location-guest");
  const intro = document.getElementById("location-intro");
  const wrap = document.getElementById("saved-addresses");
  const list = document.getElementById("saved-addresses-list");
  const title = document.getElementById("location-title");

  if (!isLoggedIn) {
    // Guest: show sign-in banner, hide addresses/intro
    guest?.classList.remove("hidden");
    intro?.classList.add("hidden");
    wrap?.classList.add("hidden");
    if (title) title.textContent = "Choose your location";
    return;
  }

  // Logged-in: hide guest banner, show intro + saved addresses
  guest?.classList.add("hidden");
  intro?.classList.remove("hidden");
  if (title && user.name) title.textContent = `Hi ${user.name}, choose your location`;

  if (!wrap || !list || !Array.isArray(user.addresses) || user.addresses.length === 0) {
    wrap?.classList.add("hidden");
    return;
  }

  wrap.classList.remove("hidden");
  const items = user.addresses
    .map(
      (addr, i) => `
      <button
        data-addr-index="${i}"
        class="addr-item flex w-full items-start gap-3 rounded-lg border border-border px-3 py-2.5 text-left transition-colors hover:border-primary hover:bg-sendmystyle-50"
      >
        <i class="bx bx-map-pin mt-0.5 text-lg text-primary"></i>
        <span class="leading-snug">
          <span class="flex items-center gap-2">
            <span class="text-sm font-semibold text-heading">${addr.label}</span>
            <span class="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600">${addr.pincode}</span>
          </span>
          <span class="mt-0.5 block text-xs text-body">${addr.line}, ${addr.city}</span>
        </span>
      </button>`,
    )
    .join("");

  // Keep the "Add address" card that follows the injected list
  const addCard = list.nextElementSibling;
  list.innerHTML = items;

  list.querySelectorAll(".addr-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const addr = user.addresses[Number(btn.getAttribute("data-addr-index"))];
      setLocation(`${addr.city} - ${addr.pincode}`);
      close();
    });
  });

  void addCard; // add-address card lives in markup, no rebind needed
}

// ==============================
// Desktop Nav + Mega Menu
// ==============================
function initDesktopNav() {
  if (typeof NAV_MENU === "undefined") return;

  // "bar"    -> centered nav row (lg / tablet)     -> full-width mega
  // "inline" -> nav next to logo (xl single line)  -> contained mega
  renderNav(document.getElementById("desktop-nav"), "bar");
  renderNav(document.getElementById("desktop-nav-inline"), "inline");
}

function renderNav(navRoot, variant) {
  if (!navRoot) return;

  navRoot.innerHTML = NAV_MENU.map((item, i) => {
    const highlight = item.highlight ? "text-primary" : "text-heading";
    const hasMega =
      (Array.isArray(item.columns) && item.columns.length > 0) ||
      (Array.isArray(item.groups) && item.groups.length > 0);

    const mega = hasMega ? buildMegaMenu(item) : "";
    const pad = variant === "inline" ? "px-3" : "px-4";

    const topHref = item.type === "brands" ? item.href : plpUrl({ category: item.label });

    return `
      <li class="group static" data-nav-index="${i}">
        <a href="${topHref}"
           class="relative flex h-12 items-center gap-1 ${pad} text-sm font-semibold ${highlight} transition-colors group-hover:text-primary">
          ${item.label}
          ${hasMega ? '<i class="bx bx-chevron-down text-base transition-transform duration-200 group-hover:rotate-180"></i>' : ""}
          <span class="absolute inset-x-3 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100"></span>
        </a>
        ${mega}
      </li>`;
  }).join("");
}

// Full-width mega panel with a FIXED min-height so every menu is the same size
function megaWrapper(inner) {
  return `
    <div class="invisible absolute inset-x-0 top-full z-50 origin-top -translate-y-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
      <div class="w-full border-t border-border-light bg-surface shadow-soft">
        <div class="mx-auto flex min-h-[340px] w-full max-w-[1400px] gap-10 px-6 py-8 lg:px-10">${inner}</div>
      </div>
    </div>`;
}

function buildMegaMenu(item) {
  if (item.type === "brands") return buildBrandsMenu(item);

  const columns = item.columns
    .map(
      (col) => `
      <div class="min-w-[160px]">
        <h4 class="mb-3 text-xs font-bold uppercase tracking-wide text-heading">${col.title}</h4>
        <ul class="space-y-2">
          ${col.links
            .map(
              (link) =>
                `<li><a href="${plpUrl({ category: item.label, sub: link })}" class="text-sm text-body transition-colors hover:text-primary">${link}</a></li>`,
            )
            .join("")}
        </ul>
      </div>`,
    )
    .join("");

  const featured = buildFeaturedCard(item.featured);
  const showcase = buildShowcase(item.showcase);

  return megaWrapper(columns + showcase + featured);
}

// Featured promo card — image-backed when an image is provided
function buildFeaturedCard(featured) {
  if (!featured) return "";
  const pos = "ml-auto";

  if (featured.image) {
    return `
      <a href="${featured.href}" class="group/feat relative ${pos} flex h-auto w-56 shrink-0 overflow-hidden rounded-xl">
        <img src="${featured.image}" alt="${featured.title}" loading="lazy"
             class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/feat:scale-105" />
        <span class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></span>
        <span class="relative mt-auto p-5 text-white">
          <span class="inline-block rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">SendMyStyle</span>
          <span class="mt-3 block font-display text-lg font-bold">${featured.title}</span>
          <span class="mt-0.5 block text-sm text-neutral-200">${featured.text}</span>
          <span class="mt-3 inline-flex items-center gap-1 text-sm font-semibold">
            Explore <i class="bx bx-right-arrow-alt transition-transform duration-200 group-hover/feat:translate-x-1"></i>
          </span>
        </span>
      </a>`;
  }

  // Fallback text card
  return `
    <div class="${pos} flex w-56 shrink-0 flex-col justify-between rounded-xl bg-sendmystyle-50 p-5">
      <div>
        <span class="inline-block rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">SendMyStyle</span>
        <h4 class="mt-3 font-display text-lg font-bold text-sendmystyle-700">${featured.title}</h4>
        <p class="mt-1 text-sm text-body">${featured.text}</p>
      </div>
      <a href="${featured.href}" class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover">
        Explore <i class="bx bx-right-arrow-alt"></i>
      </a>
    </div>`;
}

// Category image showcase strip
function buildShowcase(showcase) {
  if (!Array.isArray(showcase) || showcase.length === 0) return "";

  const cards = showcase
    .map(
      (s) => `
      <a href="#" class="group/sc block w-28 shrink-0">
        <span class="block aspect-[3/4] overflow-hidden rounded-lg bg-neutral-100">
          <img src="${s.image}" alt="${s.label}" loading="lazy"
               class="h-full w-full object-cover transition-transform duration-500 group-hover/sc:scale-105" />
        </span>
        <span class="mt-2 block text-center text-xs font-semibold text-heading group-hover/sc:text-primary">${s.label}</span>
      </a>`,
    )
    .join("");

  return `
    <div class="shrink-0 border-l border-border-light pl-6">
      <p class="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Trending</p>
      <div class="flex gap-3">${cards}</div>
    </div>`;
}

function buildBrandsMenu(item) {
  const groups = item.groups
    .map(
      (group) => `
      <div class="min-w-[220px] flex-1">
        <h4 class="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-heading">
          <i class="bx ${group.icon} text-base text-primary"></i>${group.title}
        </h4>
        <ul class="space-y-1.5">
          ${group.sellers
            .map((s) => {
              const avatar = s.image
                ? `<span class="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border">
                   <img src="${s.image}" alt="${s.name}" loading="lazy" class="h-full w-full object-cover transition-transform duration-500 group-hover/seller:scale-110" />
                 </span>`
                : `<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-heading group-hover/seller:bg-sendmystyle-50 group-hover/seller:text-primary">${s.initials}</span>`;
              return `
            <li>
              <a href="#" class="group/seller flex items-center gap-3 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-border hover:bg-neutral-50">
                ${avatar}
                <span class="leading-tight">
                  <span class="block text-sm font-semibold text-heading">${s.name}</span>
                  <span class="block text-xs text-muted">${s.tag}</span>
                </span>
              </a>
            </li>`;
            })
            .join("")}
        </ul>
      </div>`,
    )
    .join("");

  const featured = item.featured
    ? `
      <a href="${item.featured.href}" class="group/feat relative ml-auto flex w-56 shrink-0 overflow-hidden rounded-xl">
        ${
          item.featured.image
            ? `<img src="${item.featured.image}" alt="${item.featured.title}" loading="lazy"
                 class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/feat:scale-105" />
               <span class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20"></span>`
            : `<span class="absolute inset-0 bg-neutral-950"></span>`
        }
        <span class="relative mt-auto p-5 text-white">
          <span class="inline-block rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">Partner</span>
          <span class="mt-3 block font-display text-lg font-bold">${item.featured.title}</span>
          <span class="mt-0.5 block text-sm text-neutral-200">${item.featured.text}</span>
          <span class="mt-3 inline-flex items-center gap-1 text-sm font-semibold">
            Get started <i class="bx bx-right-arrow-alt transition-transform duration-200 group-hover/feat:translate-x-1"></i>
          </span>
        </span>
      </a>`
    : "";

  return megaWrapper(groups + featured);
}

// ==============================
// Offer Slider (top bar)
// ==============================
function initOfferSlider() {
  const slider = document.getElementById("offer-slider");
  if (!slider || typeof OFFER_MESSAGES === "undefined" || OFFER_MESSAGES.length === 0) return;

  const STEP = 36; // matches h-9 (2.25rem) row height

  // Each row is exactly one viewport tall; duplicate first row at the end
  // so the loop back to the start is seamless.
  const messages = [...OFFER_MESSAGES, OFFER_MESSAGES[0]];
  slider.innerHTML = messages
    .map(
      (msg) =>
        `<div class="flex h-9 shrink-0 items-center justify-center truncate px-4 text-xs font-medium text-neutral-200">${msg}</div>`,
    )
    .join("");

  if (OFFER_MESSAGES.length === 1) return; // nothing to rotate

  let index = 0;
  setInterval(() => {
    index++;
    slider.style.transition = "transform 500ms ease-out";
    slider.style.transform = `translateY(-${index * STEP}px)`;

    // after reaching the duplicated first row, snap back without animation
    if (index === OFFER_MESSAGES.length) {
      setTimeout(() => {
        slider.style.transition = "none";
        slider.style.transform = "translateY(0)";
        index = 0;
      }, 520);
    }
  }, 3000);
}
