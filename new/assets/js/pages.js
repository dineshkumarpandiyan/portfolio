// ==============================================================
// SendMyStyle — Cart / Wishlist / Checkout / Orders / Tracking
// Each block runs only if its root element exists on the page.
// ==============================================================

document.addEventListener("DOMContentLoaded", () => {
  const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
  const b = typeof basePath === "function" ? basePath() : ".";

  // Shipping / totals helper
  function totals() {
    const sub = Store.cartTotal();
    const shipping = sub > 999 || sub === 0 ? 0 : 79;
    return { sub, shipping, total: sub + shipping };
  }

  function customLine(item) {
    const bits = [];
    if (item.customisation) Object.values(item.customisation).forEach((v) => v && bits.push(v));
    if (item.monogram) Object.values(item.monogram).forEach((v) => v && bits.push(`“${v}”`));
    if (item.size) bits.unshift(`Size ${item.size}`);
    return bits.length ? bits.join(" · ") : "";
  }

  // ---------------------------------------------------------------
  // CART
  // ---------------------------------------------------------------
  const cartBody = document.getElementById("cart-body");
  if (cartBody) {
    const renderCart = () => {
      const cart = Store.getCart();
      const label = document.getElementById("cart-count-label");
      if (label) label.textContent = `${cart.length} item${cart.length === 1 ? "" : "s"} in your cart`;

      if (cart.length === 0) {
        cartBody.className = "mt-6";
        cartBody.innerHTML = emptyState(
          "bx-cart",
          "Your cart is empty",
          "Add products or custom designs to get started.",
          `${b}/pages/products.html`,
          "Start Shopping",
        );
        return;
      }
      cartBody.className = "mt-6 grid gap-6 lg:grid-cols-[1fr_360px]";
      const t = totals();
      cartBody.innerHTML = `
        <div class="space-y-3">
          ${cart
            .map(
              (item, i) => `
            <div class="flex gap-4 rounded-xl border border-border bg-surface p-3">
              <span class="h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                <img src="${item.image}" alt="${item.name}" class="h-full w-full object-cover object-top" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="truncate text-xs text-muted">${item.seller || ""}</p>
                    <h3 class="truncate text-sm font-semibold text-heading">${item.name}</h3>
                    ${customLine(item) ? `<p class="mt-0.5 line-clamp-2 text-xs text-primary">${customLine(item)}</p>` : ""}
                  </div>
                  <button data-remove="${i}" class="shrink-0 text-muted hover:text-primary"><i class="bx bx-trash text-lg"></i></button>
                </div>
                <div class="mt-2 flex items-center justify-between">
                  <div class="flex items-center rounded-lg border border-border">
                    <button data-dec="${i}" class="flex h-8 w-8 items-center justify-center text-heading hover:text-primary"><i class="bx bx-minus"></i></button>
                    <span class="w-8 text-center text-sm font-semibold text-heading">${item.qty || 1}</span>
                    <button data-inc="${i}" class="flex h-8 w-8 items-center justify-center text-heading hover:text-primary"><i class="bx bx-plus"></i></button>
                  </div>
                  <span class="text-sm font-bold text-heading">${money((item.totalPrice || item.price) * (item.qty || 1))}</span>
                </div>
              </div>
            </div>`,
            )
            .join("")}
        </div>
        ${summaryCard(t, `${b}/pages/checkout.html`, "Proceed to Checkout")}`;

      cartBody.querySelectorAll("[data-remove]").forEach((el) =>
        el.addEventListener("click", () => {
          Store.removeFromCart(+el.dataset.remove);
          renderCart();
        }),
      );
      cartBody.querySelectorAll("[data-inc]").forEach((el) =>
        el.addEventListener("click", () => {
          const i = +el.dataset.inc;
          Store.updateQty(i, (Store.getCart()[i].qty || 1) + 1);
          renderCart();
        }),
      );
      cartBody.querySelectorAll("[data-dec]").forEach((el) =>
        el.addEventListener("click", () => {
          const i = +el.dataset.dec;
          Store.updateQty(i, (Store.getCart()[i].qty || 1) - 1);
          renderCart();
        }),
      );
    };
    renderCart();
  }

  function summaryCard(t, href, cta) {
    return `
      <div class="h-max rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-24">
        <h3 class="text-sm font-bold uppercase tracking-wide text-heading">Order Summary</h3>
        <div class="mt-4 space-y-2 text-sm">
          <div class="flex justify-between"><span class="text-body">Subtotal</span><span class="font-semibold text-heading">${money(t.sub)}</span></div>
          <div class="flex justify-between"><span class="text-body">Shipping</span><span class="font-semibold ${t.shipping ? "text-heading" : "text-primary"}">${t.shipping ? money(t.shipping) : "FREE"}</span></div>
          <div class="mt-2 flex justify-between border-t border-border pt-3 text-base"><span class="font-bold text-heading">Total</span><span class="font-bold text-heading">${money(t.total)}</span></div>
        </div>
        <a href="${href}" class="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-hover">${cta} <i class="bx bx-right-arrow-alt"></i></a>
        ${t.sub < 999 && t.sub > 0 ? `<p class="mt-3 text-center text-xs text-muted">Add ${money(999 - t.sub)} more for FREE shipping</p>` : ""}
      </div>`;
  }

  function emptyState(icon, title, text, href, cta) {
    return `
      <div class="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface py-20 text-center">
        <i class="bx ${icon} text-6xl text-neutral-300"></i>
        <p class="mt-4 text-base font-semibold text-heading">${title}</p>
        <p class="mt-1 max-w-sm text-sm text-muted">${text}</p>
        <a href="${href}" class="mt-5 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover">${cta}</a>
      </div>`;
  }

  // ---------------------------------------------------------------
  // WISHLIST
  // ---------------------------------------------------------------
  const wlRoot = document.getElementById("wishlist-root");
  if (wlRoot) {
    const renderWishlist = () => {
      const list = Store.getWishlist();
      const label = document.getElementById("wishlist-count-label");
      if (label) label.textContent = `${list.length} item${list.length === 1 ? "" : "s"} saved`;
      if (list.length === 0) {
        wlRoot.innerHTML = emptyState(
          "bx-heart",
          "Your wishlist is empty",
          "Tap the heart on any product to save it here.",
          `${b}/pages/products.html`,
          "Explore Products",
        );
        return;
      }
      wlRoot.className = "mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";
      wlRoot.innerHTML = list
        .map(
          (p) => `
        <div class="group overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-soft">
          <a href="${b}/pages/product.html?id=${p.productId}" class="relative block aspect-[3/4] overflow-hidden bg-neutral-100">
            <img src="${p.image}" alt="${p.name}" class="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
          </a>
          <div class="p-3">
            <p class="truncate text-xs text-muted">${p.seller || ""}</p>
            <h3 class="truncate text-sm font-semibold text-heading">${p.name}</h3>
            <p class="mt-1 text-sm font-bold text-heading">${money(p.price)}</p>
            <div class="mt-3 flex gap-2">
              <button data-move="${p.productId}" class="flex-1 rounded-lg bg-primary px-2 py-2 text-xs font-semibold text-white hover:bg-primary-hover">Move to Cart</button>
              <button data-remove="${p.productId}" class="rounded-lg border border-border px-2.5 text-heading hover:text-primary"><i class="bx bx-trash"></i></button>
            </div>
          </div>
        </div>`,
        )
        .join("");

      wlRoot.querySelectorAll("[data-remove]").forEach((el) =>
        el.addEventListener("click", () => {
          Store.removeWishlist(+el.dataset.remove);
          renderWishlist();
        }),
      );
      wlRoot.querySelectorAll("[data-move]").forEach((el) =>
        el.addEventListener("click", () => {
          const id = +el.dataset.move;
          const p = Store.getWishlist().find((w) => w.productId === id);
          if (p) {
            Store.addToCart({
              productId: p.productId,
              name: p.name,
              image: p.image,
              seller: p.seller,
              price: p.price,
              totalPrice: p.price,
              qty: 1,
            });
            Store.removeWishlist(id);
            renderWishlist();
          }
        }),
      );
    };
    renderWishlist();
  }

  // ---------------------------------------------------------------
  // SAVED DESIGNS (account tab renders elsewhere; standalone list here)
  // ---------------------------------------------------------------
  const designRoot = document.getElementById("designs-root");
  if (designRoot) renderDesigns(designRoot, money, b);

  // ---------------------------------------------------------------
  // CHECKOUT
  // ---------------------------------------------------------------
  const coRoot = document.getElementById("checkout-root");
  if (coRoot) initCheckout(coRoot, money, b, totals, customLine);

  // ---------------------------------------------------------------
  // ORDERS
  // ---------------------------------------------------------------
  const ordersRoot = document.getElementById("orders-root");
  if (ordersRoot) renderOrders(ordersRoot, money, b, emptyState);

  // ---------------------------------------------------------------
  // ORDER TRACKING
  // ---------------------------------------------------------------
  const trackRoot = document.getElementById("track-root");
  if (trackRoot) renderTracking(trackRoot, money, b);
});

