// ==============================
// Shared Components
// ==============================

// All HTML pages live in /pages/. Assets + components sit one level up.
const ROOT = "../";

document.addEventListener("DOMContentLoaded", async () => {
  async function loadComponent(id, path) {
    const el = document.getElementById(id);

    if (!el) return;

    try {
      const response = await fetch(ROOT + path);

      if (!response.ok) {
        throw new Error(`${path}: ${response.status}`);
      }

      el.innerHTML = await response.text();
    } catch (error) {
      console.error(error);
    }
  }

  await Promise.all([
    loadComponent("site-web-header", "components/header/web-header.html"),
    loadComponent("site-mobile-header", "components/header/mobile-header.html"),
    loadComponent("site-hero", "components/hero/hero.html"),
    loadComponent("home-categories", "components/home/categories.html"),
    loadComponent("home-customize", "components/home/customize.html"),
    loadComponent("home-trending", "components/home/trending.html"),
    loadComponent("home-why", "components/home/why.html"),
    loadComponent("home-how", "components/home/how.html"),
    loadComponent("home-offer", "components/home/offer.html"),
    loadComponent("site-footer", "components/footer/footer.html"),
  ]);

  initMobileDrawer();
  initHeroCarousel();
  initTrending();
  initListing();
  initProductDetails();
  initWishlist();
  initSearch();
  initCustomize();
  initCart();
  initOrderSummaries();
  initFallbackLinks();
  updateCartBadges();
});

// ==============================
// Customize studio
// ==============================

