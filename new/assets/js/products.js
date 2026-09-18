// ==============================
// SendMyStyle — Product Catalog (mock data)
// Each product:
//   id, name, category, subcategory, seller, brand,
//   price, mrp, rating, ratingCount, colors[], sizes[],
//   customizable, tags[], image, badge
// ==============================

// Shared filter option pools
const PRODUCT_COLORS = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Navy", hex: "#1E293B" },
  { name: "Grey", hex: "#9CA3AF" },
  { name: "Beige", hex: "#D6C7A1" },
  { name: "Pink", hex: "#D01050" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Green", hex: "#16A34A" },
  { name: "Maroon", hex: "#7F1D1D" },
  { name: "Mustard", hex: "#D19A00" },
];

const PRODUCT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// Category → subcategory map (aligns with the mega menu)
const CATEGORY_MAP = {
  men: {
    label: "Men",
    subs: ["shirts", "t-shirts", "trousers", "jeans", "kurtas", "jackets", "footwear"],
  },
  women: {
    label: "Women",
    subs: ["sarees", "kurtas", "dresses", "tops", "jeans", "footwear", "handbags"],
  },
  kids: {
    label: "Kids",
    subs: ["boys", "girls", "infants", "footwear"],
  },
  accessories: {
    label: "Accessories",
    subs: ["bags", "watches", "sunglasses", "belts", "jewellery"],
  },
  customise: {
    label: "Customise",
    subs: ["custom-shirts", "custom-tshirts", "custom-kurtas", "custom-dresses"],
  },
};

// Readable subcategory labels
const SUBCATEGORY_LABELS = {
  shirts: "Shirts",
  "t-shirts": "T-Shirts",
  trousers: "Trousers",
  jeans: "Jeans",
  kurtas: "Kurtas",
  jackets: "Jackets",
  footwear: "Footwear",
  sarees: "Sarees",
  dresses: "Dresses",
  tops: "Tops",
  handbags: "Handbags",
  boys: "Boys",
  girls: "Girls",
  infants: "Infants",
  bags: "Bags",
  watches: "Watches",
  sunglasses: "Sunglasses",
  belts: "Belts",
  jewellery: "Jewellery",
  "custom-shirts": "Custom Shirts",
  "custom-tshirts": "Custom T-Shirts",
  "custom-kurtas": "Custom Kurtas",
  "custom-dresses": "Custom Dresses",
};

const SELLERS = [
  "Atelier Nord",
  "Kanchi Weaves",
  "Urban Thread",
  "Maison Rue",
  "DenimCo",
  "SilkStory",
  "FitForm",
  "LoomLine",
  "Verve Studio",
  "Neo Ethnic",
  "PureCotton",
  "Craft & Co",
];

// Image pool by rough type (reused across products)
const IMG = {
  shirt: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80",
  shirt2: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80",
  tshirt: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80",
  trouser: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=500&q=80",
  jeans: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=500&q=80",
  kurta: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?auto=format&fit=crop&w=500&q=80",
  jacket: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80",
  shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
  saree: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80",
  dress: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80",
  top: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&w=500&q=80",
  handbag: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=80",
  watch: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=500&q=80",
  sunglasses: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80",
  belt: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=500&q=80",
  jewellery: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80",
  kidsBoy: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=500&q=80",
  kidsGirl: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=500&q=80",
  infant: "https://images.unsplash.com/photo-1522771930-b60a44dc3dd7?auto=format&fit=crop&w=500&q=80",
};

// Alternate detail/angle shots reused to build multi-image galleries
const ALT_IMAGES = [
  "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=500&q=80",
];

// Build a 4-image gallery: the main image + 3 varied detail shots
function galleryFor(main) {
  const start = _pid % ALT_IMAGES.length;
  const alts = [0, 1, 2].map((k) => ALT_IMAGES[(start + k) % ALT_IMAGES.length]);
  return [main, ...alts];
}

