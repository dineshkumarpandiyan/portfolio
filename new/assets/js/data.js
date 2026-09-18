// ==============================
// SendMyStyle — Global Data
// ==============================

// Seed user profile. Actual login state is managed by Auth (auth.js /
// localStorage). This just supplies default name + addresses on login.
const CURRENT_USER = {
  name: "Dinesh Kumar",
  addresses: [
    {
      label: "Home",
      line: "12/4 Anna Nagar, 2nd Street",
      city: "Chennai",
      pincode: "600040",
    },
    {
      label: "Work",
      line: "Tidel Park, Taramani",
      city: "Chennai",
      pincode: "600113",
    },
  ],
};

// Trending searches (shown in the search dropdown before typing)
const TRENDING_SEARCHES = [
  "Custom shirts",
  "Silk saree",
  "Sneakers",
  "Kurta set",
  "Summer dress",
  "Formal trousers",
  "Watches",
];

// Top bar rotating offers
const OFFER_MESSAGES = [
  "Free shipping on orders above ₹999",
  "Flat 15% OFF on your first custom order — code FIRST15",
  "New Arrivals just dropped — Explore the latest styles",
];

// Main navigation + mega menu categories
const NAV_MENU = [
  {
    label: "Men",
    href: "#",
    columns: [
      {
        title: "Topwear",
        links: ["T-Shirts", "Casual Shirts", "Formal Shirts", "Kurtas", "Sweatshirts", "Jackets"],
      },
      {
        title: "Bottomwear",
        links: ["Jeans", "Casual Trousers", "Formal Trousers", "Shorts", "Track Pants"],
      },
      {
        title: "Ethnic",
        links: ["Kurta Sets", "Sherwani", "Nehru Jackets", "Dhoti"],
      },
      {
        title: "Footwear",
        links: ["Casual Shoes", "Sports Shoes", "Sneakers", "Sandals", "Formal Shoes"],
      },
    ],
    featured: {
      title: "Custom Tailoring",
      text: "Design your own shirt",
      href: "#",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80",
    },
    showcase: [
      {
        label: "Shirts",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80",
      },
      {
        label: "Ethnic",
        image: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?auto=format&fit=crop&w=300&q=80",
      },
      {
        label: "Sneakers",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80",
      },
    ],
  },
  {
    label: "Women",
    href: "#",
    columns: [
      {
        title: "Indian Wear",
        links: ["Sarees", "Kurtas & Suits", "Lehenga Cholis", "Dupattas", "Blouses"],
      },
      {
        title: "Western Wear",
        links: ["Dresses", "Tops", "Jeans", "Trousers", "Skirts", "Co-ords"],
      },
      {
        title: "Footwear",
        links: ["Flats", "Heels", "Casual Shoes", "Sneakers", "Sandals"],
      },
      {
        title: "Accessories",
        links: ["Handbags", "Jewellery", "Watches", "Sunglasses", "Scarves"],
      },
    ],
    featured: {
      title: "Made For You",
      text: "Customise your dress fit",
      href: "#",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80",
    },
    showcase: [
      {
        label: "Sarees",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80",
      },
      {
        label: "Dresses",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=300&q=80",
      },
      {
        label: "Handbags",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80",
      },
    ],
  },
  {
    label: "Kids",
    href: "#",
    columns: [
      {
        title: "Boys",
        links: ["T-Shirts", "Shirts", "Jeans", "Ethnic Wear", "Shorts"],
      },
      {
        title: "Girls",
        links: ["Dresses", "Tops", "Frocks", "Ethnic Wear", "Leggings"],
      },
      {
        title: "Infants",
        links: ["Bodysuits", "Rompers", "Sets", "Sleepwear"],
      },
      {
        title: "Footwear & Toys",
        links: ["Casual Shoes", "Sandals", "School Shoes", "Toys"],
      },
    ],
    featured: {
      title: "Little Trends",
      text: "Fresh styles for kids",
      href: "#",
      image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=500&q=80",
    },
    showcase: [
      {
        label: "Boys",
        image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=300&q=80",
      },
      {
        label: "Girls",
        image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=300&q=80",
      },
    ],
  },
  {
    label: "Accessories",
    href: "#",
    columns: [
      {
        title: "Bags & Wallets",
        links: ["Backpacks", "Handbags", "Wallets", "Laptop Bags", "Clutches"],
      },
      {
        title: "Watches & Jewellery",
        links: ["Analog Watches", "Smart Watches", "Earrings", "Necklaces", "Rings"],
      },
      {
        title: "Others",
        links: ["Sunglasses", "Belts", "Caps & Hats", "Socks", "Scarves"],
      },
    ],
    featured: {
      title: "Complete the Look",
      text: "Bags, watches & more",
      href: "#",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80",
    },
    showcase: [
      {
        label: "Watches",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=300&q=80",
      },
      {
        label: "Bags",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=300&q=80",
      },
      {
        label: "Sunglasses",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=300&q=80",
      },
    ],
  },
  {
    label: "Brands",
    href: "#",
    type: "brands",
    groups: [
      {
        title: "Featured Sellers",
        icon: "bx-star",
        sellers: [
          {
            name: "Atelier Nord",
            tag: "Premium Tailoring",
            initials: "AN",
            image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=120&q=80",
          },
          {
            name: "Kanchi Weaves",
            tag: "Handloom Sarees",
            initials: "KW",
            image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=120&q=80",
          },
          {
            name: "Urban Thread",
            tag: "Streetwear",
            initials: "UT",
            image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=120&q=80",
          },
          {
            name: "Maison Rue",
            tag: "Luxury Ethnic",
            initials: "MR",
            image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=120&q=80",
          },
        ],
      },
      {
        title: "Best Sellers",
        icon: "bx-trending-up",
        sellers: [
          {
            name: "DenimCo",
            tag: "12k+ orders",
            initials: "DC",
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=120&q=80",
          },
          {
            name: "SilkStory",
            tag: "9.8k+ orders",
            initials: "SS",
            image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=120&q=80",
          },
          {
            name: "FitForm",
            tag: "8.5k+ orders",
            initials: "FF",
            image: "https://images.unsplash.com/photo-1517191434949-5e90cd67d2b6?auto=format&fit=crop&w=120&q=80",
          },
          {
            name: "LoomLine",
            tag: "7.2k+ orders",
            initials: "LL",
            image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=120&q=80",
          },
        ],
      },
      {
        title: "Newly Onboarded",
        icon: "bx-badge-check",
        sellers: [
          {
            name: "Craft & Co",
            tag: "Joined this week",
            initials: "CC",
            image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=120&q=80",
          },
          {
            name: "Verve Studio",
            tag: "New partner",
            initials: "VS",
            image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=120&q=80",
          },
          {
            name: "Neo Ethnic",
            tag: "New partner",
            initials: "NE",
            image: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?auto=format&fit=crop&w=120&q=80",
          },
          {
            name: "PureCotton",
            tag: "New partner",
            initials: "PC",
            image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=120&q=80",
          },
        ],
      },
    ],
    featured: {
      title: "Become a Seller",
      text: "Onboard your brand on SendMyStyle",
      href: "#",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=80",
    },
  },
  {
    label: "Customise",
    href: "#",
    highlight: true,
    columns: [
      {
        title: "Apparel",
        links: ["Custom Shirts", "Custom T-Shirts", "Custom Kurtas", "Custom Dresses"],
      },
      {
        title: "Personalise",
        links: ["Fabric & Color", "Collar & Cuffs", "Fit & Size", "Embroidery", "Monogram"],
      },
      {
        title: "How It Works",
        links: ["Design Studio", "Size Guide", "Fabric Library", "Track Your Order"],
      },
    ],
    featured: {
      title: "Design Studio",
      text: "Make it truly yours",
      href: "#",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=500&q=80",
    },
  },
];

