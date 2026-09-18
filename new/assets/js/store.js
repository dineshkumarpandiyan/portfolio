// ==============================================================
// SendMyStyle — Client Store (cart / wishlist / designs / orders)
// localStorage-backed. Shared across all pages.
// ==============================================================

const Store = (() => {
  const KEYS = {
    cart: "sms_cart",
    wishlist: "sms_wishlist",
    designs: "sms_designs",
    orders: "sms_orders",
  };

  const read = (k) => {
    try {
      return JSON.parse(localStorage.getItem(k) || "[]");
    } catch {
      return [];
    }
  };
  const write = (k, v) => {
    localStorage.setItem(k, JSON.stringify(v));
    document.dispatchEvent(new CustomEvent("store:change", { detail: { key: k } }));
  };

  // ---- Cart ----
  function getCart() {
    return read(KEYS.cart);
  }
  // A cart line is keyed by product + size + colour + customisation signature
  function lineKey(item) {
    return [
      item.productId,
      item.size || "",
      item.color || "",
      JSON.stringify(item.customisation || {}),
      JSON.stringify(item.monogram || {}),
    ].join("|");
  }
  function addToCart(item) {
    const cart = getCart();
    const key = lineKey(item);
    const existing = cart.find((c) => lineKey(c) === key);
    if (existing) existing.qty += item.qty || 1;
    else cart.push({ ...item, qty: item.qty || 1 });
    write(KEYS.cart, cart);
  }
  function updateQty(index, qty) {
    const cart = getCart();
    if (!cart[index]) return;
    cart[index].qty = Math.max(1, qty);
    write(KEYS.cart, cart);
  }
  function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    write(KEYS.cart, cart);
  }
  function clearCart() {
    write(KEYS.cart, []);
  }
  function cartCount() {
    return getCart().reduce((n, c) => n + (c.qty || 1), 0);
  }
  function cartTotal() {
    return getCart().reduce((n, c) => n + (c.totalPrice || c.price || 0) * (c.qty || 1), 0);
  }

  // ---- Wishlist ----
  function getWishlist() {
    return read(KEYS.wishlist);
  }
  function inWishlist(productId) {
    return getWishlist().some((w) => w.productId === productId);
  }
  function toggleWishlist(item) {
    const list = getWishlist();
    const i = list.findIndex((w) => w.productId === item.productId);
    if (i >= 0) list.splice(i, 1);
    else list.push(item);
    write(KEYS.wishlist, list);
    return i < 0; // true if added
  }
  function removeWishlist(productId) {
    write(
      KEYS.wishlist,
      getWishlist().filter((w) => w.productId !== productId),
    );
  }
  function wishlistCount() {
    return getWishlist().length;
  }

  // ---- Designs ----
  function getDesigns() {
    return read(KEYS.designs);
  }
  function saveDesign(item) {
    const list = getDesigns();
    list.push(item);
    write(KEYS.designs, list);
  }
  function removeDesign(index) {
    const list = getDesigns();
    list.splice(index, 1);
    write(KEYS.designs, list);
  }

  // ---- Orders ----
  function getOrders() {
    return read(KEYS.orders);
  }
  function getOrder(id) {
    return getOrders().find((o) => o.id === id);
  }
  function placeOrder(order) {
    const orders = getOrders();
    orders.unshift(order);
    write(KEYS.orders, orders);
  }

  return {
    KEYS,
    getCart,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
    getWishlist,
    inWishlist,
    toggleWishlist,
    removeWishlist,
    wishlistCount,
    getDesigns,
    saveDesign,
    removeDesign,
    getOrders,
    getOrder,
    placeOrder,
  };
})();

// Keep header cart / wishlist badges in sync everywhere
function refreshHeaderBadges() {
  if (typeof Store === "undefined") return;
  const c = Store.cartCount();
  const w = Store.wishlistCount();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = c;
    el.classList.toggle("hidden", c === 0);
  });
  document.querySelectorAll("[data-wishlist-count]").forEach((el) => {
    el.textContent = w;
    el.classList.toggle("hidden", w === 0);
  });
}
document.addEventListener("store:change", refreshHeaderBadges);