// ---- Product factory -------------------------------------------------
let _pid = 0;
function P(name, category, subcategory, img, price, mrp, opts = {}) {
  _pid += 1;
  const colorPool = PRODUCT_COLORS.map((c) => c.name);
  const pickColors = opts.colors || colorPool.slice(0, 3 + (_pid % 4));
  const pickSizes = opts.sizes || PRODUCT_SIZES.slice(0, 4 + (_pid % 3));
  // Virtual try-on makes sense for wearables worn on the body / face
  const TRYON_SUBS = [
    "shirts",
    "t-shirts",
    "kurtas",
    "jackets",
    "dresses",
    "tops",
    "sunglasses",
    "watches",
    "custom-shirts",
    "custom-tshirts",
    "custom-kurtas",
    "custom-dresses",
  ];
  return {
    id: _pid,
    name,
    category,
    subcategory,
    seller: opts.seller || SELLERS[_pid % SELLERS.length],
    brand: opts.brand || SELLERS[_pid % SELLERS.length],
    price,
    mrp,
    rating: opts.rating || 3.8 + ((_pid * 7) % 12) / 10,
    ratingCount: opts.ratingCount || 50 + ((_pid * 37) % 950),
    colors: pickColors,
    sizes: pickSizes,
    customizable: opts.customizable ?? _pid % 2 === 0,
    virtualTryOn: opts.virtualTryOn ?? TRYON_SUBS.includes(subcategory),
    tags: opts.tags || [],
    image: img,
    images: opts.images || galleryFor(img),
    badge: opts.badge || (mrp > price && (mrp - price) / mrp > 0.35 ? "Best Deal" : ""),
    description:
      opts.description ||
      `${name} by ${opts.seller || "our verified seller"}. Crafted with premium materials and finished to a high standard. A versatile piece designed for everyday style and comfort.`,
  };
}