function initCustomize() {
  const root = document.querySelector("[data-customize]");
  if (!root) return;

  const id = new URLSearchParams(location.search).get("id");
  const p = getProduct(id);

  // Current selection: default to first choice of each option
  const selection = {};
  Object.keys(CUSTOMIZE_OPTIONS).forEach((key) => {
    selection[key] = 0; // index of chosen choice
  });

  function optionGroupHTML(key) {
    const opt = CUSTOMIZE_OPTIONS[key];
    const choices = opt.choices
      .map((c, i) => {
        const active = i === 0;
        const delta = c.delta ? ` <span class="text-[11px] text-body">+${formatPrice(c.delta)}</span>` : "";
        if (opt.type === "color") {
          return `<button data-choice="${key}" data-index="${i}" title="${c.label}" class="h-9 w-9 rounded-full ${active ? "border-2 border-primary ring-2 ring-sendmystyle-200" : "border border-border"}" style="background:${c.value}"></button>`;
        }
        return `<button data-choice="${key}" data-index="${i}" class="rounded-xl px-3 py-2.5 text-sm font-medium text-heading ${active ? "border-2 border-primary bg-sendmystyle-100" : "border border-border bg-surface"}">${c.label}${delta}</button>`;
      })
      .join("");

    const wrap = opt.type === "color" ? "flex flex-wrap gap-3" : "grid grid-cols-3 gap-2";
    return `
          <div>
            <p class="mb-3 flex items-center justify-between text-sm font-semibold text-heading">
              ${opt.label} <span data-selected="${key}" class="text-xs font-normal text-body">${opt.choices[0].label}</span>
            </p>
            <div class="${wrap}" data-group="${key}">${choices}</div>
          </div>`;
  }

  root.innerHTML = `
      <nav class="text-xs text-body" aria-label="Breadcrumb">
        <a href="product-details.html?id=${p.id}" class="hover:text-primary">${p.name}</a>
        <span class="px-1.5 text-sendmystyle-400">/</span>
        <span class="font-semibold text-heading">Customize</span>
      </nav>
      <div class="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div class="lg:sticky lg:top-24 lg:h-fit">
          <div class="relative overflow-hidden rounded-3xl bg-sendmystyle-100 shadow-soft">
            <img src="${p.image}" alt="${p.name} preview" class="aspect-[4/5] w-full object-cover" />
            <div data-preview-tint class="absolute inset-0 mix-blend-multiply transition-colors" style="background-color:${CUSTOMIZE_OPTIONS.color.choices[0].value}"></div>
            <span class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1.5 text-xs font-semibold text-primary shadow-soft backdrop-blur"><i class="bx bx-pencil"></i> Live preview</span>
          </div>
          <p class="mt-3 text-center text-xs text-body">Preview is indicative. Final product is made to order.</p>
        </div>
        <div class="space-y-6">
          <div>
            <h1 class="font-display text-2xl font-bold text-heading">Make it yours</h1>
            <p class="mt-1 text-sm text-body">${p.name} · ${p.seller}</p>
          </div>
          ${Object.keys(CUSTOMIZE_OPTIONS).map(optionGroupHTML).join("")}
          <div class="rounded-2xl border border-border bg-surface p-5">
            <div class="flex items-center justify-between text-sm">
              <span class="text-body">Base price</span>
              <span class="font-medium text-heading">${formatPrice(p.price)}</span>
            </div>
            <div class="mt-1 flex items-center justify-between text-sm">
              <span class="text-body">Customization</span>
              <span data-custom-delta class="font-medium text-primary">+₹0</span>
            </div>
            <div class="mt-2 flex items-center justify-between border-t border-border pt-2">
              <span class="text-sm font-semibold text-heading">Total</span>
              <span data-custom-total class="text-lg font-bold text-heading">${formatPrice(p.price)}</span>
            </div>
            <button type="button" data-add-custom class="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-hover active:bg-primary-active">
              <i class="bx bx-cart-add"></i> Add Customized to Bag
            </button>
          </div>
        </div>
      </div>`;

  const tint = root.querySelector("[data-preview-tint]");
  const deltaEl = root.querySelector("[data-custom-delta]");
  const totalEl = root.querySelector("[data-custom-total]");

  function recompute() {
    let delta = 0;
    Object.keys(selection).forEach((key) => {
      delta += CUSTOMIZE_OPTIONS[key].choices[selection[key]].delta || 0;
    });
    deltaEl.textContent = "+" + formatPrice(delta);
    totalEl.textContent = formatPrice(p.price + delta);
    return delta;
  }

  root.querySelectorAll("[data-choice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.choice;
      const index = Number(btn.dataset.index);
      selection[key] = index;

      // Update active styles within group
      const group = root.querySelector(`[data-group="${key}"]`);
      const isColor = CUSTOMIZE_OPTIONS[key].type === "color";
      group.querySelectorAll("button").forEach((b) => {
        if (isColor) {
          b.className = "h-9 w-9 rounded-full border border-border";
        } else {
          b.classList.remove("border-2", "border-primary", "bg-sendmystyle-100");
          b.classList.add("border", "border-border", "bg-surface");
        }
      });
      if (isColor) {
        btn.className = "h-9 w-9 rounded-full border-2 border-primary ring-2 ring-sendmystyle-200";
        if (tint) tint.style.backgroundColor = CUSTOMIZE_OPTIONS[key].choices[index].value;
      } else {
        btn.classList.remove("border", "border-border", "bg-surface");
        btn.classList.add("border-2", "border-primary", "bg-sendmystyle-100");
      }

      const selEl = root.querySelector(`[data-selected="${key}"]`);
      if (selEl) selEl.textContent = CUSTOMIZE_OPTIONS[key].choices[index].label;

      recompute();
    });
  });

  root.querySelector("[data-add-custom]").addEventListener("click", () => {
    const delta = recompute();
    const detail = Object.keys(selection)
      .map((k) => CUSTOMIZE_OPTIONS[k].choices[selection[k]].label)
      .join(", ");
    Cart.add({
      id: p.id,
      name: p.name,
      seller: p.seller,
      price: p.price + delta,
      image: p.image,
      size: "M",
      qty: 1,
      customized: true,
      detail,
    });
    updateCartBadges();
    const btn = root.querySelector("[data-add-custom]");
    btn.innerHTML = '<i class="bx bx-check"></i> Added to Bag';
    setTimeout(() => {
      location.href = "cart.html";
    }, 700);
  });

  recompute();
  document.title = "Customize " + p.name + " — SendMyStyle";
}

// ==============================
// Fallback nav links
// Any remaining category/nav link still pointing to "#"
// routes to the product listing so nothing is a dead link.
// ==============================

function initFallbackLinks() {
  document.querySelectorAll('#site-web-header a[href="#"], #mobile-drawer a[href="#"]').forEach((a) => {
    a.setAttribute("href", "product-listing.html");
  });
}

// ==============================
// Mobile Drawer + Accordion
// ==============================

