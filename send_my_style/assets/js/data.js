// ==============================
// SendMyStyle — Product Catalog + Store
// Single source of truth for products, options, and cart.
// ==============================

const PRODUCTS = [
    { id: "oxford-shirt", name: "Classic Oxford Shirt", seller: "Urban Thread", price: 1299, mrp: 1899, category: "men", customizable: true, colors: ["White", "Blue"], sizes: ["S", "M", "L", "XL"], rating: 4.5,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=70",
      gallery: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=60", "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=300&q=60", "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=300&q=60"],
      description: "A timeless oxford shirt crafted from breathable cotton. Personalize the collar, cuffs, buttons and color to make it uniquely yours before it's made to order." },
    { id: "cotton-tee", name: "Relaxed Cotton Tee", seller: "Everyday Co.", price: 699, mrp: 999, category: "men", customizable: true, colors: ["White", "Black", "Pink"], sizes: ["S", "M", "L"], rating: 4.2,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=70", gallery: [],
      description: "Soft, breathable everyday tee. Add your color and print to make it your own." },
    { id: "summer-dress", name: "Floral Summer Dress", seller: "Bloom Studio", price: 1599, mrp: 2299, category: "women", customizable: false, colors: ["Pink", "Yellow"], sizes: ["XS", "S", "M", "L"], rating: 4.6,
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=70", gallery: [],
      description: "A breezy floral dress perfect for warm days. Flowy silhouette with a flattering fit." },
    { id: "sneakers", name: "Everyday Sneakers", seller: "Stride Lab", price: 2199, mrp: 2999, category: "footwear", customizable: false, colors: ["White", "Black"], sizes: ["7", "8", "9", "10"], rating: 4.4,
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=70", gallery: [],
      description: "Cushioned, versatile sneakers built for all-day comfort." },
    { id: "linen-shirt", name: "Linen Casual Shirt", seller: "Coastal", price: 1499, mrp: 2199, category: "men", customizable: true, colors: ["White", "Beige"], sizes: ["M", "L", "XL"], rating: 4.3,
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=70", gallery: [],
      description: "Lightweight linen shirt for effortless style. Customize color and fit before you buy." },
    { id: "denim-jacket", name: "Denim Jacket", seller: "Rugged Co.", price: 2499, mrp: 3499, category: "men", customizable: false, colors: ["Blue"], sizes: ["M", "L", "XL"], rating: 4.1,
      image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=600&q=70", gallery: [],
      description: "A rugged denim jacket that layers over everything. Built to last." },
    { id: "knit-sweater", name: "Knit Sweater", seller: "Warm & Co.", price: 1799, mrp: 2499, category: "women", customizable: true, colors: ["Pink", "Beige"], sizes: ["S", "M", "L"], rating: 4.5,
      image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=600&q=70", gallery: [],
      description: "Cozy knit sweater in a relaxed fit. Choose your color to match your mood." },
    { id: "chino-trousers", name: "Chino Trousers", seller: "Everyday Co.", price: 1399, mrp: 1999, category: "men", customizable: false, colors: ["Beige", "Black"], sizes: ["30", "32", "34", "36"], rating: 4.0,
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=70", gallery: [],
      description: "Smart-casual chinos with a tailored fit. A wardrobe essential." },
    { id: "silk-saree", name: "Handwoven Silk Saree", seller: "Bloom Studio", price: 3499, mrp: 4999, category: "women", customizable: true, colors: ["Pink", "Maroon"], sizes: ["Free"], rating: 4.8,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=70", gallery: [],
      description: "An elegant handwoven silk saree. Choose your border and palette to personalize it." },
    { id: "kids-tshirt", name: "Kids Graphic Tee", seller: "Tiny Trends", price: 499, mrp: 799, category: "kids", customizable: true, colors: ["Yellow", "Blue"], sizes: ["2-3Y", "4-5Y", "6-7Y"], rating: 4.3,
      image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=600&q=70", gallery: [],
      description: "Fun graphic tee for kids. Add their name or favourite print." },
    { id: "kids-frock", name: "Party Frock", seller: "Tiny Trends", price: 999, mrp: 1499, category: "kids", customizable: false, colors: ["Pink"], sizes: ["2-3Y", "4-5Y"], rating: 4.6,
      image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=600&q=70", gallery: [],
      description: "A twirl-worthy party frock for little ones." },
    { id: "lip-kit", name: "Matte Lip Kit", seller: "Glow Lab", price: 899, mrp: 1299, category: "beauty", customizable: false, colors: ["Pink", "Maroon"], sizes: ["Free"], rating: 4.4,
      image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=70", gallery: [],
      description: "Long-wear matte lip kit in flattering shades." },
    { id: "face-serum", name: "Vitamin C Serum", seller: "Glow Lab", price: 749, mrp: 1099, category: "beauty", customizable: false, colors: [], sizes: ["30ml"], rating: 4.7,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=70", gallery: [],
      description: "Brightening vitamin C serum for a healthy glow." },
    { id: "leather-loafers", name: "Leather Loafers", seller: "Stride Lab", price: 2899, mrp: 3999, category: "footwear", customizable: false, colors: ["Black", "Beige"], sizes: ["7", "8", "9", "10", "11"], rating: 4.2,
      image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=600&q=70", gallery: [],
      description: "Premium leather loafers for a sharp, polished look." },
    { id: "hoodie", name: "Fleece Hoodie", seller: "Warm & Co.", price: 1699, mrp: 2399, category: "men", customizable: true, colors: ["Black", "Maroon"], sizes: ["S", "M", "L", "XL"], rating: 4.5,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=70", gallery: [],
      description: "Warm fleece hoodie. Customize the color and add your own text." },
    { id: "maxi-dress", name: "Ruffled Maxi Dress", seller: "Bloom Studio", price: 2099, mrp: 2999, category: "women", customizable: false, colors: ["Yellow", "White"], sizes: ["XS", "S", "M", "L", "XL"], rating: 4.4,
      image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=600&q=70", gallery: [],
      description: "A flowing ruffled maxi dress for standout moments." },
];