// ---- Saved designs ----
function renderDesigns(root, money, b) {
  const list = Store.getDesigns();
  if (list.length === 0) {
    root.innerHTML = `
      <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 py-16 text-center">
        <i class="bx bx-pencil text-5xl text-neutral-300"></i>
        <p class="mt-3 text-sm font-semibold text-heading">No saved designs yet</p>
        <p class="mt-1 text-sm text-muted">Create a custom design in the Design Studio.</p>
        <a href="${b}/pages/products.html?category=customise" class="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-hover">Start Designing</a>
      </div>`;
    return;
  }
  root.className = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";
  root.innerHTML = list
    .map((d, i) => {
      const bits = [];
      if (d.customisation) Object.values(d.customisation).forEach((v) => v && bits.push(v));
      return `
      <div class="overflow-hidden rounded-xl border border-border bg-surface">
        <div class="aspect-[4/3] overflow-hidden bg-neutral-100"><img src="${d.image}" alt="${d.name}" class="h-full w-full object-cover object-top" /></div>
        <div class="p-4">
          <h3 class="truncate text-sm font-semibold text-heading">${d.name}</h3>
          <p class="mt-0.5 line-clamp-2 text-xs text-primary">${bits.join(" · ")}</p>
          <p class="mt-1 text-sm font-bold text-heading">${money(d.totalPrice)}</p>
          <div class="mt-3 flex gap-2">
            <button data-buy-design="${i}" class="flex-1 rounded-lg bg-primary px-2 py-2 text-xs font-semibold text-white hover:bg-primary-hover">Add to Cart</button>
            <button data-del-design="${i}" class="rounded-lg border border-border px-2.5 text-heading hover:text-primary"><i class="bx bx-trash"></i></button>
          </div>
        </div>
      </div>`;
    })
    .join("");

  root.querySelectorAll("[data-buy-design]").forEach((el) =>
    el.addEventListener("click", () => {
      Store.addToCart(Store.getDesigns()[+el.dataset.buyDesign]);
      el.textContent = "Added ✓";
    }),
  );
  root.querySelectorAll("[data-del-design]").forEach((el) =>
    el.addEventListener("click", () => {
      Store.removeDesign(+el.dataset.delDesign);
      renderDesigns(root, money, b);
    }),
  );
}