// ==============================
// Footer content
// ==============================

// Trust badges (top strip)
const FOOTER_TRUST = [
  { icon: "bx-cut", title: "Made to Measure", text: "Tailored to your fit" },
  { icon: "bx-shield-quarter", title: "100% Secure", text: "Safe & trusted payments" },
  { icon: "bx-revision", title: "Easy Returns", text: "7-day return policy" },
  { icon: "bx-badge-check", title: "Quality Assured", text: "Verified sellers only" },
];

// Link columns
const FOOTER_LINKS = [
  {
    title: "Shop",
    links: ["Men", "Women", "Kids", "Accessories", "New Arrivals", "Best Sellers"],
  },
  {
    title: "Customise",
    links: ["Design Studio", "Custom Shirts", "Fabric Library", "Size Guide", "How It Works"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Sustainability", "Blog"],
  },
  {
    title: "Help",
    links: ["Contact Us", "Track Order", "Shipping", "Returns & Refunds", "FAQs"],
  },
  {
    title: "Sell With Us",
    links: ["Become a Seller", "Seller Login", "Partner Support", "Seller Policies"],
  },
];

// Social links
const FOOTER_SOCIAL = [
  { icon: "bxl-instagram", label: "Instagram", href: "#" },
  { icon: "bxl-facebook", label: "Facebook", href: "#" },
  { icon: "bxl-twitter", label: "Twitter", href: "#" },
  { icon: "bxl-youtube", label: "YouTube", href: "#" },
  { icon: "bxl-pinterest", label: "Pinterest", href: "#" },
];

// Bottom policy links
const FOOTER_POLICIES = ["Terms of Use", "Privacy Policy", "Cookie Policy", "Sitemap"];

// Popular searches (SEO / discovery link cloud, Nykaa style)
const FOOTER_POPULAR = [
  "Men's Shirts",
  "Custom T-Shirts",
  "Women's Kurtas",
  "Designer Sarees",
  "Kids Ethnic Wear",
  "Formal Trousers",
  "Custom Suits",
  "Sneakers",
  "Handloom Fabrics",
  "Wedding Sherwani",
  "Casual Dresses",
  "Tailored Blazers",
  "Embroidered Kurtis",
  "Linen Shirts",
  "Co-ord Sets",
  "Made to Measure Shirts",
  "Silk Sarees",
  "Monogram Shirts",
  "Custom Collar Shirts",
  "Bespoke Suits",
];

// ==============================
// Home page content
// ==============================

// Hero carousel slides. First slide carries the core brand message so
// new users understand SendMyStyle immediately.
const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1920&q=80",
    label: "Find it. Make it. Wear it.",
    titleHtml: 'Fashion that<br />becomes <span class="text-sendmystyle-300">yours</span>.',
    text: "SendMyStyle is where you discover fashion and make it truly your own — customise the fabric, fit and details, and get it tailored to you.",
    primary: { text: "Explore Styles", to: {} },
    secondary: { text: "Start Customising", to: { category: "customise" }, icon: "bx-palette" },
    trust: ["Made to measure", "Verified sellers", "Easy returns"],
  },
  {
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1920&q=80",
    label: "New Season",
    titleHtml: 'New arrivals,<br />freshly <span class="text-sendmystyle-300">dropped</span>.',
    text: "Explore the latest styles from verified designers and sellers — updated every week.",
    primary: { text: "Shop New Arrivals", to: {} },
    secondary: { text: "View Lookbook", to: { category: "women" }, icon: "bx-book-open" },
    trust: ["Weekly drops", "Curated by experts"],
  },
  {
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1920&q=80",
    label: "Design Studio",
    titleHtml: 'Your design.<br />Your <span class="text-sendmystyle-300">signature</span>.',
    text: "Personalise fabric, collar, cuffs and fit in the Design Studio. Make something no one else has.",
    primary: { text: "Open Design Studio", to: { category: "customise" }, icon: "bx-palette" },
    secondary: { text: "How It Works", to: { category: "customise" } },
    trust: ["100% customisable", "Made just for you"],
  },
];

