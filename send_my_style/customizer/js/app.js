// ==============================================================
// App — generic orchestration & UI
// Renders variants + customization from product data. Every group
// is rendered by its displayType (image | color | card | text |
// upload). No product-specific conditionals.
// ==============================================================

(() => {
  let product;
  const state = CustomizationEngine.state;
  let els = {};

  document.addEventListener("DOMContentLoaded", () => {
    // Resolve product from ?id= / ?slug= ; default to first in catalog.
    const params = new URLSearchParams(location.search);
    const key = params.get("id") || params.get("slug");
    product = getCatalogProduct(key);

    CustomizationEngine.init(product);

    els = {
      canvas: document.getElementById("preview-canvas"),
      picker: document.getElementById("product-picker"),
      seller: document.getElementById("p-category"),
      name: document.getElementById("p-name"),
      desc: document.getElementById("p-desc"),
      basePrice: document.getElementById("p-base-price"),
      variants: document.getElementById("variants"),
      customization: document.getElementById("customization"),
      summary: document.getElementById("summary"),
      total: document.getElementById("total-price"),
      totalSticky: document.getElementById("total-price-sticky"),
      addCart: document.querySelectorAll("[data-add-cart]"),
      reset: document.querySelectorAll("[data-reset]"),
      toast: document.getElementById("toast"),
    };

    PreviewEngine.init(els.canvas, () => product, () => state);
    UploadHandler.init({ canvasEl: els.canvas, onChangeCb: refresh });

    renderPicker();
    renderHeader();
    renderVariants();
    renderCustomization();

    els.reset.forEach((b) => b.addEventListener("click", onReset));
    els.addCart.forEach((b) => b.addEventListener("click", onAddToCart));

    refresh();
  });

  // ---------- Product switcher ----------
  function renderPicker() {
    if (!els.picker) return;
    els.picker.innerHTML = products
      .map((p) => `<option value="${p.id}" ${p.id === product.id ? "selected" : ""}>${p.name}</option>`)
      .join("");
    els.picker.addEventListener("change", () => {
      location.search = "?id=" + encodeURIComponent(els.picker.value);
    });
  }

  function renderHeader() {
    els.seller.textContent = product.category;
    els.name.textContent = product.name;
    els.desc.textContent = product.description;
    els.basePrice.textContent = formatINR(product.basePrice);
    document.title = `Customize — ${product.name} | SendMyStyle`;
  }

  // ---------- Variants ----------
  function renderVariants() {
    els.variants.innerHTML = "";
    product.variants.forEach((group) => {
      const selectedId = state.variants[group.id];
      const selectedName = group.options.find((o) => o.id === selectedId)?.name || "";
      const wrap = document.createElement("div");
      wrap.className = "mt-5 first:mt-0";
      wrap.innerHTML =
        `<div class="mb-2 flex items-center justify-between">
           <p class="text-sm font-semibold text-heading">${group.name}</p>
           <span class="text-xs text-body">${selectedName}</span>
         </div>`;
      wrap.appendChild(group.type === "color" ? colorRow(group, "variant") : chipRow(group, "variant"));
      els.variants.appendChild(wrap);
    });
  }

  // ---------- Customization (by displayType) ----------
  function renderCustomization() {
    els.customization.innerHTML = "";
    product.customization.groups.forEach((group) => {
      const wrap = document.createElement("div");
      wrap.className = "mt-6 first:mt-0 border-t border-border pt-5 first:border-0 first:pt-0";
      wrap.innerHTML =
        `<p class="text-sm font-semibold text-heading">${group.name}${group.required ? "" : ' <span class="text-xs font-normal text-body">(optional)</span>'}</p>
         ${group.description ? `<p class="text-xs text-body">${group.description}</p>` : ""}`;

      let body;
      switch (group.displayType) {
        case "color": body = colorRow(group, "custom", true); break;
        case "card":  body = cardGrid(group); break;
        case "text":  body = textControl(group); break;
        case "upload": body = uploadControl(group); break;
        case "image":
        default:      body = imageGrid(group); break;
      }
      wrap.appendChild(body);
      els.customization.appendChild(wrap);
    });
  }

  // ----- Renderers per type -----

  function chipRow(group, scope) {
    const selectedId = scope === "variant" ? state.variants[group.id] : state.customization[group.id];
    const row = document.createElement("div");
    row.className = "mt-2 flex flex-wrap gap-2";
    row.setAttribute("role", "radiogroup");
    row.setAttribute("aria-label", group.name);
    group.options.forEach((opt) => {
      const active = selectedId === opt.id;
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", active ? "true" : "false");
      b.setAttribute("aria-label", `${group.name}: ${opt.name}${opt.price ? ", +" + formatINR(opt.price) : ""}`);
      b.className = "min-w-[3rem] rounded-lg border px-3 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
        (active ? "border-primary bg-primary text-white" : "border-border bg-surface text-heading hover:border-primary");
      b.textContent = opt.name + (opt.price ? ` +${formatINR(opt.price)}` : "");
      b.addEventListener("click", () => select(scope, group.id, opt.id));
      row.appendChild(b);
    });
    return row;
  }

  function colorRow(group, scope, spaced) {
    const selectedId = scope === "variant" ? state.variants[group.id] : state.customization[group.id];
    const row = document.createElement("div");
    row.className = (spaced ? "mt-3 " : "mt-2 ") + "flex flex-wrap gap-2.5";
    row.setAttribute("role", "radiogroup");
    row.setAttribute("aria-label", group.name);
    group.options.forEach((opt) => {
      const active = selectedId === opt.id;
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", active ? "true" : "false");
      b.setAttribute("aria-label", `${opt.name}${opt.price ? ", +" + formatINR(opt.price) : ""}`);
      b.title = opt.name + (opt.price ? ` (+${formatINR(opt.price)})` : "");
      b.className = "relative h-9 w-9 rounded-full border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
        (active ? "border-primary ring-2 ring-sendmystyle-200" : "border-border");
      b.style.background = opt.value || "#eee";
      if (active) b.innerHTML = `<i class="bx bx-check absolute inset-0 flex items-center justify-center text-lg" style="color:${contrast(opt.value || '#eee')}"></i>`;
      b.addEventListener("click", () => select(scope, group.id, opt.id));
      row.appendChild(b);
    });
    return row;
  }

  function imageGrid(group) {
    const selectedId = state.customization[group.id];
    const grid = document.createElement("div");
    grid.className = "mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3";
    grid.setAttribute("role", "radiogroup");
    grid.setAttribute("aria-label", group.name);
    group.options.forEach((opt) => {
      const active = selectedId === opt.id;
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", active ? "true" : "false");
      b.setAttribute("aria-label", `${group.name}: ${opt.name}, ${opt.price ? "+" + formatINR(opt.price) : "included"}`);
      b.className = "group flex flex-col rounded-xl border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
        (active ? "border-primary bg-sendmystyle-50 ring-1 ring-primary" : "border-border bg-surface hover:border-primary");
      const preview = opt.value
        ? `<span class="mb-2 h-16 rounded-lg border border-border" style="background:${opt.value}"></span>`
        : `<span class="mb-2 flex h-16 items-center justify-center rounded-lg bg-sendmystyle-50 text-primary"><i class="bx ${iconFor(group.id)} text-2xl"></i></span>`;
      b.innerHTML = preview +
        `<span class="flex items-center gap-1.5 text-sm font-semibold text-heading">${opt.name}${active ? ' <i class="bx bx-check-circle text-primary"></i>' : ""}</span>` +
        (opt.description ? `<span class="mt-0.5 text-xs text-body">${opt.description}</span>` : "") +
        `<span class="mt-1 text-xs font-semibold text-primary">${opt.price ? "+" + formatINR(opt.price) : "Included"}</span>`;
      b.addEventListener("click", () => select("custom", group.id, opt.id));
      grid.appendChild(b);
    });
    return grid;
  }

  function cardGrid(group) {
    const selectedId = state.customization[group.id];
    const grid = document.createElement("div");
    grid.className = "mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2";
    grid.setAttribute("role", "radiogroup");
    grid.setAttribute("aria-label", group.name);
    group.options.forEach((opt) => {
      const active = selectedId === opt.id;
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", active ? "true" : "false");
      b.setAttribute("aria-label", `${group.name}: ${opt.name}, ${opt.price ? "+" + formatINR(opt.price) : "included"}`);
      b.className = "flex items-start justify-between gap-2 rounded-xl border p-3.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
        (active ? "border-primary bg-sendmystyle-50 ring-1 ring-primary" : "border-border bg-surface hover:border-primary");
      b.innerHTML =
        `<span>
           <span class="flex items-center gap-1.5 text-sm font-semibold text-heading">${opt.name}${active ? ' <i class="bx bx-check-circle text-primary"></i>' : ""}</span>
           ${opt.description ? `<span class="mt-0.5 block text-xs text-body">${opt.description}</span>` : ""}
         </span>
         <span class="shrink-0 text-xs font-semibold text-primary">${opt.price ? "+" + formatINR(opt.price) : "Included"}</span>`;
      b.addEventListener("click", () => select("custom", group.id, opt.id));
      grid.appendChild(b);
    });
    return grid;
  }

  function textControl(group) {
    const cfg = group.config || {};
    const meta = state.textMeta[group.id] || {};
    const wrap = document.createElement("div");
    wrap.className = "mt-3";
    const fonts = (cfg.fontOptions || [cfg.defaultFont || "sans-serif"])
      .map((f) => `<option value="${f}" ${f === meta.font ? "selected" : ""}>${f === "serif" ? "Serif" : "Sans"}</option>`).join("");
    wrap.innerHTML = `
      <div class="flex flex-wrap items-center gap-2">
        <input type="text" maxlength="${cfg.maxLength || 20}" placeholder="${cfg.placeholder || "Enter text"}" value="${state.text[group.id] || ""}"
          class="w-40 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading outline-none focus:border-primary focus:ring-2 focus:ring-sendmystyle-100"
          aria-label="${group.name} text" data-text-input />
        <select class="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-heading outline-none focus:border-primary" aria-label="${group.name} font" data-text-font>${fonts}</select>
        <input type="color" value="${meta.color || "#111111"}" class="h-9 w-9 cursor-pointer rounded-lg border border-border bg-surface" aria-label="${group.name} colour" data-text-color />
      </div>
      <p class="mt-1 text-[11px] text-body">Max ${cfg.maxLength || 20} characters${cfg.price ? " · +" + formatINR(cfg.price) + " when added" : ""}</p>`;

    const input = wrap.querySelector("[data-text-input]");
    const font = wrap.querySelector("[data-text-font]");
    const color = wrap.querySelector("[data-text-color]");
    input.addEventListener("input", () => { CustomizationEngine.setText(group.id, input.value); refresh(); });
    font.addEventListener("change", () => { CustomizationEngine.setTextMeta(group.id, { font: font.value }); refresh(); });
    color.addEventListener("input", () => { CustomizationEngine.setTextMeta(group.id, { color: color.value }); refresh(); });
    return wrap;
  }

  function uploadControl(group) {
    const cfg = group.config || {};
    const wrap = document.createElement("div");
    wrap.className = "mt-3";
    const has = !!state.uploads[group.id];
    const t = state.transform[group.id] || { scale: 1, rotation: 0 };
    wrap.innerHTML = `
      <label class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-sendmystyle-50 focus-within:ring-2 focus-within:ring-primary">
        <i class="bx bx-upload"></i> ${has ? "Replace image" : "Choose image"}
        <input type="file" accept="${(cfg.acceptedTypes || []).join(",")}" class="sr-only" aria-label="${group.name}" data-upload-input />
      </label>
      ${cfg.price ? `<span class="ml-2 text-xs font-semibold text-primary">+${formatINR(cfg.price)}</span>` : ""}
      <p class="mt-2 hidden text-xs font-medium text-primary" role="alert" data-upload-error></p>
      <div class="mt-3 ${has ? "" : "hidden"} space-y-3" data-upload-controls>
        <p class="text-[11px] text-body">Drag on the preview to position.</p>
        <div>
          <label class="mb-1 block text-xs font-medium text-heading">Size</label>
          <input type="range" min="0.3" max="2.5" step="0.05" value="${t.scale}" class="w-full accent-primary" aria-label="Resize" data-upload-scale />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium text-heading">Rotate</label>
          <input type="range" min="0" max="360" step="1" value="${t.rotation}" class="w-full accent-primary" aria-label="Rotate" data-upload-rotate />
        </div>
        <button type="button" class="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-heading transition hover:border-primary hover:text-primary" data-upload-remove>
          <i class="bx bx-trash"></i> Remove design
        </button>
      </div>`;

    const input = wrap.querySelector("[data-upload-input]");
    const err = wrap.querySelector("[data-upload-error]");
    const controls = wrap.querySelector("[data-upload-controls]");
    const scale = wrap.querySelector("[data-upload-scale]");
    const rotate = wrap.querySelector("[data-upload-rotate]");
    const removeBtn = wrap.querySelector("[data-upload-remove]");

    input.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      err.classList.add("hidden");
      try { await UploadHandler.handleFile(group, file); controls.classList.remove("hidden"); }
      catch (msg) { err.textContent = msg; err.classList.remove("hidden"); }
    });
    scale.addEventListener("input", () => UploadHandler.setScale(group, parseFloat(scale.value)));
    rotate.addEventListener("input", () => UploadHandler.setRotation(group, parseInt(rotate.value, 10)));
    removeBtn.addEventListener("click", () => { UploadHandler.remove(group); controls.classList.add("hidden"); input.value = ""; });
    // Make this the active drag target when interacted
    wrap.addEventListener("pointerenter", () => UploadHandler.setActive(group.id));
    return wrap;
  }

  // ---------- Selection dispatch ----------
  function select(scope, groupId, optionId) {
    if (scope === "variant") CustomizationEngine.selectVariant(groupId, optionId);
    else CustomizationEngine.selectCustomization(groupId, optionId);
    refresh();
    renderVariants();
    renderCustomization();
  }

  // ---------- Summary + sync ----------
  function renderSummary(pricing) {
    els.summary.innerHTML = pricing.lines
      .map((l) =>
        `<div class="flex items-center justify-between py-1 text-sm">
           <span class="text-body">${l.groupName}</span>
           <span class="font-medium text-heading">${l.label}${l.price > 0 ? ` <span class="text-primary">+${formatINR(l.price)}</span>` : ""}</span>
         </div>`)
      .join("");
  }

  function refresh() {
    PreviewEngine.render();
    const pricing = calculateTotalPrice(product, state);
    renderSummary(pricing);
    els.total.textContent = formatINR(pricing.total);
    if (els.totalSticky) els.totalSticky.textContent = formatINR(pricing.total);
  }

  function onReset() {
    CustomizationEngine.resetCustomization();
    renderVariants();
    renderCustomization();
    refresh();
    showToast("Customization reset");
  }

  function onAddToCart() {
    const item = CustomizationEngine.buildCartItem();
    try {
      const cart = JSON.parse(localStorage.getItem("sms_cart")) || [];
      cart.push(item);
      localStorage.setItem("sms_cart", JSON.stringify(cart));
    } catch (_) {}
    showToast("Added to bag — customization saved");
    console.log("Cart item:", item); // API hook: POST to NestJS cart endpoint later
  }

  // ---------- Helpers ----------
  function iconFor(groupId) {
    return {
      neck: "bx-collection", neckline: "bx-collection", collar: "bx-collection",
      sleeve: "bx-move-horizontal", cuff: "bx-been-here",
      print: "bx-image", pattern: "bx-grid-alt", embroidery: "bx-crown",
      laces: "bx-git-commit", sole: "bx-shape-square", accent: "bx-palette",
      wash: "bx-water", distressing: "bx-cut", stitching: "bx-git-branch",
      strap: "bx-link", hardware: "bx-cog", patch: "bx-badge",
      material: "bx-diamond", pendant: "bx-heart", buttons: "bx-radio-circle-marked",
    }[groupId] || "bx-customize";
  }

  function contrast(hex) {
    const c = (hex || "#eeeeee").replace("#", "");
    const r = parseInt(c.substr(0, 2), 16), g = parseInt(c.substr(2, 2), 16), b = parseInt(c.substr(4, 2), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6 ? "#481F29" : "#FFFFFF";
  }

  let toastTimer;
  function showToast(msg) {
    if (!els.toast) return;
    els.toast.textContent = msg;
    els.toast.classList.remove("translate-y-20", "opacity-0");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.add("translate-y-20", "opacity-0"), 2600);
  }
})();