function initMobileDrawer() {
  const drawer = document.getElementById("mobile-drawer");
  if (!drawer) return;

  const overlay = drawer.querySelector("[data-drawer-overlay]");
  const panel = drawer.querySelector("[data-drawer-panel]");
  const openBtn = document.querySelector("[data-drawer-open]");
  const closeEls = drawer.querySelectorAll("[data-drawer-close], [data-drawer-overlay]");

  const open = () => {
    drawer.classList.remove("hidden");
    requestAnimationFrame(() => {
      overlay.classList.remove("opacity-0");
      panel.classList.remove("-translate-x-full");
    });
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    overlay.classList.add("opacity-0");
    panel.classList.add("-translate-x-full");
    document.body.style.overflow = "";
    setTimeout(() => drawer.classList.add("hidden"), 250);
  };

  if (openBtn) openBtn.addEventListener("click", open);
  closeEls.forEach((el) => el.addEventListener("click", close));

  // Accordion (single open at a time)
  const accordions = drawer.querySelectorAll("[data-accordion]");
  accordions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const body = btn.nextElementSibling;
      const icon = btn.querySelector(".bx-chevron-down");
      const willOpen = body.classList.contains("hidden");

      // Close all others
      accordions.forEach((other) => {
        if (other === btn) return;
        const otherBody = other.nextElementSibling;
        const otherIcon = other.querySelector(".bx-chevron-down");
        if (otherBody) otherBody.classList.add("hidden");
        if (otherIcon) otherIcon.classList.remove("rotate-180");
      });

      // Toggle current
      body.classList.toggle("hidden", !willOpen);
      if (icon) icon.classList.toggle("rotate-180", willOpen);
    });
  });
}

// ==============================
// Hero Carousel (data-driven)
// ==============================

const HERO_SLIDES = [
  {
    eyebrow: "Choose it. Customize it. Make it yours.",
    title: "Wear Your Style. Your Way.",
    description: "Choose a product. Customize the details. Make it truly yours.",
    primary: { label: "Customize Your Style", href: "customize.html" },
    secondary: { label: "Explore Styles", href: "product-listing.html" },
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=1000&q=70",
    alt: "A shirt transforming into a customized design",
    badge: "Customized",
    watermark: "Yours",
    chips: ["Choose", "Customize", "Own it"],
  },
  {
    eyebrow: "Made to fit your taste",
    title: "Not Just Your Size. Your Style.",
    description: "Customize colors, collars, cuffs, buttons and more — before you buy.",
    primary: { label: "Start Customizing", href: "customize.html" },
    secondary: null,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=70",
    alt: "A shirt with color, collar and cuff customization options",
    badge: "Color · Collar · Cuffs",
    watermark: "Detail",
    chips: ["Colors", "Collars", "Cuffs", "Buttons"],
  },
  {
    eyebrow: "A marketplace built around you",
    title: "Discover. Customize. Make It Yours.",
    description: "Explore styles from different sellers and personalize the ones you love.",
    primary: { label: "Explore Styles", href: "product-listing.html" },
    secondary: null,
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1000&q=70",
    alt: "Multiple fashion products with one highlighted customized result",
    badge: "Your pick, personalized",
    watermark: "Style",
    chips: ["Sellers", "Styles", "Personalized"],
  },
];