// Category quick links (circular row)
const HOME_CATEGORIES = [
  {
    label: "Men",
    cat: "men",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=200&q=80",
  },
  {
    label: "Women",
    cat: "women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=200&q=80",
  },
  {
    label: "Kids",
    cat: "kids",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=200&q=80",
  },
  {
    label: "Ethnic",
    cat: "men",
    sub: "kurtas",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80",
  },
  {
    label: "Footwear",
    cat: "men",
    sub: "footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80",
  },
  {
    label: "Accessories",
    cat: "accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=200&q=80",
  },
  {
    label: "Customise",
    cat: "customise",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=200&q=80",
  },
];

// "How it works" steps
const HOME_STEPS = [
  {
    icon: "bx-search-alt",
    step: "01",
    title: "Find It",
    text: "Browse curated fashion from verified sellers and designers across categories.",
  },
  {
    icon: "bx-palette",
    step: "02",
    title: "Make It",
    text: "Personalise fabric, fit, collar, colour and details in our Design Studio.",
  },
  {
    icon: "bx-package",
    step: "03",
    title: "Wear It",
    text: "Get your made-to-measure piece delivered, tailored exactly to you.",
  },
];

// ==============================
// Home — Featured Collections (editorial curated edits)
// ==============================
const HOME_COLLECTIONS = [
  {
    title: "The Wedding Edit",
    text: "Sherwanis, lehengas & custom ethnic",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80",
    href: "#",
    size: "large",
  },
  {
    title: "Workwear",
    text: "Tailored formals",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80",
    href: "#",
    size: "small",
  },
  {
    title: "Summer Linen",
    text: "Breathable & custom-fit",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    href: "#",
    size: "small",
  },
];