// Derived filter facets (unique values from the catalog)
const FACETS = {
    category: ["men", "women", "kids", "beauty", "footwear"],
    get brands() { return [...new Set(PRODUCTS.map((p) => p.seller))].sort(); },
    get colors() { return [...new Set(PRODUCTS.flatMap((p) => p.colors))].sort(); },
    priceRanges: [
        { label: "Under ₹1,000", min: 0, max: 999 },
        { label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
        { label: "₹2,000 – ₹3,000", min: 2000, max: 3000 },
        { label: "Above ₹3,000", min: 3000, max: Infinity },
    ],
};

// Customization options — each option carries a price delta.
const CUSTOMIZE_OPTIONS = {
    color: {
        label: "Fabric Color",
        type: "color",
        choices: [
            { label: "White", value: "#FFFFFF", delta: 0 },
            { label: "Rose", value: "#C45C72", delta: 100 },
            { label: "Maroon", value: "#481F29", delta: 100 },
            { label: "Wine", value: "#6B2D3B", delta: 150 },
            { label: "Blush", value: "#D78494", delta: 100 },
        ],
    },
    collar: {
        label: "Collar",
        type: "tile",
        choices: [
            { label: "Classic", delta: 0 },
            { label: "Button-down", delta: 120 },
            { label: "Mandarin", delta: 150 },
        ],
    },
    cuff: {
        label: "Cuff",
        type: "tile",
        choices: [
            { label: "Rounded", delta: 0 },
            { label: "Square", delta: 80 },
            { label: "French", delta: 200 },
        ],
    },
    buttons: {
        label: "Buttons",
        type: "tile",
        choices: [
            { label: "Pearl White", delta: 0 },
            { label: "Matte Black", delta: 90 },
            { label: "Wooden", delta: 130 },
        ],
    },
};

function getProduct(id) {
    return PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
}

function formatPrice(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
}

// ------------------------------
// Cart store (localStorage)
// ------------------------------
const CART_KEY = "sms_cart";

const Cart = {
    all() {
        try {
            return JSON.parse(localStorage.getItem(CART_KEY)) || [];
        } catch (e) {
            return [];
        }
    },
    save(items) {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    },
    add(item) {
        const items = Cart.all();
        items.push(item);
        Cart.save(items);
    },
    removeAt(index) {
        const items = Cart.all();
        items.splice(index, 1);
        Cart.save(items);
    },
    setQty(index, qty) {
        const items = Cart.all();
        if (items[index]) {
            items[index].qty = Math.max(1, qty);
            Cart.save(items);
        }
    },
    count() {
        return Cart.all().reduce((n, i) => n + (i.qty || 1), 0);
    },
    subtotal() {
        return Cart.all().reduce((sum, i) => sum + i.price * (i.qty || 1), 0);
    },
};