// ---- Checkout ----
function initCheckout(root, money, b, totals, customLine) {
  const cart = Store.getCart();
  if (cart.length === 0) {
    root.innerHTML = `<div class="rounded-2xl border border-border bg-surface p-12 text-center"><i class="bx bx-cart text-5xl text-neutral-300"></i><p class="mt-3 text-sm font-semibold text-heading">Your cart is empty</p><a href="${b}/pages/products.html" class="mt-4 inline-block rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white">Shop now</a></div>`;
    return;
  }
  const t = totals();
  root.innerHTML = `
    <div class="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div class="space-y-6">
        <section class="rounded-xl border border-border bg-surface p-5">
          <h3 class="mb-4 text-sm font-bold text-heading">Delivery Address</h3>
          <div class="grid gap-3 sm:grid-cols-2">
            <input id="co-name" placeholder="Full name" class="h-11 rounded-lg border border-border bg-neutral-50 px-4 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary" />
            <input id="co-phone" placeholder="Mobile number" class="h-11 rounded-lg border border-border bg-neutral-50 px-4 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary" />
            <input id="co-addr" placeholder="Address" class="h-11 rounded-lg border border-border bg-neutral-50 px-4 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary sm:col-span-2" />
            <input id="co-city" placeholder="City" class="h-11 rounded-lg border border-border bg-neutral-50 px-4 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary" />
            <input id="co-pin" placeholder="Pincode" maxlength="6" class="h-11 rounded-lg border border-border bg-neutral-50 px-4 text-sm focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </section>
        <section class="rounded-xl border border-border bg-surface p-5">
          <h3 class="mb-4 text-sm font-bold text-heading">Payment Method</h3>
          <div class="space-y-2">
            ${["UPI", "Credit / Debit Card", "Net Banking", "Cash on Delivery"]
              .map(
                (m, i) => `
              <label class="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-sendmystyle-50">
                <input type="radio" name="pay" class="h-4 w-4 text-primary focus:ring-primary" ${i === 0 ? "checked" : ""} />
                <span class="font-medium text-heading">${m}</span>
              </label>`,
              )
              .join("")}
          </div>
        </section>
      </div>
      <div class="h-max rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-24">
        <h3 class="text-sm font-bold uppercase tracking-wide text-heading">Order Summary</h3>
        <div class="mt-3 max-h-48 space-y-2 overflow-y-auto">
          ${cart
            .map(
              (item) => `
            <div class="flex items-center gap-2 text-sm">
              <span class="h-10 w-9 shrink-0 overflow-hidden rounded bg-neutral-100"><img src="${item.image}" class="h-full w-full object-cover object-top" /></span>
              <span class="min-w-0 flex-1 truncate text-body">${item.name} ×${item.qty || 1}</span>
              <span class="font-semibold text-heading">${money((item.totalPrice || item.price) * (item.qty || 1))}</span>
            </div>`,
            )
            .join("")}
        </div>
        <div class="mt-4 space-y-2 border-t border-border pt-3 text-sm">
          <div class="flex justify-between"><span class="text-body">Subtotal</span><span class="font-semibold text-heading">${money(t.sub)}</span></div>
          <div class="flex justify-between"><span class="text-body">Shipping</span><span class="font-semibold ${t.shipping ? "text-heading" : "text-primary"}">${t.shipping ? money(t.shipping) : "FREE"}</span></div>
          <div class="flex justify-between border-t border-border pt-2 text-base"><span class="font-bold text-heading">Total</span><span class="font-bold text-heading">${money(t.total)}</span></div>
        </div>
        <button id="co-place" class="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary-hover">Place Order</button>
        <p id="co-err" class="mt-2 hidden text-center text-xs font-medium text-primary"></p>
      </div>
    </div>`;

  document.getElementById("co-place").addEventListener("click", () => {
    const name = document.getElementById("co-name").value.trim();
    const phone = document.getElementById("co-phone").value.trim();
    const addr = document.getElementById("co-addr").value.trim();
    const pin = document.getElementById("co-pin").value.trim();
    const err = document.getElementById("co-err");
    if (!name || !phone || !addr || !/^\d{6}$/.test(pin)) {
      err.textContent = "Please fill all address fields with a valid pincode.";
      err.classList.remove("hidden");
      return;
    }
    const order = {
      id: "SMS" + Date.now().toString().slice(-8),
      items: Store.getCart(),
      total: totals().total,
      address: { name, phone, addr, city: document.getElementById("co-city").value.trim(), pin },
      placedAt: Date.now(),
      status: "confirmed",
    };
    Store.placeOrder(order);
    Store.clearCart();
    window.location.href = `${b}/pages/track-order.html?id=${order.id}`;
  });
}

