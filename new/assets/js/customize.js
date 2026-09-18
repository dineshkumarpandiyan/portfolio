// ==============================================================
// SendMyStyle — Design Studio orchestration
// Product-wise, data-driven. Canvas live preview + full flow
// (Virtual Try-On, Save Design, Add to Cart, Buy Now).
// ==============================================================

document.addEventListener("DOMContentLoaded", () => {
  if (typeof PRODUCTS === "undefined") return;

  const b = basePath();
  const id = Number(new URLSearchParams(location.search).get("id"));
  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS.find((p) => p.customizable) || PRODUCTS[0];
  if (!product) return;

  const groups = customisationGroupsFor(product);
  const money = (n) => `₹${n.toLocaleString("en-IN")}`;
  const hexOf = (name) => (PRODUCT_COLORS.find((c) => c.name === name) || {}).hex || "#ccc";
  const UPLOAD_PRICE = 250;

  // Which product families support uploaded artwork / try-on
  const canUpload = ["t-shirts", "custom-tshirts", "tops", "bags", "handbags", "shirts", "custom-shirts"].includes(
    product.subcategory,
  );

  // ---- state ----
  const state = {
    productId: product.id,
    selections: {},
    monogram: {},
  };
  groups.forEach((g) => {
    if (g.type === "card" || g.type === "color") state.selections[g.id] = g.options[0].value;
  });

  // ---- header ----
  document.title = `Customise ${product.name} — SendMyStyle`;
  document.getElementById("cz-title").textContent = `Customise: ${product.name}`;
  document.getElementById("cz-breadcrumb").innerHTML = `
    <a href="${b}/index.html" class="hover:text-primary">Home</a>
    <i class="bx bx-chevron-right align-middle"></i>
    <a href="product.html?id=${product.id}" class="hover:text-primary">${product.name}</a>
    <i class="bx bx-chevron-right align-middle"></i>
    <span class="text-heading">Design Studio</span>`;

  // ---- canvas preview ----
  const canvas = document.getElementById("cz-canvas");
  PreviewEngine.init(canvas);

  function currentColor() {
    const cg = groups.find((g) => g.type === "color");
    return cg ? state.selections[cg.id] : "White";
  }
  function currentMonogram() {
    return Object.values(state.monogram).find((v) => v) || "";
  }
  function draw() {
    PreviewEngine.render({
      sub: product.subcategory,
      color: currentColor(),
      selections: state.selections,
      monogram: currentMonogram(),
      art: UploadHandler.has() ? UploadHandler.get() : null,
    });
  }
  UploadHandler.setOnChange(draw);

  // ---- render option groups ----
  const groupsRoot = document.getElementById("cz-groups");
  const addBtn = document.getElementById("cz-add");
  const buyBtn = document.getElementById("cz-buy");

  if (groups.length === 0) {
    groupsRoot.innerHTML = `
      <div class="rounded-2xl border border-border bg-surface p-8 text-center">
        <i class="bx bx-info-circle text-4xl text-muted"></i>
        <p class="mt-3 text-sm font-semibold text-heading">Customisation isn't available for this product yet.</p>
        <a href="product.html?id=${product.id}" class="mt-4 inline-block rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover">Back to product</a>
      </div>`;
    addBtn.disabled = true;
    buyBtn.disabled = true;
  } else {
    groupsRoot.innerHTML = groups.map(renderGroup).join("");
    wireOptions();
  }

  function renderGroup(g) {
    let body = "";
    if (g.type === "card") {
      body = `<div class="grid grid-cols-2 gap-2 sm:grid-cols-3" role="radiogroup" aria-label="${g.label}">
        ${g.options
          .map(
            (o) => `
          <button class="cz-opt rounded-lg border p-3 text-left transition-colors ${o.value === state.selections[g.id] ? "border-primary bg-sendmystyle-50" : "border-border hover:border-primary"}"
                  data-group="${g.id}" data-value="${o.value}" role="radio" aria-checked="${o.value === state.selections[g.id]}">
            <span class="flex items-center justify-between">
              <span class="text-sm font-semibold text-heading">${o.label}</span>
              <i class="bx bx-check cz-check text-lg text-primary ${o.value === state.selections[g.id] ? "" : "hidden"}"></i>
            </span>
            ${o.note ? `<span class="mt-0.5 block text-xs text-muted">${o.note}</span>` : ""}
            <span class="mt-1 block text-xs font-medium ${o.price ? "text-primary" : "text-muted"}">${o.price ? "+" + money(o.price) : "Included"}</span>
          </button>`,
          )
          .join("")}
      </div>`;
    } else if (g.type === "color") {
      body = `<div class="flex flex-wrap gap-3" role="radiogroup" aria-label="${g.label}">
        ${g.options
          .map(
            (o) => `
          <button class="cz-opt flex flex-col items-center gap-1.5" data-group="${g.id}" data-value="${o.value}" role="radio" aria-checked="${o.value === state.selections[g.id]}" title="${o.value}">
            <span class="cz-ring flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${o.value === state.selections[g.id] ? "border-primary" : "border-border"}">
              <span class="h-7 w-7 rounded-full ${o.value === "White" ? "border border-border" : ""}" style="background:${hexOf(o.value)}"></span>
            </span>
            <span class="text-[11px] text-body">${o.value}${o.price ? " +" + money(o.price) : ""}</span>
          </button>`,
          )
          .join("")}
      </div>`;
    } else if (g.type === "text") {
      body = `
        <input type="text" maxlength="${g.maxLength || 10}" placeholder="Enter text (e.g. initials)"
               class="cz-text h-11 w-full rounded-lg border border-border bg-white px-4 text-sm uppercase tracking-wider text-heading placeholder:normal-case placeholder:tracking-normal placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
               data-group="${g.id}" />
        <p class="mt-1.5 text-xs text-muted">Add a personal ${g.label.toLowerCase()} (+${money(g.price)})</p>`;
    }
    return `
      <div class="rounded-2xl border border-border bg-surface p-5">
        <h3 class="mb-3 text-sm font-bold text-heading">${g.label}</h3>
        ${body}
      </div>`;
  }

  function wireOptions() {
    groupsRoot.querySelectorAll(".cz-opt").forEach((btn) =>
      btn.addEventListener("click", () => {
        const gid = btn.getAttribute("data-group");
        const val = btn.getAttribute("data-value");
        state.selections[gid] = val;
        groupsRoot.querySelectorAll(`.cz-opt[data-group="${gid}"]`).forEach((el) => {
          const active = el.getAttribute("data-value") === val;
          el.setAttribute("aria-checked", active);
          el.classList.toggle("border-primary", active && !el.querySelector(".cz-ring"));
          el.classList.toggle("bg-sendmystyle-50", active && !!el.querySelector(".cz-check"));
          if (!active && !el.querySelector(".cz-ring")) el.classList.add("border-border");
          const check = el.querySelector(".cz-check");
          if (check) check.classList.toggle("hidden", !active);
          const ring = el.querySelector(".cz-ring");
          if (ring) {
            ring.classList.toggle("border-primary", active);
            ring.classList.toggle("border-border", !active);
          }
        });
        draw();
        updatePrice();
        updateSummary();
      }),
    );

    groupsRoot.querySelectorAll(".cz-text").forEach((inp) =>
      inp.addEventListener("input", () => {
        state.monogram[inp.getAttribute("data-group")] = inp.value.trim();
        draw();
        updatePrice();
      }),
    );
  }

  // ---- upload (only for supported products) ----
  let uploaded = false;
  if (canUpload) {
    document.getElementById("cz-upload-group").classList.remove("hidden");
    const controls = document.getElementById("cz-upload-controls");
    document.getElementById("cz-upload-input").addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      UploadHandler.loadFile(file);
      uploaded = true;
      controls.classList.remove("hidden");
      updatePrice();
    });
    document.getElementById("cz-art-remove").addEventListener("click", () => {
      UploadHandler.clear();
      uploaded = false;
      controls.classList.add("hidden");
      updatePrice();
    });
    document.getElementById("cz-art-scale").addEventListener("input", (e) => UploadHandler.setScale(e.target.value));
    document
      .getElementById("cz-art-rotate")
      .addEventListener("input", (e) => UploadHandler.setRotation(e.target.value));

    // drag artwork on canvas
    let dragging = false;
    const toCanvas = (evt) => {
      const r = canvas.getBoundingClientRect();
      const cx = (evt.touches ? evt.touches[0].clientX : evt.clientX) - r.left;
      const cy = (evt.touches ? evt.touches[0].clientY : evt.clientY) - r.top;
      return { x: (cx / r.width) * canvas.width, y: (cy / r.height) * canvas.height };
    };
    const start = () => {
      if (UploadHandler.has()) dragging = true;
    };
    const moveArt = (e) => {
      if (!dragging) return;
      const p = toCanvas(e);
      UploadHandler.move(p.x, p.y);
      e.preventDefault();
    };
    const end = () => (dragging = false);
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", moveArt);
    window.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: true });
    canvas.addEventListener("touchmove", moveArt, { passive: false });
    canvas.addEventListener("touchend", end);
  }

  // ---- price ----
  function priceBreakdown() {
    let add = 0;
    groups.forEach((g) => {
      if (g.type === "card" || g.type === "color") {
        const opt = g.options.find((o) => o.value === state.selections[g.id]);
        if (opt && opt.price) add += opt.price;
      } else if (g.type === "text" && state.monogram[g.id]) {
        add += g.price;
      }
    });
    if (uploaded) add += UPLOAD_PRICE;
    return { base: product.price, add, total: product.price + add };
  }
  function updatePrice() {
    const { base, add, total } = priceBreakdown();
    document.getElementById("cz-price").textContent = money(total);
    document.getElementById("cz-price-break").textContent = add
      ? `${money(base)} base + ${money(add)} customisation`
      : "Base price";
  }

  // ---- summary chips ----
  function updateSummary() {
    const summary = document.getElementById("cz-summary");
    if (!summary) return;
    summary.innerHTML = groups
      .filter((g) => g.type === "card")
      .map((g) => {
        const opt = g.options.find((o) => o.value === state.selections[g.id]);
        return opt
          ? `<span class="rounded-full border border-border bg-white px-3 py-1 text-xs text-body">${g.label}: <span class="font-semibold text-heading">${opt.label}</span></span>`
          : "";
      })
      .join("");
  }

  // ---- build a cart/design item ----
  function buildItem() {
    const { base, add, total } = priceBreakdown();
    return {
      productId: product.id,
      name: product.name,
      image: product.image,
      seller: product.seller,
      customisation: { ...state.selections },
      monogram: { ...state.monogram },
      hasArtwork: uploaded,
      basePrice: base,
      customisationPrice: add,
      totalPrice: total,
      qty: 1,
      addedAt: Date.now(),
    };
  }
  // ---- actions (via shared Store) ----
  addBtn?.addEventListener("click", () => {
    Store.addToCart(buildItem());
    toast("Custom design added to cart");
  });
  buyBtn?.addEventListener("click", () => {
    Store.addToCart(buildItem());
    window.location.href = "checkout.html";
  });
  document.getElementById("cz-save")?.addEventListener("click", () => {
    Store.saveDesign(buildItem());
    toast("Saved to My Designs");
  });
  document.getElementById("cz-reset")?.addEventListener("click", () => location.reload());

  // Try-On (only for wearables)
  const tryonBtn = document.getElementById("cz-tryon");
  if (product.virtualTryOn && tryonBtn) {
    tryonBtn.classList.remove("hidden");
    tryonBtn.classList.add("flex");
    tryonBtn.addEventListener("click", () => {
      const modal = document.getElementById("tryon-modal");
      modal?.classList.remove("hidden");
      modal
        ?.querySelector(".tryon-overlay")
        ?.addEventListener("click", () => modal.classList.add("hidden"), { once: true });
      modal
        ?.querySelector(".tryon-close")
        ?.addEventListener("click", () => modal.classList.add("hidden"), { once: true });
    });
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

  // initial paint
  draw();
  updatePrice();
  updateSummary();
});