function slideTemplate(slide, index) {
  const secondary = slide.secondary
    ? `<a href="${slide.secondary.href}" class="group inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-heading transition hover:border-primary hover:text-primary sm:w-auto">${slide.secondary.label} <i class="bx bx-right-arrow-alt text-lg transition-transform group-hover:translate-x-1"></i></a>`
    : "";

  const chips = slide.chips
    .map(
      (c) =>
        `<span class="rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-semibold text-primary shadow-sm backdrop-blur">${c}</span>`,
    )
    .join("");

  return `
    <div
      class="hero-slide col-start-1 row-start-1 opacity-0 invisible"
      role="group"
      aria-roledescription="slide"
      aria-label="${index + 1} of ${HERO_SLIDES.length}"
      data-hero-slide
    >
      <div class="mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-5 py-7 sm:px-6 md:grid-cols-2 md:gap-10 md:py-10">
        <!-- Content -->
        <div class="hero-anim order-2 text-center md:order-1 md:text-left">
          <p class="inline-flex items-center gap-2 rounded-full bg-sendmystyle-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary sm:text-[11px]">
            <span class="inline-block h-1.5 w-1.5 rounded-full bg-primary"></span> ${slide.eyebrow}
          </p>
          <h1 class="font-display mt-3 text-2xl font-bold leading-[1.12] tracking-tight text-heading sm:text-3xl md:mt-4 md:text-4xl lg:text-5xl">${slide.title}</h1>
          <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-body sm:text-base md:mx-0">${slide.description}</p>
          <div class="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:mt-6 md:justify-start">
            <a href="${slide.primary.href}" class="group inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-hover active:bg-primary-active sm:w-auto">${slide.primary.label} <i class="bx bx-right-arrow-alt text-lg transition-transform group-hover:translate-x-1"></i></a>
            ${secondary}
          </div>
        </div>
        <!-- Visual -->
        <div class="hero-anim order-1 md:order-2">
          <div class="relative mx-auto w-full max-w-md md:max-w-none">
            <div class="relative aspect-[16/10] overflow-hidden rounded-2xl bg-sendmystyle-100 shadow-soft md:aspect-[3/2] md:max-h-[340px]">
              <img src="${slide.image}" alt="${slide.alt}" loading="${index === 0 ? "eager" : "lazy"}" class="h-full w-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-sendmystyle-950/30 to-transparent"></div>
              <!-- Badge -->
              <span class="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface/90 px-3 py-1 text-[11px] font-semibold text-primary shadow-soft backdrop-blur">
                <i class="bx bx-pencil"></i> ${slide.badge}
              </span>
              <!-- Floating customization chips -->
              <div class="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5">
                ${chips}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function initHeroCarousel() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  const track = hero.querySelector("[data-hero-track]");
  const dotsWrap = hero.querySelector("[data-hero-dots]");
  const prevBtn = hero.querySelector("[data-hero-prev]");
  const nextBtn = hero.querySelector("[data-hero-next]");
  if (!track) return;

  // Render slides + dots
  track.innerHTML = HERO_SLIDES.map(slideTemplate).join("");
  dotsWrap.innerHTML = HERO_SLIDES.map(
    (_, i) =>
      `<button type="button" role="tab" aria-label="Go to slide ${i + 1}" data-hero-dot class="h-2.5 rounded-full bg-sendmystyle-300 transition-all"></button>`,
  ).join("");

  const slides = Array.from(track.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(dotsWrap.querySelectorAll("[data-hero-dot]"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const INTERVAL = 5500;

  let current = 0;
  let timer = null;

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle("is-active", active);
      slide.classList.toggle("opacity-100", active);
      slide.classList.toggle("visible", active);
      slide.classList.toggle("opacity-0", !active);
      slide.classList.toggle("invisible", !active);
    });
    dots.forEach((dot, i) => {
      const active = i === current;
      dot.classList.toggle("w-6", active);
      dot.classList.toggle("bg-primary", active);
      dot.classList.toggle("w-2.5", !active);
      dot.classList.toggle("bg-sendmystyle-300", !active);
      dot.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  const next = () => show(current + 1);
  const prev = () => show(current - 1);

  function start() {
    if (reduceMotion || timer) return;
    timer = setInterval(next, INTERVAL);
  }
  function stop() {
    clearInterval(timer);
    timer = null;
  }
  function restart() {
    stop();
    start();
  }

  // Controls
  nextBtn &&
    nextBtn.addEventListener("click", () => {
      next();
      restart();
    });
  prevBtn &&
    prevBtn.addEventListener("click", () => {
      prev();
      restart();
    });
  dots.forEach((dot, i) =>
    dot.addEventListener("click", () => {
      show(i);
      restart();
    }),
  );

  // Pause on hover (desktop)
  hero.addEventListener("mouseenter", stop);
  hero.addEventListener("mouseleave", start);

  // Keyboard navigation
  hero.setAttribute("tabindex", "0");
  hero.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prev();
      restart();
    }
    if (e.key === "ArrowRight") {
      next();
      restart();
    }
  });

  // Swipe (mobile)
  let startX = 0;
  let dragging = false;
  track.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      dragging = true;
      stop();
    },
    { passive: true },
  );
  track.addEventListener("touchend", (e) => {
    if (!dragging) return;
    dragging = false;
    const delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 40) (delta < 0 ? next : prev)();
    start();
  });

  show(0);
  start();
}

// ==============================
// Product card (uses central PRODUCTS from data.js)
// ==============================

function productCard(p) {
  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);
  const badge = p.customizable
    ? `<span class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-white"><i class="bx bx-pencil"></i> Customizable</span>`
    : "";

  return `
    <a href="product-details.html?id=${p.id}" class="group block overflow-hidden rounded-2xl border border-border bg-surface transition hover:shadow-soft">
      <div class="relative aspect-[3/4] overflow-hidden bg-sendmystyle-100">
        <img src="${p.image}" alt="${p.name}" loading="lazy" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ${badge}
        <span class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 text-heading backdrop-blur transition hover:text-primary">
          <i class="bx bx-heart"></i>
        </span>
      </div>
      <div class="p-3">
        <p class="truncate text-sm font-semibold text-heading">${p.name}</p>
        <p class="mt-0.5 truncate text-xs text-body">${p.seller}</p>
        <div class="mt-2 flex items-center gap-2">
          <span class="text-sm font-bold text-heading">${formatPrice(p.price)}</span>
          <span class="text-xs text-sendmystyle-400 line-through">${formatPrice(p.mrp)}</span>
          <span class="text-xs font-semibold text-primary">${off}% off</span>
        </div>
      </div>
    </a>`;
}

