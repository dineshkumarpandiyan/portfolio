// ==============================
// SendMyStyle — Product Detail Page (PDP)
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  if (typeof PRODUCTS === "undefined") return;

  const b = basePath();
  const params = new URLSearchParams(location.search);
  const id = Number(params.get("id"));
  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
  const root = document.getElementById("pdp-root");
  if (!root || !product) return;

  const money = (n) => `₹${n.toLocaleString("en-IN")}`;
  const off = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const hexOf = (name) => (PRODUCT_COLORS.find((c) => c.name === name) || {}).hex || "#ccc";

  let selectedColor = product.colors[0];
  let selectedSize = null;

  // Gallery images (main + alternate shots)
  const gallery = Array.isArray(product.images) && product.images.length ? product.images : [product.image];

  // --- breadcrumb ---
  const catLabel = CATEGORY_MAP[product.category] ? CATEGORY_MAP[product.category].label : product.category;
  const subLabel = SUBCATEGORY_LABELS[product.subcategory] || product.subcategory;
  document.getElementById("pdp-breadcrumb").innerHTML = `
    <a href="${b}/index.html" class="hover:text-primary">Home</a>
    <i class="bx bx-chevron-right align-middle"></i>
    <a href="products.html?category=${product.category}" class="hover:text-primary">${catLabel}</a>
    <i class="bx bx-chevron-right align-middle"></i>
    <a href="products.html?category=${product.category}&sub=${product.subcategory}" class="hover:text-primary">${subLabel}</a>
    <i class="bx bx-chevron-right align-middle"></i>
    <span class="text-heading">${product.name}</span>`;

  // --- action buttons (conditional on product type) ---
  function actionButtons() {
    const rows = [];

    // Primary row
    if (product.customizable) {
      rows.push(`
        <div class="flex flex-col gap-3 sm:flex-row">
          <button data-act="customise" class="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
            <i class="bx bx-palette text-lg"></i> Customise This
          </button>
          <button data-act="cart" class="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-300 text-sm font-semibold text-heading transition-colors hover:border-primary hover:text-primary">
            <i class="bx bx-shopping-bag text-lg"></i> Add to Cart
          </button>
        </div>
        <button data-act="buy" class="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 text-sm font-semibold text-white transition-colors hover:bg-black-soft">
          <i class="bx bx-bolt-circle text-lg"></i> Buy Now
        </button>`);
    } else {
      rows.push(`
        <div class="flex flex-col gap-3 sm:flex-row">
          <button data-act="cart" class="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
            <i class="bx bx-shopping-bag text-lg"></i> Add to Cart
          </button>
          <button data-act="buy" class="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-neutral-950 text-sm font-semibold text-white transition-colors hover:bg-black-soft">
            <i class="bx bx-bolt-circle text-lg"></i> Buy Now
          </button>
        </div>`);
    }

    // Secondary row: wishlist + (virtual try-on)
    const tryon = product.virtualTryOn
      ? `<button data-act="tryon" class="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-border text-sm font-semibold text-heading transition-colors hover:border-primary hover:text-primary">
           <i class="bx bx-camera text-lg text-primary"></i> Virtual Try-On
         </button>`
      : "";
    rows.push(`
      <div class="flex gap-3">
        <button data-act="wishlist" class="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-border text-sm font-semibold text-heading transition-colors hover:border-primary hover:text-primary">
          <i class="bx bx-heart text-lg"></i> Wishlist
        </button>
        ${tryon}
      </div>`);

    return rows.join("");
  }

  // --- render main PDP ---
  function render() {
    root.innerHTML = `
    <div class="grid gap-8 lg:grid-cols-2">
      <!-- Gallery -->
      <div class="flex flex-col-reverse gap-3 sm:flex-row">
        <div class="flex gap-3 sm:flex-col">
          ${gallery
            .map(
              (g, i) => `
            <button class="pdp-thumb h-16 w-14 shrink-0 overflow-hidden rounded-lg border ${i === 0 ? "border-primary" : "border-border"}" data-img="${g}">
              <img src="${g}" alt="thumb" class="h-full w-full object-cover object-top" />
            </button>`,
            )
            .join("")}
        </div>
        <div class="relative aspect-[3/4] flex-1 overflow-hidden rounded-2xl border border-border bg-neutral-100">
          <img id="pdp-main-img" src="${gallery[0]}" alt="${product.name}" class="absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-200" />
          <button data-act="wishlist" class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-heading transition-colors hover:text-primary">
            <i class="bx bx-heart text-xl"></i>
          </button>
          ${product.badge ? `<span class="absolute left-3 top-3 rounded-full bg-neutral-950 px-3 py-1 text-xs font-bold text-white">${product.badge}</span>` : ""}
        </div>
      </div>

      <!-- Info -->
      <div>
        <p class="text-sm font-medium text-muted">${product.seller}</p>
        <h1 class="mt-1 font-display text-2xl font-bold text-heading sm:text-3xl">${product.name}</h1>

        <div class="mt-2 flex items-center gap-3">
          <span class="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 text-sm font-semibold text-heading">
            <i class="bx bxs-star text-primary"></i> ${product.rating.toFixed(1)}
          </span>
          <span class="text-sm text-muted">${product.ratingCount} ratings</span>
          ${product.customizable ? '<span class="inline-flex items-center gap-1 rounded-full bg-sendmystyle-50 px-2.5 py-0.5 text-xs font-bold text-primary"><i class="bx bx-palette"></i> Customisable</span>' : ""}
        </div>

        <div class="mt-4 flex items-end gap-3">
          <span class="text-3xl font-bold text-heading">${money(product.price)}</span>
          ${off ? `<span class="text-lg text-muted line-through">${money(product.mrp)}</span><span class="text-lg font-semibold text-primary">${off}% off</span>` : ""}
        </div>
        <p class="mt-1 text-xs text-muted">Inclusive of all taxes</p>

        <!-- Colours -->
        <div class="mt-6">
          <p class="text-sm font-semibold text-heading">Colour: <span id="pdp-color-label" class="font-normal text-body">${selectedColor}</span></p>
          <div class="mt-2 flex flex-wrap gap-2">
            ${product.colors
              .map(
                (c) => `
              <button class="pdp-color flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${c === selectedColor ? "border-primary" : "border-border"}" data-color="${c}" title="${c}">
                <span class="h-6 w-6 rounded-full ${c === "White" ? "border border-border" : ""}" style="background:${hexOf(c)}"></span>
              </button>`,
              )
              .join("")}
          </div>
        </div>

        <!-- Sizes -->
        <div class="mt-6">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-heading">Select Size</p>
            <button class="text-xs font-semibold text-primary hover:underline">Size Guide</button>
          </div>
          <div class="mt-2 flex flex-wrap gap-2">
            ${product.sizes
              .map(
                (s) =>
                  `<button class="pdp-size h-11 min-w-11 rounded-lg border px-3 text-sm font-semibold text-heading transition-colors border-border hover:border-primary" data-size="${s}">${s}</button>`,
              )
              .join("")}
          </div>
          <p id="pdp-size-err" class="mt-2 hidden text-xs font-medium text-primary">Please select a size.</p>
        </div>

        <!-- Actions -->
        <div class="mt-7 space-y-3">
          ${actionButtons()}
        </div>

        <!-- Delivery -->
        <div class="mt-7 rounded-xl border border-border p-4">
          <p class="text-sm font-semibold text-heading">Delivery Options</p>
          <div class="mt-3 flex gap-2">
            <div class="relative flex-1">
              <i class="bx bx-map absolute left-3 top-1/2 -translate-y-1/2 text-lg text-primary"></i>
              <input id="pdp-pin" maxlength="6" inputmode="numeric" placeholder="Enter pincode" class="h-11 w-full rounded-lg border border-border bg-neutral-50 pl-10 pr-3 text-sm text-heading placeholder:text-muted focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <button id="pdp-pin-check" class="h-11 rounded-lg border border-neutral-300 px-4 text-sm font-semibold text-heading hover:border-primary hover:text-primary">Check</button>
          </div>
          <p id="pdp-pin-msg" class="mt-2 hidden text-xs font-medium"></p>
          <ul class="mt-3 space-y-1.5 text-xs text-body">
            <li class="flex items-center gap-2"><i class="bx bx-truck text-base text-primary"></i> Free delivery on orders above ₹999</li>
            <li class="flex items-center gap-2"><i class="bx bx-revision text-base text-primary"></i> 7-day easy returns</li>
            <li class="flex items-center gap-2"><i class="bx bx-check-shield text-base text-primary"></i> 100% secure payments</li>
          </ul>
        </div>

        <!-- Details accordion -->
        <div class="mt-7 divide-y divide-border border-y border-border">
          ${accordion("Product Details", `<p class="text-sm leading-relaxed text-body">${product.description}</p>`)}
          ${accordion("Fabric & Care", `<ul class="space-y-1 text-sm text-body"><li>Premium quality fabric</li><li>Machine / hand wash as per label</li><li>Do not bleach</li></ul>`)}
          ${accordion("Seller & Returns", `<p class="text-sm text-body">Sold by <span class="font-semibold text-heading">${product.seller}</span>. 7-day return policy applies.</p>`)}
        </div>
      </div>
    </div>`;

    wire();
  }

  function accordion(title, body) {
    return `
      <div class="pdp-acc">
        <button class="pdp-acc-trigger flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-heading">
          ${title} <i class="bx bx-chevron-down pdp-acc-icon text-xl text-muted transition-transform"></i>
        </button>
        <div class="pdp-acc-body grid grid-rows-[0fr] transition-all duration-300">
          <div class="overflow-hidden"><div class="pb-4">${body}</div></div>
        </div>
      </div>`;
  }

  // --- interactions ---
  function wire() {
    // thumbnails — switch main image on click or hover
    const setMain = (t) => {
      document.getElementById("pdp-main-img").src = t.getAttribute("data-img");
      root.querySelectorAll(".pdp-thumb").forEach((x) => x.classList.replace("border-primary", "border-border"));
      t.classList.replace("border-border", "border-primary");
    };
    root.querySelectorAll(".pdp-thumb").forEach((t) => {
      t.addEventListener("click", () => setMain(t));
      t.addEventListener("mouseenter", () => setMain(t));
    });

    // colours
    root.querySelectorAll(".pdp-color").forEach((c) =>
      c.addEventListener("click", () => {
        selectedColor = c.getAttribute("data-color");
        root.querySelectorAll(".pdp-color").forEach((x) => x.classList.replace("border-primary", "border-border"));
        c.classList.replace("border-border", "border-primary");
        const lbl = document.getElementById("pdp-color-label");
        if (lbl) lbl.textContent = selectedColor;
      }),
    );

    // sizes
    root.querySelectorAll(".pdp-size").forEach((s) =>
      s.addEventListener("click", () => {
        selectedSize = s.getAttribute("data-size");
        root.querySelectorAll(".pdp-size").forEach((x) => {
          x.classList.remove("border-primary", "bg-sendmystyle-50", "text-primary");
          x.classList.add("border-border");
        });
        s.classList.remove("border-border");
        s.classList.add("border-primary", "bg-sendmystyle-50", "text-primary");
        document.getElementById("pdp-size-err")?.classList.add("hidden");
      }),
    );

    // accordions
    root.querySelectorAll(".pdp-acc-trigger").forEach((btn) =>
      btn.addEventListener("click", () => {
        const body = btn.nextElementSibling;
        const icon = btn.querySelector(".pdp-acc-icon");
        const open = body.classList.contains("grid-rows-[1fr]");
        body.classList.toggle("grid-rows-[0fr]", open);
        body.classList.toggle("grid-rows-[1fr]", !open);
        icon.classList.toggle("rotate-180", !open);
      }),
    );

    // action buttons
    root
      .querySelectorAll("[data-act]")
      .forEach((btn) => btn.addEventListener("click", () => handleAction(btn.getAttribute("data-act"))));

    // pincode check
    document.getElementById("pdp-pin-check")?.addEventListener("click", () => {
      const pin = (document.getElementById("pdp-pin").value || "").trim();
      const msg = document.getElementById("pdp-pin-msg");
      if (!msg) return;
      msg.classList.remove("hidden");
      if (/^\d{6}$/.test(pin)) {
        msg.textContent = "Delivery by 3–5 business days.";
        msg.className = "mt-2 text-xs font-medium text-primary";
      } else {
        msg.textContent = "Please enter a valid 6-digit pincode.";
        msg.className = "mt-2 text-xs font-medium text-primary";
      }
    });
  }

  function requireSize() {
    if (product.sizes.length && !selectedSize) {
      document.getElementById("pdp-size-err")?.classList.remove("hidden");
      return false;
    }
    return true;
  }

  function cartItem() {
    return {
      productId: product.id,
      name: product.name,
      image: product.image,
      seller: product.seller,
      price: product.price,
      totalPrice: product.price,
      color: selectedColor,
      size: selectedSize,
      qty: 1,
    };
  }

  function handleAction(act) {
    switch (act) {
      case "wishlist": {
        const added = Store.toggleWishlist({
          productId: product.id,
          name: product.name,
          image: product.image,
          seller: product.seller,
          price: product.price,
        });
        toast(added ? "Added to your wishlist" : "Removed from wishlist");
        break;
      }
      case "cart":
        if (!requireSize()) return;
        Store.addToCart(cartItem());
        toast("Added to cart");
        break;
      case "buy":
        if (!requireSize()) return;
        Store.addToCart(cartItem());
        window.location.href = "checkout.html";
        break;
      case "customise":
        window.location.href = `customize.html?id=${product.id}`;
        break;
      case "tryon":
        openTryOn();
        break;
    }
  }

  // toast
  let toastTimer = null;
  function toast(text) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = text;
    el.classList.remove("hidden");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add("hidden"), 2200);
  }

  // try-on modal
  function openTryOn() {
    const modal = document.getElementById("tryon-modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    modal
      .querySelector(".tryon-overlay")
      ?.addEventListener("click", () => modal.classList.add("hidden"), { once: true });
    modal.querySelector(".tryon-close")?.addEventListener("click", () => modal.classList.add("hidden"), { once: true });
  }

  // --- similar products ---
  function renderSimilar() {
    const el = document.getElementById("pdp-similar");
    if (!el) return;
    const similar = PRODUCTS.filter(
      (p) => p.id !== product.id && (p.subcategory === product.subcategory || p.category === product.category),
    ).slice(0, 5);
    el.innerHTML = similar
      .map((p) => {
        const d = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
        return `
        <a href="product.html?id=${p.id}" class="group overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-soft">
          <div class="relative aspect-[3/4] overflow-hidden bg-neutral-100">
            <img src="${p.image}" alt="${p.name}" loading="lazy" class="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
            ${p.customizable ? '<span class="absolute left-2 bottom-2 rounded-full bg-sendmystyle-50 px-2 py-0.5 text-[10px] font-bold text-primary">Customise</span>' : ""}
          </div>
          <div class="p-3">
            <p class="truncate text-xs text-muted">${p.seller}</p>
            <h3 class="mt-0.5 truncate text-sm font-semibold text-heading">${p.name}</h3>
            <div class="mt-1 flex items-center gap-2">
              <span class="text-sm font-bold text-heading">${money(p.price)}</span>
              ${d ? `<span class="text-xs font-semibold text-primary">${d}% off</span>` : ""}
            </div>
          </div>
        </a>`;
      })
      .join("");
  }

  document.title = `${product.name} — SendMyStyle`;
  render();
  renderSimilar();
});