const PRODUCTS = [
  // ---------- MEN ----------
  P("Classic Oxford Shirt", "men", "shirts", IMG.shirt, 1499, 2199, { customizable: true, tags: ["New"] }),
  P("Linen Casual Shirt", "men", "shirts", IMG.shirt2, 1299, 1999, { customizable: true }),
  P("Formal White Shirt", "men", "shirts", IMG.shirt, 1199, 1699, { customizable: true }),
  P("Checked Flannel Shirt", "men", "shirts", IMG.shirt2, 1399, 2099, {}),
  P("Mandarin Collar Shirt", "men", "shirts", IMG.shirt, 1599, 2299, { customizable: true }),
  P("Graphic Crew Tee", "men", "t-shirts", IMG.tshirt, 599, 999, { tags: ["New"] }),
  P("Plain Cotton Tee", "men", "t-shirts", IMG.tshirt, 499, 799, { customizable: true }),
  P("Polo T-Shirt", "men", "t-shirts", IMG.tshirt, 899, 1299, {}),
  P("Oversized Tee", "men", "t-shirts", IMG.tshirt, 699, 1199, {}),
  P("Slim Fit Chinos", "men", "trousers", IMG.trouser, 1299, 1899, { customizable: true }),
  P("Formal Trousers", "men", "trousers", IMG.trouser, 1499, 2199, { customizable: true }),
  P("Cargo Pants", "men", "trousers", IMG.trouser, 1399, 1999, {}),
  P("Slim Fit Jeans", "men", "jeans", IMG.jeans, 1699, 2499, {}),
  P("Distressed Denim", "men", "jeans", IMG.jeans, 1899, 2799, { tags: ["Trending"] }),
  P("Straight Fit Jeans", "men", "jeans", IMG.jeans, 1599, 2299, {}),
  P("Cotton Kurta", "men", "kurtas", IMG.kurta, 1499, 2199, { customizable: true }),
  P("Silk Blend Kurta", "men", "kurtas", IMG.kurta, 2199, 3199, { customizable: true }),
  P("Nehru Jacket Set", "men", "kurtas", IMG.kurta, 2999, 4499, { customizable: true, badge: "Premium" }),
  P("Bomber Jacket", "men", "jackets", IMG.jacket, 2499, 3799, {}),
  P("Denim Jacket", "men", "jackets", IMG.jacket, 2299, 3299, {}),
  P("Leather Sneakers", "men", "footwear", IMG.shoes, 2499, 3499, {}),
  P("Casual Loafers", "men", "footwear", IMG.shoes, 1999, 2999, {}),
  P("Running Shoes", "men", "footwear", IMG.shoes, 2799, 3999, { tags: ["New"] }),

  // ---------- WOMEN ----------
  P("Handwoven Silk Saree", "women", "sarees", IMG.saree, 4999, 6500, {
    customizable: false,
    badge: "Premium",
    tags: ["Trending"],
  }),
  P("Cotton Handloom Saree", "women", "sarees", IMG.saree, 2499, 3499, {}),
  P("Banarasi Saree", "women", "sarees", IMG.saree, 5999, 8999, { badge: "Premium" }),
  P("Georgette Saree", "women", "sarees", IMG.saree, 3299, 4799, {}),
  P("Embroidered Kurta", "women", "kurtas", IMG.kurta, 1699, 2399, { customizable: true }),
  P("Anarkali Kurta Set", "women", "kurtas", IMG.kurta, 2799, 3999, { customizable: true }),
  P("Straight Cut Kurti", "women", "kurtas", IMG.kurta, 1299, 1899, {}),
  P("Floral Summer Dress", "women", "dresses", IMG.dress, 1899, 2499, { customizable: true, tags: ["New"] }),
  P("Bodycon Dress", "women", "dresses", IMG.dress, 1699, 2499, {}),
  P("Maxi Dress", "women", "dresses", IMG.dress, 2199, 3199, { customizable: true }),
  P("Wrap Dress", "women", "dresses", IMG.dress, 1999, 2899, {}),
  P("Ruffle Top", "women", "tops", IMG.top, 899, 1399, {}),
  P("Crop Top", "women", "tops", IMG.top, 699, 1099, { tags: ["Trending"] }),
  P("Peplum Top", "women", "tops", IMG.top, 999, 1499, {}),
  P("High Waist Jeans", "women", "jeans", IMG.jeans, 1799, 2599, {}),
  P("Skinny Jeans", "women", "jeans", IMG.jeans, 1699, 2399, {}),
  P("Block Heels", "women", "footwear", IMG.shoes, 1899, 2799, {}),
  P("Ballet Flats", "women", "footwear", IMG.shoes, 1299, 1899, {}),
  P("Tote Handbag", "women", "handbags", IMG.handbag, 1999, 2999, {}),
  P("Sling Bag", "women", "handbags", IMG.handbag, 1499, 2199, { tags: ["New"] }),

  // ---------- KIDS ----------
  P("Boys Casual Shirt", "kids", "boys", IMG.kidsBoy, 799, 1199, {}),
  P("Boys Ethnic Kurta", "kids", "boys", IMG.kidsBoy, 1099, 1599, { customizable: true }),
  P("Boys Denim Set", "kids", "boys", IMG.kidsBoy, 1299, 1899, {}),
  P("Girls Party Dress", "kids", "girls", IMG.kidsGirl, 1199, 1799, { customizable: true, tags: ["New"] }),
  P("Girls Frock", "kids", "girls", IMG.kidsGirl, 899, 1399, {}),
  P("Girls Ethnic Set", "kids", "girls", IMG.kidsGirl, 1399, 1999, { customizable: true }),
  P("Infant Romper", "kids", "infants", IMG.infant, 599, 899, {}),
  P("Infant Bodysuit Set", "kids", "infants", IMG.infant, 799, 1199, {}),
  P("Kids Sneakers", "kids", "footwear", IMG.shoes, 999, 1499, {}),
  P("Kids Sandals", "kids", "footwear", IMG.shoes, 699, 999, {}),

  // ---------- ACCESSORIES ----------
  P("Leather Backpack", "accessories", "bags", IMG.handbag, 2299, 3299, {}),
  P("Laptop Bag", "accessories", "bags", IMG.handbag, 1999, 2899, {}),
  P("Analog Watch", "accessories", "watches", IMG.watch, 2999, 4499, { badge: "Premium" }),
  P("Smart Watch", "accessories", "watches", IMG.watch, 3499, 4999, { tags: ["Trending"] }),
  P("Aviator Sunglasses", "accessories", "sunglasses", IMG.sunglasses, 1299, 1999, {}),
  P("Round Sunglasses", "accessories", "sunglasses", IMG.sunglasses, 1099, 1699, {}),
  P("Leather Belt", "accessories", "belts", IMG.belt, 899, 1399, { customizable: true }),
  P("Reversible Belt", "accessories", "belts", IMG.belt, 1099, 1599, {}),
  P("Gold Plated Necklace", "accessories", "jewellery", IMG.jewellery, 1599, 2399, {}),
  P("Silver Earrings", "accessories", "jewellery", IMG.jewellery, 999, 1499, {}),

  // ---------- CUSTOMISE ----------
  P("Design Your Shirt", "customise", "custom-shirts", IMG.shirt, 1799, 2499, {
    customizable: true,
    badge: "Made to Measure",
  }),
  P("Custom Formal Shirt", "customise", "custom-shirts", IMG.shirt2, 1899, 2699, {
    customizable: true,
    badge: "Made to Measure",
  }),
  P("Custom Graphic Tee", "customise", "custom-tshirts", IMG.tshirt, 799, 1199, { customizable: true }),
  P("Personalised Tee", "customise", "custom-tshirts", IMG.tshirt, 899, 1299, { customizable: true }),
  P("Custom Kurta", "customise", "custom-kurtas", IMG.kurta, 2199, 3199, {
    customizable: true,
    badge: "Made to Measure",
  }),
  P("Bespoke Kurta Set", "customise", "custom-kurtas", IMG.kurta, 2999, 4299, { customizable: true, badge: "Premium" }),
  P("Custom Dress", "customise", "custom-dresses", IMG.dress, 2499, 3499, {
    customizable: true,
    badge: "Made to Measure",
  }),
  P("Made-to-Measure Gown", "customise", "custom-dresses", IMG.dress, 3999, 5999, {
    customizable: true,
    badge: "Premium",
  }),
];