function initTrending() {
  const grid = document.querySelector("[data-trending-grid]");
  if (!grid) return;
  grid.innerHTML = PRODUCTS.slice(0, 4).map(productCard).join("");
}

// ==============================
// Product Listing page
// ==============================

function initListing() {
  const grid = document.querySelector("[data-listing-grid]");
  if (!grid) return;

  const sortSel = document.querySelector("[data-sort]");
  const countEl = document.querySelector("[data-count]");
  const emptyEl = document.querySelector("[data-listing-empty]");
  const chipsEl = document.querySelector("[data-active-filters]");
  const filtersDesktop = document.querySelector("[data-filters]");
  const filtersMobile = document.querySelector("[data-filters-mobile]");

  // Active filter state (Sets for multi-select)
  const state = {
    category: new Set(),
    brand: new Set(),
    color: new Set(),
    price: new Set(), // stores range labels
    customizable: false,
  };

  // Prefill from URL ?category=
  const urlCat = new URLSearchParams(location.search).get("category");
  if (urlCat && FACETS.category.includes(urlCat)) {
    state.category.add(urlCat);
    const titleEl = document.querySelector("[data-listing-heading]");
    const bcEl = document.querySelector("[data-listing-title]");
    const label = cap(urlCat);
    if (titleEl) titleEl.textContent = label;
    if (bcEl) bcEl.textContent = label;
    document.title = label + " — SendMyStyle";
  }

  function cap(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function checkboxRow(group, value, label) {
    const checked = state[group].has(value) ? "checked" : "";
    return `<li><label class="flex cursor-pointer items-center gap-2"><input type="checkbox" data-filter="${group}" value="${value}" class="accent-primary" ${checked} /> ${label}</label></li>`;
  }

  function filtersHTML() {
    return `
          <div class="mb-4 hidden items-center justify-between lg:flex">
            <h2 class="text-sm font-bold uppercase tracking-wide text-heading">Filters</h2>
            <button type="button" data-clear-all class="text-xs font-semibold text-primary hover:text-primary-hover">Clear</button>
          </div>
          <div>
            <p class="mb-2 text-[11px] font-bold uppercase tracking-widest text-primary">Category</p>
            <ul class="space-y-2 text-sm text-body">${FACETS.category.map((c) => checkboxRow("category", c, cap(c))).join("")}</ul>
          </div>
          <div class="mt-5 border-t border-border pt-4">
            <p class="mb-2 text-[11px] font-bold uppercase tracking-widest text-primary">Brand</p>
            <ul class="space-y-2 text-sm text-body">${FACETS.brands.map((b) => checkboxRow("brand", b, b)).join("")}</ul>
          </div>
          <div class="mt-5 border-t border-border pt-4">
            <p class="mb-2 text-[11px] font-bold uppercase tracking-widest text-primary">Price</p>
            <ul class="space-y-2 text-sm text-body">${FACETS.priceRanges.map((r) => checkboxRow("price", r.label, r.label)).join("")}</ul>
          </div>
          <div class="mt-5 border-t border-border pt-4">
            <p class="mb-2 text-[11px] font-bold uppercase tracking-widest text-primary">Color</p>
            <ul class="space-y-2 text-sm text-body">${FACETS.colors.map((c) => checkboxRow("color", c, c)).join("")}</ul>
          </div>
          <div class="mt-5 border-t border-border pt-4">
            <p class="mb-2 text-[11px] font-bold uppercase tracking-widest text-primary">Customization</p>
            <ul class="space-y-2 text-sm text-body">
              <li><label class="flex cursor-pointer items-center gap-2"><input type="checkbox" data-filter="customizable" ${state.customizable ? "checked" : ""} class="accent-primary" /> Customizable only</label></li>
            </ul>
          </div>`;
  }

  function bindFilterInputs(container) {
    container.querySelectorAll("[data-filter]").forEach((input) => {
      input.addEventListener("change", () => {
        const group = input.dataset.filter;
        if (group === "customizable") {
          state.customizable = input.checked;
        } else {
          if (input.checked) state[group].add(input.value);
          else state[group].delete(input.value);
        }
        syncInputs();
        render();
      });
    });
  }

  // Keep both desktop + mobile panels in sync
  function syncInputs() {
    document.querySelectorAll("[data-filter]").forEach((input) => {
      const group = input.dataset.filter;
      if (group === "customizable") input.checked = state.customizable;
      else input.checked = state[group].has(input.value);
    });
  }

  function renderFilters() {
    if (filtersDesktop) {
      filtersDesktop.innerHTML = filtersHTML();
      bindFilterInputs(filtersDesktop);
    }
    if (filtersMobile) {
      filtersMobile.innerHTML = filtersHTML();
      bindFilterInputs(filtersMobile);
    }
  }

  function activeChips() {
    const chips = [];
    state.category.forEach((v) => chips.push(["category", v, cap(v)]));
    state.brand.forEach((v) => chips.push(["brand", v, v]));
    state.price.forEach((v) => chips.push(["price", v, v]));
    state.color.forEach((v) => chips.push(["color", v, v]));
    if (state.customizable) chips.push(["customizable", "", "Customizable"]);

    if (!chipsEl) return;
    chipsEl.innerHTML = chips.length
      ? chips
          .map(
            ([g, v, label]) =>
              `<button type="button" data-chip data-group="${g}" data-value="${v}" class="inline-flex items-center gap-1 rounded-full bg-sendmystyle-100 px-3 py-1 text-xs font-semibold text-primary">${label} <i class="bx bx-x text-sm"></i></button>`,
          )
          .join("") +
        `<button type="button" data-clear-all class="text-xs font-semibold text-body underline underline-offset-2 hover:text-primary">Clear all</button>`
      : "";

    chipsEl.querySelectorAll("[data-chip]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const g = btn.dataset.group;
        if (g === "customizable") state.customizable = false;
        else state[g].delete(btn.dataset.value);
        syncInputs();
        render();
      });
    });
    chipsEl.querySelectorAll("[data-clear-all]").forEach((b) => b.addEventListener("click", clearAll));
  }

  function clearAll() {
    state.category.clear();
    state.brand.clear();
    state.color.clear();
    state.price.clear();
    state.customizable = false;
    syncInputs();
    render();
  }

  function matches(p) {
    if (state.category.size && !state.category.has(p.category)) return false;
    if (state.brand.size && !state.brand.has(p.seller)) return false;
    if (state.color.size && !p.colors.some((c) => state.color.has(c))) return false;
    if (state.customizable && !p.customizable) return false;
    if (state.price.size) {
      const inRange = [...state.price].some((label) => {
        const r = FACETS.priceRanges.find((x) => x.label === label);
        return r && p.price >= r.min && p.price <= r.max;
      });
      if (!inRange) return false;
    }
    return true;
  }

  function render() {
    let items = PRODUCTS.filter(matches);

    const sort = sortSel ? sortSel.value : "popular";
    if (sort === "low") items.sort((a, b) => a.price - b.price);
    else if (sort === "high") items.sort((a, b) => b.price - a.price);
    else if (sort === "rating") items.sort((a, b) => b.rating - a.rating);
    else if (sort === "discount") items.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp);

    grid.innerHTML = items.map(productCard).join("");
    if (countEl) countEl.textContent = items.length;
    if (emptyEl) emptyEl.classList.toggle("hidden", items.length > 0);
    activeChips();
  }

  if (sortSel) sortSel.addEventListener("change", render);

  // Clear-all buttons (in drawer footer / empty state)
  document.querySelectorAll("[data-clear-all]").forEach((b) => b.addEventListener("click", clearAll));

  // Mobile filter drawer
  const drawer = document.querySelector("[data-filter-drawer]");
  if (drawer) {
    const overlay = drawer.querySelector("[data-filter-overlay]");
    const panel = drawer.querySelector("[data-filter-panel]");
    const openBtn = document.querySelector("[data-open-filters]");
    const closeEls = drawer.querySelectorAll("[data-close-filters], [data-filter-overlay]");
    const open = () => {
      drawer.classList.remove("hidden");
      requestAnimationFrame(() => {
        overlay.classList.remove("opacity-0");
        panel.classList.remove("translate-x-full");
      });
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      overlay.classList.add("opacity-0");
      panel.classList.add("translate-x-full");
      document.body.style.overflow = "";
      setTimeout(() => drawer.classList.add("hidden"), 250);
    };
    if (openBtn) openBtn.addEventListener("click", open);
    closeEls.forEach((el) => el.addEventListener("click", close));
  }

  renderFilters();
  render();
}

