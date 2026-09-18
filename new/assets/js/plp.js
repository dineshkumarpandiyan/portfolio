// ==============================
// SendMyStyle — Product Listing Page (PLP)
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  if (typeof PRODUCTS === "undefined") return;

  const params = new URLSearchParams(location.search);

  // State
  const state = {
    category: params.get("category") || "",
    subcategory: params.get("sub") || "",
    q: (params.get("q") || "").toLowerCase(),
    price: [0, 10000],
    brands: new Set(),
    colors: new Set(),
    sizes: new Set(),
    rating: 0,
    customizable: false,
    sort: "popularity",
  };

  const SORTS = [
    { id: "popularity", label: "Popularity" },
    { id: "price-asc", label: "Price: Low to High" },
    { id: "price-desc", label: "Price: High to Low" },
    { id: "rating", label: "Customer Rating" },
    { id: "discount", label: "Discount" },
    { id: "newest", label: "Newest First" },
  ];

  // --- helpers ---
  const money = (n) => `₹${n.toLocaleString("en-IN")}`;
  const discountOf = (p) => (p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0);

  // Base set filtered by category/sub/search (drives available filter options)
  function baseSet() {
    return PRODUCTS.filter((p) => {
      if (state.category && p.category !== state.category) return false;
      if (state.subcategory && p.subcategory !== state.subcategory) return false;
      if (state.q) {
        const hay = `${p.name} ${p.seller} ${p.category} ${p.subcategory}`.toLowerCase();
        if (!hay.includes(state.q)) return false;
      }
      return true;
    });
  }

  // Apply the sidebar filters on top of the base set
  function filtered() {
    return baseSet().filter((p) => {
      if (p.price < state.price[0] || p.price > state.price[1]) return false;
      if (state.brands.size && !state.brands.has(p.seller)) return false;
      if (state.colors.size && !p.colors.some((c) => state.colors.has(c))) return false;
      if (state.sizes.size && !p.sizes.some((s) => state.sizes.has(s))) return false;
      if (state.rating && p.rating < state.rating) return false;
      if (state.customizable && !p.customizable) return false;
      return true;
    });
  }

  function sortList(list) {
    const l = [...list];
    switch (state.sort) {
      case "price-asc":
        return l.sort((a, b) => a.price - b.price);
      case "price-desc":
        return l.sort((a, b) => b.price - a.price);
      case "rating":
        return l.sort((a, b) => b.rating - a.rating);
      case "discount":
        return l.sort((a, b) => discountOf(b) - discountOf(a));
      case "newest":
        return l.sort((a, b) => b.id - a.id);
      default:
        return l.sort((a, b) => b.ratingCount - a.ratingCount);
    }
  }

  // --- title / breadcrumb ---
  function setHeader() {
    const catLabel = state.category && CATEGORY_MAP[state.category] ? CATEGORY_MAP[state.category].label : "";
    const subLabel = state.subcategory ? SUBCATEGORY_LABELS[state.subcategory] || state.subcategory : "";
    const title = subLabel || catLabel || (state.q ? `Results for "${state.q}"` : "All Products");
    document.getElementById("plp-title").textContent = title;

    const crumbs = ['<a href="../index.html" class="hover:text-primary">Home</a>'];
    if (catLabel)
      crumbs.push(`<a href="products.html?category=${state.category}" class="hover:text-primary">${catLabel}</a>`);
    if (subLabel) crumbs.push(`<span class="text-heading">${subLabel}</span>`);
    document.getElementById("plp-breadcrumb").innerHTML = crumbs.join(
      ' <i class="bx bx-chevron-right align-middle"></i> ',
    );
  }

  // --- filter panel markup ---
  function buildFilters() {
    const base = baseSet();
    const brands = [...new Set(base.map((p) => p.seller))].sort();
    const colors = [...new Set(base.flatMap((p) => p.colors))];
    const sizes = PRODUCT_SIZES.filter((s) => base.some((p) => p.sizes.includes(s)));
    const maxPrice = Math.max(10000, ...base.map((p) => p.price));

    const hexOf = (name) => (PRODUCT_COLORS.find((c) => c.name === name) || {}).hex || "#ccc";

    const section = (title, body) => `
      <div class="border-b border-border py-5">
        <h4 class="mb-3 text-sm font-bold text-heading">${title}</h4>
        ${body}
      </div>`;

    const catBody = Object.entries(CATEGORY_MAP)
      .map(([key, val]) => {
        const active = state.category === key;
        return `<a href="products.html?category=${key}" class="block rounded px-2 py-1.5 text-sm transition-colors ${
          active ? "bg-sendmystyle-50 font-semibold text-primary" : "text-body hover:text-primary"
        }">${val.label}</a>`;
      })
      .join("");

    const subBody =
      state.category && CATEGORY_MAP[state.category]
        ? CATEGORY_MAP[state.category].subs
            .map((s) => {
              const active = state.subcategory === s;
              return `<a href="products.html?category=${state.category}&sub=${s}" class="block rounded px-2 py-1.5 text-sm transition-colors ${
                active ? "bg-sendmystyle-50 font-semibold text-primary" : "text-body hover:text-primary"
              }">${SUBCATEGORY_LABELS[s] || s}</a>`;
            })
            .join("")
        : "";

    const priceBody = `
      <input type="range" id="f-price" min="0" max="${maxPrice}" step="100" value="${state.price[1]}"
             class="w-full accent-primary" />
      <div class="mt-2 flex justify-between text-xs text-muted">
        <span>₹0</span><span>Up to <span id="f-price-val" class="font-semibold text-heading">${money(state.price[1])}</span></span>
      </div>`;

    const brandBody = `<div class="max-h-44 space-y-1.5 overflow-y-auto pr-1">${brands
      .map(
        (b) => `
      <label class="flex cursor-pointer items-center gap-2 text-sm text-body">
        <input type="checkbox" class="f-brand h-4 w-4 rounded border-border text-primary focus:ring-primary" value="${b}" ${state.brands.has(b) ? "checked" : ""} />
        ${b}
      </label>`,
      )
      .join("")}</div>`;

    const colorBody = `<div class="flex flex-wrap gap-2">${colors
      .map(
        (c) => `
      <button class="f-color flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
        state.colors.has(c) ? "border-primary" : "border-border"
      }" data-color="${c}" title="${c}">
        <span class="h-5 w-5 rounded-full ${c === "White" ? "border border-border" : ""}" style="background:${hexOf(c)}"></span>
      </button>`,
      )
      .join("")}</div>`;

    const sizeBody = `<div class="flex flex-wrap gap-2">${sizes
      .map(
        (s) => `
      <button class="f-size h-9 min-w-9 rounded-lg border px-2 text-sm font-medium transition-colors ${
        state.sizes.has(s)
          ? "border-primary bg-sendmystyle-50 text-primary"
          : "border-border text-body hover:border-primary"
      }" data-size="${s}">${s}</button>`,
      )
      .join("")}</div>`;

    const ratingBody = [4, 3, 2]
      .map(
        (r) => `
      <label class="flex cursor-pointer items-center gap-2 text-sm text-body">
        <input type="radio" name="f-rating" class="f-rating h-4 w-4 border-border text-primary focus:ring-primary" value="${r}" ${state.rating === r ? "checked" : ""} />
        <span class="flex items-center gap-1"><i class="bx bxs-star text-primary"></i> ${r} & above</span>
      </label>`,
      )
      .join("");

    const customBody = `
      <label class="flex cursor-pointer items-center gap-2 text-sm text-body">
        <input type="checkbox" id="f-custom" class="h-4 w-4 rounded border-border text-primary focus:ring-primary" ${state.customizable ? "checked" : ""} />
        <span class="flex items-center gap-1.5"><i class="bx bx-palette text-primary"></i> Customisable only</span>
      </label>`;

    return `
      <div class="flex items-center justify-between pb-1">
        <span class="text-sm font-bold uppercase tracking-wide text-heading">Filters</span>
        <button type="button" class="f-clear text-xs font-semibold text-primary hover:underline">Clear all</button>
      </div>
      ${section("Category", catBody)}
      ${subBody ? section("Type", subBody) : ""}
      ${section("Price", priceBody)}
      ${section("Customisation", customBody)}
      ${section("Brand", brandBody)}
      ${section("Colour", colorBody)}
      ${section("Size", sizeBody)}
      ${section("Rating", ratingBody)}`;
  }

  // Wire filter events (works for both desktop + mobile panels via container)
  function wireFilters(container) {
    container.querySelector("#f-price")?.addEventListener("input", (e) => {
      state.price[1] = Number(e.target.value);
      const val = container.querySelector("#f-price-val");
      if (val) val.textContent = money(state.price[1]);
      render();
    });
    container.querySelectorAll(".f-brand").forEach((el) =>
      el.addEventListener("change", () => {
        el.checked ? state.brands.add(el.value) : state.brands.delete(el.value);
        render();
      }),
    );
    container.querySelectorAll(".f-color").forEach((el) =>
      el.addEventListener("click", () => {
        const c = el.getAttribute("data-color");
        state.colors.has(c) ? state.colors.delete(c) : state.colors.add(c);
        refreshPanels();
        render();
      }),
    );
    container.querySelectorAll(".f-size").forEach((el) =>
      el.addEventListener("click", () => {
        const s = el.getAttribute("data-size");
        state.sizes.has(s) ? state.sizes.delete(s) : state.sizes.add(s);
        refreshPanels();
        render();
      }),
    );
    container.querySelectorAll(".f-rating").forEach((el) =>
      el.addEventListener("change", () => {
        state.rating = Number(el.value);
        render();
      }),
    );
    container.querySelector("#f-custom")?.addEventListener("change", (e) => {
      state.customizable = e.target.checked;
      render();
    });
    container.querySelectorAll(".f-clear").forEach((el) =>
      el.addEventListener("click", (e) => {
        e.preventDefault();
        clearAll();
      }),
    );
  }

  function refreshPanels() {
    const d = document.getElementById("plp-filters");
    const m = document.getElementById("plp-filters-mobile");
    if (d) {
      d.innerHTML = buildFilters();
      wireFilters(d);
    }
    if (m) {
      m.innerHTML = buildFilters();
      wireFilters(m);
    }
  }

  function clearAll() {
    state.price = [0, 10000];
    state.brands.clear();
    state.colors.clear();
    state.sizes.clear();
    state.rating = 0;
    state.customizable = false;
    refreshPanels();
    render();
  }

  // --- active filter chips ---
  function buildChips() {
    const chips = [];
    if (state.customizable) chips.push({ label: "Customisable", clear: () => (state.customizable = false) });
    if (state.rating) chips.push({ label: `${state.rating}★ & above`, clear: () => (state.rating = 0) });
    state.brands.forEach((b) => chips.push({ label: b, clear: () => state.brands.delete(b) }));
    state.colors.forEach((c) => chips.push({ label: c, clear: () => state.colors.delete(c) }));
    state.sizes.forEach((s) => chips.push({ label: `Size ${s}`, clear: () => state.sizes.delete(s) }));
    if (state.price[1] < 10000)
      chips.push({ label: `Under ${money(state.price[1])}`, clear: () => (state.price[1] = 10000) });

    const wrap = document.getElementById("plp-chips");
    if (!wrap) return;
    if (chips.length === 0) {
      wrap.innerHTML = '<span class="text-sm text-muted">Showing all matching products</span>';
      return;
    }
    wrap.innerHTML = chips
      .map(
        (c, i) => `
      <button data-chip="${i}" class="flex items-center gap-1.5 rounded-full border border-border bg-neutral-50 px-3 py-1 text-xs font-medium text-heading transition-colors hover:border-primary">
        ${c.label} <i class="bx bx-x text-sm text-muted"></i>
      </button>`,
      )
      .join("");
    wrap.querySelectorAll("[data-chip]").forEach((btn) =>
      btn.addEventListener("click", () => {
        chips[Number(btn.getAttribute("data-chip"))].clear();
        refreshPanels();
        render();
      }),
    );
  }

  // --- product card ---
  function card(p) {
    const off = discountOf(p);
    return `
      <a href="product.html?id=${p.id}" class="group block overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-soft">
        <div class="relative aspect-[3/4] overflow-hidden bg-neutral-100">
          <img src="${p.image}" alt="${p.name}" loading="lazy" class="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
          ${p.badge ? `<span class="absolute left-2 top-2 rounded-full bg-neutral-950 px-2 py-0.5 text-[10px] font-bold text-white">${p.badge}</span>` : ""}
          ${p.customizable ? '<span class="absolute left-2 bottom-2 flex items-center gap-1 rounded-full bg-sendmystyle-50 px-2 py-0.5 text-[10px] font-bold text-primary"><i class="bx bx-palette"></i> Customise</span>' : ""}
          <button onclick="event.preventDefault();event.stopPropagation();" class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-heading transition-colors hover:text-primary" aria-label="Wishlist"><i class="bx bx-heart text-lg"></i></button>
        </div>
        <div class="p-3">
          <p class="truncate text-xs text-muted">${p.seller}</p>
          <h3 class="mt-0.5 truncate text-sm font-semibold text-heading">${p.name}</h3>
          <div class="mt-1.5 flex items-center gap-2">
            <span class="text-sm font-bold text-heading">${money(p.price)}</span>
            ${off ? `<span class="text-xs text-muted line-through">${money(p.mrp)}</span><span class="text-xs font-semibold text-primary">${off}% off</span>` : ""}
          </div>
          <div class="mt-1.5 inline-flex items-center gap-1 rounded bg-neutral-100 px-1.5 py-0.5 text-[11px] font-semibold text-heading">
            <i class="bx bxs-star text-primary"></i> ${p.rating.toFixed(1)} <span class="font-normal text-muted">(${p.ratingCount})</span>
          </div>
        </div>
      </a>`;
  }

  // --- render results ---
  function render() {
    const list = sortList(filtered());
    const grid = document.getElementById("plp-grid");
    const empty = document.getElementById("plp-empty");
    const count = document.getElementById("plp-count");

    if (count) count.textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;

    if (list.length === 0) {
      grid.innerHTML = "";
      grid.classList.add("hidden");
      empty?.classList.remove("hidden");
    } else {
      grid.classList.remove("hidden");
      empty?.classList.add("hidden");
      grid.innerHTML = list.map(card).join("");
    }
    buildChips();
  }

  // --- sort selects ---
  function buildSorts() {
    const opts = SORTS.map(
      (s) => `<option value="${s.id}" ${state.sort === s.id ? "selected" : ""}>${s.label}</option>`,
    ).join("");
    ["plp-sort", "plp-sort-mobile"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.innerHTML = opts;
      el.addEventListener("change", () => {
        state.sort = el.value;
        render();
      });
    });
  }

  // --- mobile drawer ---
  function initDrawer() {
    const drawer = document.getElementById("plp-filter-drawer");
    if (!drawer) return;
    const open = () => drawer.classList.remove("hidden");
    const close = () => drawer.classList.add("hidden");
    document.getElementById("plp-filter-open")?.addEventListener("click", open);
    document.getElementById("plp-filter-close")?.addEventListener("click", close);
    drawer.querySelector(".plp-drawer-overlay")?.addEventListener("click", close);
    document.getElementById("plp-apply-mobile")?.addEventListener("click", close);
    document.getElementById("plp-clear-mobile")?.addEventListener("click", clearAll);
  }

  // Init
  setHeader();
  buildSorts();
  refreshPanels();
  initDrawer();
  document.getElementById("plp-clear-empty")?.addEventListener("click", clearAll);
  render();
});