// ---- Orders list ----
function renderOrders(root, money, b, emptyState) {
  const orders = Store.getOrders();
  if (orders.length === 0) {
    root.innerHTML = emptyState(
      "bx-package",
      "No orders yet",
      "Your orders will appear here once you check out.",
      `${b}/pages/products.html`,
      "Start Shopping",
    );
    return;
  }
  root.className = "space-y-4";
  root.innerHTML = orders
    .map(
      (o) => `
    <div class="rounded-xl border border-border bg-surface p-4">
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-border-light pb-3">
        <div>
          <p class="text-sm font-semibold text-heading">Order #${o.id}</p>
          <p class="text-xs text-muted">Placed ${new Date(o.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
        <span class="rounded-full bg-sendmystyle-50 px-3 py-1 text-xs font-bold capitalize text-primary">${o.status}</span>
      </div>
      <div class="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
        ${o.items.map((it) => `<span class="h-16 w-14 shrink-0 overflow-hidden rounded bg-neutral-100"><img src="${it.image}" class="h-full w-full object-cover object-top" /></span>`).join("")}
      </div>
      <div class="mt-3 flex items-center justify-between">
        <span class="text-sm font-bold text-heading">${money(o.total)}</span>
        <a href="${b}/pages/track-order.html?id=${o.id}" class="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-heading hover:border-primary hover:text-primary">Track Order</a>
      </div>
    </div>`,
    )
    .join("");
}