// ==============================================================
// Customisation schema — PRODUCT-WISE, data driven.
// Design Studio renders whatever groups map to a product's subcategory.
// No category conditionals in the engine — it just reads this schema.
//
// group: { id, label, type: "card" | "color" | "text", options[] }
//   card  -> options: { value, label, note?, price }
//   color -> options: { value(name), price }
//   text  -> personalisation (monogram): { price, maxLength }
// ==============================================================

// Reusable groups
const _fabric = (extra = []) => ({
  id: "fabric",
  label: "Fabric",
  type: "card",
  options: [
    { value: "cotton", label: "Cotton", note: "Breathable everyday", price: 0 },
    { value: "linen", label: "Linen", note: "Light & airy", price: 200 },
    { value: "premium-cotton", label: "Premium Cotton", note: "Soft, durable", price: 150 },
    ...extra,
  ],
});
const _fit = {
  id: "fit",
  label: "Fit",
  type: "card",
  options: [
    { value: "slim", label: "Slim Fit", price: 0 },
    { value: "regular", label: "Regular Fit", price: 0 },
    { value: "relaxed", label: "Relaxed Fit", price: 0 },
  ],
};
const _colorGroup = {
  id: "color",
  label: "Colour",
  type: "color",
  options: [
    { value: "White", price: 0 },
    { value: "Black", price: 0 },
    { value: "Navy", price: 0 },
    { value: "Beige", price: 0 },
    { value: "Maroon", price: 100 },
    { value: "Green", price: 100 },
  ],
};
const _monogram = { id: "monogram", label: "Monogram", type: "text", price: 149, maxLength: 8 };