// Home — Trending products
const HOME_PRODUCTS = [
  {
    name: "Classic Oxford Shirt",
    seller: "Atelier Nord",
    price: 1499,
    mrp: 2199,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80",
    customizable: true,
  },
  {
    name: "Handwoven Silk Saree",
    seller: "Kanchi Weaves",
    price: 4999,
    mrp: 6500,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80",
    customizable: false,
  },
  {
    name: "Slim Fit Chinos",
    seller: "FitForm",
    price: 1299,
    mrp: 1899,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=500&q=80",
    customizable: true,
  },
  {
    name: "Floral Summer Dress",
    seller: "Verve Studio",
    price: 1899,
    mrp: 2499,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80",
    customizable: true,
  },
  {
    name: "Leather Sneakers",
    seller: "Urban Thread",
    price: 2499,
    mrp: 3499,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
    customizable: false,
  },
  {
    name: "Mandarin Collar Kurta",
    seller: "Neo Ethnic",
    price: 1699,
    mrp: 2299,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?auto=format&fit=crop&w=500&q=80",
    customizable: true,
  },
];

// Home — Style Tube (Tira Tube style video/reel content)
const HOME_TUBE = [
  {
    title: "How to style a custom shirt 3 ways",
    author: "SendMyStyle Studio",
    duration: "0:45",
    image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Choosing the right fabric for summer",
    author: "Atelier Nord",
    duration: "1:20",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Saree draping — modern edition",
    author: "Kanchi Weaves",
    duration: "2:10",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=500&q=80",
  },
  {
    title: "Behind a made-to-measure suit",
    author: "Maison Rue",
    duration: "1:35",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=500&q=80",
  },
];

// Home — Top Sellers spotlight
const HOME_SELLERS = [
  {
    name: "Atelier Nord",
    tag: "Premium Tailoring",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Kanchi Weaves",
    tag: "Handloom Sarees",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Urban Thread",
    tag: "Streetwear",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Maison Rue",
    tag: "Luxury Ethnic",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=400&q=80",
  },
];

// Home — Instagram Famous Brands (social-viral discovery)
const HOME_INSTA_BRANDS = [
  {
    name: "Urban Thread",
    handle: "@urbanthread",
    followers: "248K",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Verve Studio",
    handle: "@vervestudio",
    followers: "192K",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Maison Rue",
    handle: "@maisonrue",
    followers: "310K",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Neo Ethnic",
    handle: "@neoethnic",
    followers: "156K",
    image: "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Craft & Co",
    handle: "@craftandco",
    followers: "134K",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=600&q=80",
  },
];