// ---- Order tracking ----
function renderTracking(root, money, b) {
  const id = new URLSearchParams(location.search).get("id");
  const order = id ? Store.getOrder(id) : Store.getOrders()[0];
  if (!order) {
    root.innerHTML = `<div class="rounded-2xl border border-border bg-surface p-12 text-center"><i class="bx bx-package text-5xl text-neutral-300"></i><p class="mt-3 text-sm font-semibold text-heading">Order not found</p><a href="${b}/pages/orders.html" class="mt-4 inline-block rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white">View orders</a></div>`;
    return;
  }
  const steps = [
    { key: "confirmed", label: "Order Confirmed", icon: "bx-check-circle" },
    { key: "processing", label: "Processing / Tailoring", icon: "bx-cog" },
    { key: "shipped", label: "Shipped", icon: "bx-package" },
    { key: "out", label: "Out for Delivery", icon: "bx-cycling" },
    { key: "delivered", label: "Delivered", icon: "bx-home-smile" },
  ];
  // Demo: current status index (confirmed at least)
  const activeIdx = 1;

  root.innerHTML = `
    <div class="rounded-xl border border-border bg-surface p-5">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p class="text-sm font-semibold text-heading">Order #${order.id}</p>
          <p class="text-xs text-muted">Estimated delivery in 5–7 days</p>
        </div>
        <a href="${b}/pages/orders.html" class="text-sm font-semibold text-primary hover:underline">All orders</a>
      </div>

      <div class="mt-8">
        ${steps
          .map((s, i) => {
            const done = i <= activeIdx;
            const last = i === steps.length - 1;
            return `
          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <span class="flex h-10 w-10 items-center justify-center rounded-full ${done ? "bg-primary text-white" : "bg-neutral-100 text-muted"}"><i class="bx ${s.icon} text-lg"></i></span>
              ${!last ? `<span class="my-1 w-0.5 flex-1 ${i < activeIdx ? "bg-primary" : "bg-border"}" style="min-height:34px"></span>` : ""}
            </div>
            <div class="pb-6 pt-1.5">
              <p class="text-sm font-semibold ${done ? "text-heading" : "text-muted"}">${s.label}</p>
              ${i === activeIdx ? '<p class="text-xs text-primary">In progress</p>' : done ? '<p class="text-xs text-muted">Completed</p>' : ""}
            </div>
          </div>`;
          })
          .join("")}
      </div>
    </div>

    <div class="mt-6 rounded-xl border border-border bg-surface p-5">
      <h3 class="text-sm font-bold text-heading">Items in this order</h3>
      <div class="mt-3 space-y-3">
        ${order.items
          .map(
            (it) => `
          <div class="flex items-center gap-3">
            <span class="h-16 w-14 shrink-0 overflow-hidden rounded bg-neutral-100"><img src="${it.image}" class="h-full w-full object-cover object-top" /></span>
            <span class="min-w-0 flex-1"><span class="block truncate text-sm font-semibold text-heading">${it.name}</span><span class="block text-xs text-muted">Qty ${it.qty || 1}</span></span>
            <span class="text-sm font-semibold text-heading">${money((it.totalPrice || it.price) * (it.qty || 1))}</span>
          </div>`,
          )
          .join("")}
      </div>
      <div class="mt-4 flex justify-between border-t border-border pt-3">
        <span class="font-bold text-heading">Total Paid</span>
        <span class="font-bold text-heading">${money(order.total)}</span>
      </div>
    </div>`;
}