// Per-subcategory customisation groups
const CUSTOMISATION_SCHEMA = {
  // ---- Tops / shirts ----
  shirts: [
    _fabric([{ value: "silk-blend", label: "Silk Blend", note: "Premium sheen", price: 400 }]),
    {
      id: "collar",
      label: "Collar",
      type: "card",
      options: [
        { value: "classic", label: "Classic", price: 0 },
        { value: "spread", label: "Spread", price: 0 },
        { value: "mandarin", label: "Mandarin", price: 100 },
        { value: "button-down", label: "Button Down", price: 80 },
      ],
    },
    {
      id: "cuff",
      label: "Cuff",
      type: "card",
      options: [
        { value: "single", label: "Single", price: 0 },
        { value: "double", label: "Double (French)", price: 120 },
        { value: "rounded", label: "Rounded", price: 60 },
      ],
    },
    _fit,
    _colorGroup,
    _monogram,
  ],
  "custom-shirts": null, // filled below (same as shirts)
  "t-shirts": [
    _fabric(),
    {
      id: "neck",
      label: "Neckline",
      type: "card",
      options: [
        { value: "crew", label: "Crew Neck", price: 0 },
        { value: "v-neck", label: "V-Neck", price: 0 },
        { value: "polo", label: "Polo", price: 120 },
      ],
    },
    {
      id: "sleeve",
      label: "Sleeve",
      type: "card",
      options: [
        { value: "short", label: "Short Sleeve", price: 0 },
        { value: "half", label: "Half Sleeve", price: 0 },
        { value: "full", label: "Full Sleeve", price: 80 },
      ],
    },
    _fit,
    _colorGroup,
    _monogram,
  ],
  "custom-tshirts": null,
  kurtas: [
    _fabric([{ value: "silk", label: "Silk", note: "Festive", price: 500 }]),
    {
      id: "collar",
      label: "Neck Style",
      type: "card",
      options: [
        { value: "round", label: "Round", price: 0 },
        { value: "band", label: "Band", price: 80 },
        { value: "v-neck", label: "V-Neck", price: 60 },
      ],
    },
    {
      id: "length",
      label: "Length",
      type: "card",
      options: [
        { value: "short", label: "Short", price: 0 },
        { value: "knee", label: "Knee Length", price: 0 },
        { value: "long", label: "Long", price: 150 },
      ],
    },
    _fit,
    _colorGroup,
    _monogram,
  ],
  "custom-kurtas": null,
  // ---- Dresses ----
  dresses: [
    _fabric([
      { value: "chiffon", label: "Chiffon", note: "Flowy", price: 300 },
      { value: "satin", label: "Satin", price: 350 },
    ]),
    {
      id: "neckline",
      label: "Neckline",
      type: "card",
      options: [
        { value: "round", label: "Round", price: 0 },
        { value: "sweetheart", label: "Sweetheart", price: 120 },
        { value: "halter", label: "Halter", price: 150 },
        { value: "off-shoulder", label: "Off-Shoulder", price: 180 },
      ],
    },
    {
      id: "length",
      label: "Length",
      type: "card",
      options: [
        { value: "mini", label: "Mini", price: 0 },
        { value: "midi", label: "Midi", price: 0 },
        { value: "maxi", label: "Maxi", price: 200 },
      ],
    },
    {
      id: "sleeve",
      label: "Sleeve",
      type: "card",
      options: [
        { value: "sleeveless", label: "Sleeveless", price: 0 },
        { value: "short", label: "Short", price: 0 },
        { value: "full", label: "Full", price: 100 },
      ],
    },
    _fit,
    _colorGroup,
    _monogram,
  ],
  "custom-dresses": null,
  tops: [
    _fabric(),
    {
      id: "neck",
      label: "Neckline",
      type: "card",
      options: [
        { value: "round", label: "Round", price: 0 },
        { value: "v-neck", label: "V-Neck", price: 0 },
        { value: "boat", label: "Boat Neck", price: 80 },
      ],
    },
    _fit,
    _colorGroup,
  ],
  // ---- Bottomwear ----
  trousers: [
    _fabric([{ value: "wool-blend", label: "Wool Blend", price: 300 }]),
    {
      id: "fit",
      label: "Fit",
      type: "card",
      options: [
        { value: "slim", label: "Slim", price: 0 },
        { value: "regular", label: "Regular", price: 0 },
        { value: "tapered", label: "Tapered", price: 80 },
      ],
    },
    {
      id: "length",
      label: "Length",
      type: "card",
      options: [
        { value: "ankle", label: "Ankle", price: 0 },
        { value: "full", label: "Full", price: 0 },
      ],
    },
    _colorGroup,
  ],
  jeans: [
    {
      id: "wash",
      label: "Wash",
      type: "card",
      options: [
        { value: "light", label: "Light Wash", price: 0 },
        { value: "dark", label: "Dark Wash", price: 0 },
        { value: "distressed", label: "Distressed", price: 200 },
      ],
    },
    {
      id: "fit",
      label: "Fit",
      type: "card",
      options: [
        { value: "skinny", label: "Skinny", price: 0 },
        { value: "slim", label: "Slim", price: 0 },
        { value: "straight", label: "Straight", price: 0 },
      ],
    },
    _colorGroup,
  ],
  // ---- Footwear ----
  footwear: [
    {
      id: "material",
      label: "Material",
      type: "card",
      options: [
        { value: "canvas", label: "Canvas", price: 0 },
        { value: "leather", label: "Leather", price: 400 },
        { value: "suede", label: "Suede", price: 350 },
      ],
    },
    {
      id: "sole",
      label: "Sole",
      type: "card",
      options: [
        { value: "rubber", label: "Rubber", price: 0 },
        { value: "cushioned", label: "Cushioned", price: 150 },
      ],
    },
    _colorGroup,
    _monogram,
  ],
  // ---- Accessories ----
  watches: [
    {
      id: "dial",
      label: "Dial",
      type: "card",
      options: [
        { value: "round", label: "Round", price: 0 },
        { value: "square", label: "Square", price: 0 },
      ],
    },
    {
      id: "strap-material",
      label: "Strap Material",
      type: "card",
      options: [
        { value: "leather", label: "Leather", price: 0 },
        { value: "metal", label: "Metal", price: 300 },
        { value: "silicone", label: "Silicone", price: 0 },
      ],
    },
    {
      id: "strap-color",
      label: "Strap Colour",
      type: "color",
      options: [
        { value: "Black", price: 0 },
        { value: "Brown", price: 0 },
        { value: "Navy", price: 0 },
      ],
    },
    _monogram,
  ],
  bags: [
    {
      id: "material",
      label: "Material",
      type: "card",
      options: [
        { value: "canvas", label: "Canvas", price: 0 },
        { value: "leather", label: "Leather", price: 500 },
        { value: "vegan-leather", label: "Vegan Leather", price: 250 },
      ],
    },
    {
      id: "size",
      label: "Size",
      type: "card",
      options: [
        { value: "small", label: "Small", price: 0 },
        { value: "medium", label: "Medium", price: 100 },
        { value: "large", label: "Large", price: 200 },
      ],
    },
    _colorGroup,
    _monogram,
  ],
  handbags: null, // same as bags
  jewellery: [
    {
      id: "metal",
      label: "Metal",
      type: "card",
      options: [
        { value: "gold-plated", label: "Gold Plated", price: 0 },
        { value: "silver", label: "Silver", price: 0 },
        { value: "rose-gold", label: "Rose Gold", price: 300 },
      ],
    },
    { id: "engraving", label: "Engraving", type: "text", price: 199, maxLength: 12 },
  ],
};
// Alias custom-* and handbags to their base schema
CUSTOMISATION_SCHEMA["custom-shirts"] = CUSTOMISATION_SCHEMA.shirts;
CUSTOMISATION_SCHEMA["custom-tshirts"] = CUSTOMISATION_SCHEMA["t-shirts"];
CUSTOMISATION_SCHEMA["custom-kurtas"] = CUSTOMISATION_SCHEMA.kurtas;
CUSTOMISATION_SCHEMA["custom-dresses"] = CUSTOMISATION_SCHEMA.dresses;
CUSTOMISATION_SCHEMA.handbags = CUSTOMISATION_SCHEMA.bags;

// Resolve the customisation groups for a product (by subcategory, else [])
function customisationGroupsFor(product) {
  if (!product) return [];
  return CUSTOMISATION_SCHEMA[product.subcategory] || [];
}