// ==============================
// Product Details page (dynamic by ?id=)
// ==============================

function initProductDetails() {
  const root = document.querySelector("[data-product-details]");
  if (!root) return;

  const id = new URLSearchParams(location.search).get("id");
  const p = getProduct(id);
  const off = Math.round(((p.mrp - p.price) / p.mrp) * 100);

  const thumbs = (p.gallery.length ? p.gallery : [p.image, p.image, p.image])
    .map((src) => `<img src="${src}" alt="" class="h-20 w-16 rounded-lg border border-border object-cover" />`)
    .join("");

  const customBadge = p.customizable
    ? `<span class="mt-4 inline-flex items-center gap-1.5 rounded-full bg-sendmystyle-100 px-3 py-1.5 text-xs font-semibold text-primary"><i class="bx bx-pencil"></i> Customizable product</span>`
    : "";

  const customBtn = p.customizable
    ? `<a href="customize.html?id=${p.id}" class="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-hover active:bg-primary-active"><i class="bx bx-pencil"></i> Customize This</a>`
    : "";

  const bagBtnClass = p.customizable
    ? "inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-heading transition hover:border-primary hover:text-primary"
    : "inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-hover active:bg-primary-active";

  root.innerHTML = `
      <nav class="text-xs text-body" aria-label="Breadcrumb">
        <a href="index.html" class="hover:text-primary">Home</a>
        <span class="px-1.5 text-sendmystyle-400">/</span>
        <a href="product-listing.html" class="hover:text-primary">Explore Styles</a>
        <span class="px-1.5 text-sendmystyle-400">/</span>
        <span class="font-semibold text-heading">${p.name}</span>
      </nav>
      <div class="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <div>
          <div class="overflow-hidden rounded-3xl bg-sendmystyle-100 shadow-soft">
            <img src="${p.image}" alt="${p.name}" class="aspect-[4/5] w-full object-cover" />
          </div>
          <div class="mt-3 flex gap-3">${thumbs}</div>
        </div>
        <div>
          <p class="text-xs font-semibold uppercase tracking-widest text-body">${p.seller}</p>
          <h1 class="font-display mt-1 text-2xl font-bold text-heading sm:text-3xl">${p.name}</h1>
          <div class="mt-3 flex items-center gap-2">
            <span class="text-2xl font-bold text-heading">${formatPrice(p.price)}</span>
            <span class="text-sm text-sendmystyle-400 line-through">${formatPrice(p.mrp)}</span>
            <span class="text-sm font-semibold text-primary">${off}% off</span>
          </div>
          <p class="mt-1 text-xs text-body">Inclusive of all taxes</p>
          ${customBadge}
          <div class="mt-6">
            <p class="mb-2 text-sm font-semibold text-heading">Select Size</p>
            <div class="flex flex-wrap gap-2" data-size-group>
              <button data-size class="h-10 w-10 rounded-full border border-border text-sm font-semibold text-heading transition hover:border-primary hover:text-primary">S</button>
              <button data-size class="h-10 w-10 rounded-full border border-primary bg-primary text-sm font-semibold text-white">M</button>
              <button data-size class="h-10 w-10 rounded-full border border-border text-sm font-semibold text-heading transition hover:border-primary hover:text-primary">L</button>
              <button data-size class="h-10 w-10 rounded-full border border-border text-sm font-semibold text-heading transition hover:border-primary hover:text-primary">XL</button>
            </div>
          </div>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            ${customBtn}
            <button type="button" data-add-bag class="${bagBtnClass}"><i class="bx bx-cart"></i> Add to Bag</button>
          </div>
          <div class="mt-8 border-t border-border pt-6">
            <h2 class="text-sm font-bold uppercase tracking-wide text-heading">Product Details</h2>
            <p class="mt-3 text-sm leading-relaxed text-body">${p.description}</p>
          </div>
        </div>
      </div>`;

  // Size selection
  root.querySelectorAll("[data-size]").forEach((btn) => {
    btn.addEventListener("click", () => {
      root.querySelectorAll("[data-size]").forEach((b) => {
        b.classList.remove("border-primary", "bg-primary", "text-white");
        b.classList.add("border-border", "text-heading");
      });
      btn.classList.remove("border-border", "text-heading");
      btn.classList.add("border-primary", "bg-primary", "text-white");
    });
  });

  // Add to bag
  const addBtn = root.querySelector("[data-add-bag]");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      Cart.add({
        id: p.id,
        name: p.name,
        seller: p.seller,
        price: p.price,
        image: p.image,
        size: "M",
        qty: 1,
        customized: false,
      });
      updateCartBadges();
      addBtn.innerHTML = '<i class="bx bx-check"></i> Added to Bag';
      setTimeout(() => {
        addBtn.innerHTML = '<i class="bx bx-cart"></i> Add to Bag';
      }, 1500);
    });
  }

  document.title = p.name + " — SendMyStyle";
}

// ==============================
// Wishlist + Search pages
// ==============================

function initWishlist() {
  const grid = document.querySelector("[data-wishlist-grid]");
  if (!grid) return;
  grid.innerHTML = PRODUCTS.slice(0, 3).map(productCard).join("");
}

function initSearch() {
  const grid = document.querySelector("[data-search-grid]");
  if (!grid) return;
  const results = PRODUCTS.filter((p) => /shirt|tee|oxford/i.test(p.name));
  grid.innerHTML = results.map(productCard).join("");
  const count = document.querySelector("[data-search-count]");
  if (count) count.textContent = results.length;
}

// ==============================
// Cart page + order summaries + header badges
// ==============================

function updateCartBadges() {
  const count = Cart.count();
  document
    .querySelectorAll(
      "[data-cart-count], #site-web-header a[href='cart.html'] span, #site-mobile-header a[href='cart.html'] span",
    )
    .forEach((el) => {
      el.textContent = count;
    });
}

function initCart() {
  const list = document.querySelector("[data-cart-list]");
  if (!list) return;

  function render() {
    const items = Cart.all();
    const countEl = document.querySelector("[data-cart-items-count]");
    if (countEl) countEl.textContent = items.length + (items.length === 1 ? " item" : " items");

    if (!items.length) {
      list.innerHTML = `
              <div class="rounded-2xl border border-border bg-surface p-10 text-center">
                <i class="bx bx-cart text-4xl text-sendmystyle-300"></i>
                <p class="mt-3 text-sm font-semibold text-heading">Your bag is empty</p>
                <a href="product-listing.html" class="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover">Explore Styles <i class="bx bx-right-arrow-alt"></i></a>
              </div>`;
    } else {
      list.innerHTML = items
        .map((it, i) => {
          const customTag = it.customized
            ? `<span class="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-primary"><i class="bx bx-pencil"></i> Customized${it.detail ? " · " + it.detail : ""}</span>`
            : "";
          return `
                    <div class="flex gap-4 rounded-2xl border border-border bg-surface p-4">
                      <img src="${it.image}" alt="${it.name}" class="h-28 w-24 rounded-lg object-cover" />
                      <div class="flex flex-1 flex-col">
                        <div class="flex justify-between gap-2">
                          <div>
                            <p class="text-sm font-semibold text-heading">${it.name}</p>
                            <p class="text-xs text-body">${it.seller} · Size ${it.size}</p>
                            ${customTag}
                          </div>
                          <button data-remove="${i}" aria-label="Remove" class="text-lg text-body transition hover:text-primary"><i class="bx bx-trash"></i></button>
                        </div>
                        <div class="mt-auto flex items-center justify-between">
                          <div class="flex items-center gap-2 rounded-full border border-border">
                            <button data-dec="${i}" aria-label="Decrease" class="flex h-8 w-8 items-center justify-center text-heading">−</button>
                            <span class="text-sm font-semibold text-heading">${it.qty || 1}</span>
                            <button data-inc="${i}" aria-label="Increase" class="flex h-8 w-8 items-center justify-center text-heading">+</button>
                          </div>
                          <span class="text-sm font-bold text-heading">${formatPrice(it.price * (it.qty || 1))}</span>
                        </div>
                      </div>
                    </div>`;
        })
        .join("");
    }

    // Summary
    const sub = Cart.subtotal();
    const subEl = document.querySelector("[data-cart-subtotal]");
    const totalEl = document.querySelector("[data-cart-total]");
    if (subEl) subEl.textContent = formatPrice(sub);
    if (totalEl) totalEl.textContent = formatPrice(sub);

    // Bind actions
    list.querySelectorAll("[data-remove]").forEach((b) =>
      b.addEventListener("click", () => {
        Cart.removeAt(+b.dataset.remove);
        render();
        updateCartBadges();
      }),
    );
    list.querySelectorAll("[data-inc]").forEach((b) =>
      b.addEventListener("click", () => {
        const i = +b.dataset.inc;
        Cart.setQty(i, (Cart.all()[i].qty || 1) + 1);
        render();
        updateCartBadges();
      }),
    );
    list.querySelectorAll("[data-dec]").forEach((b) =>
      b.addEventListener("click", () => {
        const i = +b.dataset.dec;
        Cart.setQty(i, (Cart.all()[i].qty || 1) - 1);
        render();
        updateCartBadges();
      }),
    );
  }

  render();
}

// Fill order totals on checkout/payment from the cart
function initOrderSummaries() {
  const sub = Cart.subtotal();
  document.querySelectorAll("[data-order-subtotal]").forEach((el) => (el.textContent = formatPrice(sub)));
  document.querySelectorAll("[data-order-total]").forEach((el) => (el.textContent = formatPrice(sub)));
  document.querySelectorAll("[data-pay-amount]").forEach((el) => (el.textContent = formatPrice(sub)));
}
