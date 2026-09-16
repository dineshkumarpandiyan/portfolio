// ==============================================================
// SendMyStyle — Product Customization Catalog (MOCK DATA)
// --------------------------------------------------------------
// Generic schema shared by every product. The engine renders
// whatever `customization.groups` describes — no category logic.
//
// displayType per group: "image" | "color" | "card" | "text" | "upload"
// Groups may carry options[] (image/color/card) or config{} (text/upload).
//
// REAL DATA: replace this file's data with the NestJS API response
// (same shape). Drop real PNG layers at the asset.image paths;
// preview-engine.js falls back to styled placeholders until then.
// ==============================================================

const shirtProduct = {
  id: "shirt-001",
  slug: "premium-custom-shirt",
  name: "Premium Custom Shirt",
  category: "Shirts",
  description: "A timeless shirt you can personalize — collar, cuff, pattern, buttons and monogram.",
  basePrice: 1499,
  currency: "INR",
  thumbnail: "assets/products/shirt/thumbnail.png",
  images: ["assets/products/shirt/front.png", "assets/products/shirt/back.png"],
  preview: { shape: "shirt" },
  isCustomizable: true,
  variants: [
    {
      id: "color",
      name: "Color",
      type: "color",
      required: true,
      options: [
        { id: "white", name: "White", price: 0, value: "#FFFFFF" },
        { id: "blush", name: "Blush", price: 0, value: "#F1CBD3" },
        { id: "rose", name: "Rose", price: 0, value: "#C45C72" },
        { id: "wine", name: "Wine", price: 0, value: "#6B2D3B" },
        { id: "navy", name: "Navy", price: 0, value: "#2D2A45" },
      ],
    },
    {
      id: "size",
      name: "Size",
      type: "select",
      required: true,
      options: [
        { id: "S", name: "S", price: 0 },
        { id: "M", name: "M", price: 0 },
        { id: "L", name: "L", price: 0 },
        { id: "XL", name: "XL", price: 0 },
      ],
    },
    {
      id: "fit",
      name: "Fit",
      type: "select",
      required: true,
      options: [
        { id: "slim", name: "Slim", price: 0 },
        { id: "regular", name: "Regular", price: 0 },
        { id: "relaxed", name: "Relaxed", price: 100 },
      ],
    },
  ],
  customization: {
    enabled: true,
    groups: [
      {
        id: "collar",
        name: "Collar",
        description: "Choose your collar style",
        displayType: "image",
        required: true,
        options: [
          {
            id: "classic",
            name: "Classic",
            price: 0,
            description: "A timeless collar",
            asset: { image: "assets/products/shirt/collars/classic.png", layer: 50 },
          },
          {
            id: "spread",
            name: "Spread",
            price: 150,
            description: "A modern wider collar",
            asset: { image: "assets/products/shirt/collars/spread.png", layer: 50 },
          },
          {
            id: "mandarin",
            name: "Mandarin",
            price: 180,
            description: "Band collar, no fold",
            asset: { image: "assets/products/shirt/collars/mandarin.png", layer: 50 },
          },
        ],
      },
      {
        id: "cuff",
        name: "Cuff",
        description: "Pick your cuff finish",
        displayType: "image",
        required: true,
        options: [
          {
            id: "normal",
            name: "Normal",
            price: 0,
            description: "Standard button cuff",
            asset: { image: "assets/products/shirt/cuffs/normal.png", layer: 40 },
          },
          {
            id: "french",
            name: "French",
            price: 200,
            description: "Elegant folded cuff",
            asset: { image: "assets/products/shirt/cuffs/french.png", layer: 40 },
          },
        ],
      },
      {
        id: "pattern",
        name: "Pattern",
        description: "Add a fabric pattern",
        displayType: "image",
        required: false,
        options: [
          { id: "plain", name: "Plain", price: 0, description: "Solid fabric", asset: { image: null, layer: 20 } },
          {
            id: "checks",
            name: "Checks",
            price: 120,
            description: "Classic checks",
            asset: { image: "assets/products/shirt/patterns/checks.png", layer: 20 },
          },
          {
            id: "stripes",
            name: "Stripes",
            price: 120,
            description: "Vertical stripes",
            asset: { image: "assets/products/shirt/patterns/stripes.png", layer: 20 },
          },
        ],
      },
      {
        id: "buttons",
        name: "Buttons",
        description: "Choose button colour",
        displayType: "color",
        required: true,
        options: [
          { id: "pearl", name: "Pearl White", price: 0, value: "#FBF7F4", asset: { image: null, layer: 60 } },
          { id: "black", name: "Matte Black", price: 50, value: "#241B1F", asset: { image: null, layer: 60 } },
          { id: "wooden", name: "Wooden", price: 80, value: "#9A6A4B", asset: { image: null, layer: 60 } },
        ],
      },
      {
        id: "monogram",
        name: "Monogram",
        description: "Add your initials",
        displayType: "text",
        required: false,
        config: {
          maxLength: 4,
          price: 99,
          placeholder: "e.g. DK",
          fontOptions: ["sans-serif", "serif"],
          defaultFont: "serif",
          defaultColor: "#481F29",
          layer: 70,
        },
        options: [],
      },
      {
        id: "upload-design",
        name: "Upload Your Design",
        description: "Upload your own artwork",
        displayType: "upload",
        required: false,
        config: {
          acceptedTypes: ["image/png", "image/jpeg", "image/webp"],
          maxFileSizeMB: 5,
          price: 149,
          printableArea: { x: 34, y: 34, width: 32, height: 30 },
          layer: 80,
        },
        options: [],
      },
    ],
  },
};

const tshirtProduct = {
  id: "tshirt-001",
  slug: "classic-custom-tshirt",
  name: "Classic Custom T-Shirt",
  category: "T-Shirts",
  description: "A premium everyday t-shirt that you can personalize with your own style.",
  basePrice: 799,
  currency: "INR",
  thumbnail: "assets/products/tshirt/thumbnail.png",
  images: ["assets/products/tshirt/front.png", "assets/products/tshirt/back.png"],
  preview: { shape: "tshirt" }, // placeholder prototype until real PNGs exist
  isCustomizable: true,
  variants: [
    {
      id: "color",
      name: "Color",
      type: "color",
      required: true,
      options: [
        { id: "white", name: "White", price: 0, value: "#FFFFFF" },
        { id: "black", name: "Black", price: 0, value: "#111111" },
        { id: "navy", name: "Navy", price: 0, value: "#172554" },
      ],
    },
    {
      id: "size",
      name: "Size",
      type: "select",
      required: true,
      options: [
        { id: "S", name: "S", price: 0 },
        { id: "M", name: "M", price: 0 },
        { id: "L", name: "L", price: 0 },
        { id: "XL", name: "XL", price: 0 },
      ],
    },
  ],
  customization: {
    enabled: true,
    groups: [
      {
        id: "neck",
        name: "Neck",
        description: "Choose your neckline",
        displayType: "image",
        required: true,
        options: [
          {
            id: "round",
            name: "Round Neck",
            price: 0,
            description: "Classic round neckline",
            asset: { image: "assets/products/tshirt/neck/round.png", layer: 30 },
          },
          {
            id: "vneck",
            name: "V-Neck",
            price: 100,
            description: "Modern V neckline",
            asset: { image: "assets/products/tshirt/neck/vneck.png", layer: 30 },
          },
        ],
      },
      {
        id: "fit",
        name: "Fit",
        description: "Choose your preferred fit",
        displayType: "card",
        required: true,
        options: [
          { id: "regular", name: "Regular Fit", price: 0, description: "Comfortable everyday fit" },
          { id: "oversized", name: "Oversized", price: 150, description: "Relaxed oversized silhouette" },
        ],
      },
      {
        id: "print",
        name: "Print",
        description: "Choose a print for your t-shirt",
        displayType: "image",
        required: false,
        options: [
          {
            id: "none",
            name: "No Print",
            price: 0,
            description: "Clean plain finish",
            asset: { image: null, layer: 40 },
          },
          {
            id: "graphic",
            name: "Graphic",
            price: 200,
            description: "Minimal graphic print",
            asset: { image: "assets/products/tshirt/prints/graphic.png", layer: 40 },
          },
        ],
      },
      {
        id: "personalization",
        name: "Your Text",
        description: "Add your own text",
        displayType: "text",
        required: false,
        config: {
          maxLength: 20,
          placeholder: "Enter your text",
          fontOptions: ["sans-serif", "serif"],
          defaultFont: "sans-serif",
          defaultColor: "#111111",
          layer: 50,
        },
        options: [],
      },
      {
        id: "upload-design",
        name: "Upload Your Design",
        description: "Upload your own artwork",
        displayType: "upload",
        required: false,
        config: {
          acceptedTypes: ["image/png", "image/jpeg", "image/webp"],
          maxFileSizeMB: 5,
          maxWidth: 1200,
          maxHeight: 1200,
          printableArea: { x: 25, y: 20, width: 50, height: 55 },
          layer: 60,
        },
        options: [],
      },
    ],
  },
};

const kurtiProduct = {
  id: "kurti-001",
  slug: "custom-everyday-kurti",
  name: "Custom Everyday Kurti",
  category: "Kurtis",
  description: "A versatile kurti with customizable neckline, sleeves and length.",
  basePrice: 1299,
  currency: "INR",
  thumbnail: "assets/products/kurti/thumbnail.png",
  images: ["assets/products/kurti/front.png", "assets/products/kurti/back.png"],
  preview: { shape: "kurti" },
  isCustomizable: true,
  variants: [
    {
      id: "size",
      name: "Size",
      type: "select",
      required: true,
      options: [
        { id: "S", name: "S", price: 0 },
        { id: "M", name: "M", price: 0 },
        { id: "L", name: "L", price: 0 },
        { id: "XL", name: "XL", price: 0 },
      ],
    },
    {
      id: "color",
      name: "Color",
      type: "color",
      required: true,
      options: [
        { id: "maroon", name: "Maroon", price: 0, value: "#7F1D1D" },
        { id: "black", name: "Black", price: 0, value: "#111111" },
        { id: "green", name: "Green", price: 0, value: "#166534" },
      ],
    },
  ],
  customization: {
    enabled: true,
    groups: [
      {
        id: "neckline",
        name: "Neckline",
        description: "Choose your neckline style",
        displayType: "image",
        required: true,
        options: [
          {
            id: "round",
            name: "Round",
            price: 0,
            asset: { image: "assets/products/kurti/neckline/round.png", layer: 30 },
          },
          {
            id: "vneck",
            name: "V-Neck",
            price: 100,
            asset: { image: "assets/products/kurti/neckline/vneck.png", layer: 30 },
          },
        ],
      },
      {
        id: "sleeve",
        name: "Sleeve",
        description: "Choose sleeve style",
        displayType: "image",
        required: true,
        options: [
          {
            id: "short",
            name: "Short Sleeve",
            price: 0,
            asset: { image: "assets/products/kurti/sleeves/short.png", layer: 40 },
          },
          {
            id: "three-quarter",
            name: "3/4 Sleeve",
            price: 100,
            asset: { image: "assets/products/kurti/sleeves/three-quarter.png", layer: 40 },
          },
        ],
      },
      {
        id: "length",
        name: "Length",
        description: "Choose kurti length",
        displayType: "card",
        required: true,
        options: [
          { id: "short", name: "Short", price: 0, description: "Above-knee length" },
          { id: "long", name: "Long", price: 200, description: "Long traditional silhouette" },
        ],
      },
      {
        id: "embroidery",
        name: "Embroidery",
        description: "Add an embroidered detail",
        displayType: "image",
        required: false,
        options: [
          { id: "none", name: "None", price: 0, asset: { image: null, layer: 50 } },
          {
            id: "floral",
            name: "Floral",
            price: 300,
            asset: { image: "assets/products/kurti/embroidery/floral.png", layer: 50 },
          },
        ],
      },
    ],
  },
};

const shoeProduct = {
  id: "shoe-001",
  slug: "custom-street-sneaker",
  name: "Custom Street Sneaker",
  category: "Shoes",
  description: "A customizable sneaker designed around your colors and details.",
  basePrice: 2499,
  currency: "INR",
  thumbnail: "assets/products/shoes/thumbnail.png",
  images: ["assets/products/shoes/front.png", "assets/products/shoes/side.png"],
  preview: { shape: "shoe" },
  isCustomizable: true,
  variants: [
    {
      id: "size",
      name: "Size",
      type: "select",
      required: true,
      options: [
        { id: "6", name: "UK 6", price: 0 },
        { id: "7", name: "UK 7", price: 0 },
        { id: "8", name: "UK 8", price: 0 },
        { id: "9", name: "UK 9", price: 0 },
        { id: "10", name: "UK 10", price: 0 },
      ],
    },
    {
      id: "base-color",
      name: "Base Color",
      type: "color",
      required: true,
      options: [
        { id: "white", name: "White", price: 0, value: "#FFFFFF" },
        { id: "black", name: "Black", price: 0, value: "#111111" },
      ],
    },
  ],
  customization: {
    enabled: true,
    groups: [
      {
        id: "laces",
        name: "Laces",
        description: "Choose your lace color",
        displayType: "image",
        required: true,
        options: [
          {
            id: "white",
            name: "White",
            price: 0,
            asset: { image: "assets/products/shoes/laces/white.png", layer: 30 },
          },
          { id: "red", name: "Red", price: 100, asset: { image: "assets/products/shoes/laces/red.png", layer: 30 } },
        ],
      },
      {
        id: "sole",
        name: "Sole",
        description: "Choose sole style",
        displayType: "image",
        required: true,
        options: [
          {
            id: "classic",
            name: "Classic",
            price: 0,
            asset: { image: "assets/products/shoes/sole/classic.png", layer: 20 },
          },
          {
            id: "sport",
            name: "Sport",
            price: 250,
            asset: { image: "assets/products/shoes/sole/sport.png", layer: 20 },
          },
        ],
      },
      {
        id: "accent",
        name: "Accent Color",
        description: "Choose your accent color",
        displayType: "color",
        required: true,
        options: [
          {
            id: "white",
            name: "White",
            price: 0,
            value: "#FFFFFF",
            asset: { image: "assets/products/shoes/accent/white.png", layer: 40 },
          },
          {
            id: "red",
            name: "Red",
            price: 100,
            value: "#DC2626",
            asset: { image: "assets/products/shoes/accent/red.png", layer: 40 },
          },
        ],
      },
      {
        id: "initials",
        name: "Initials",
        description: "Add your initials",
        displayType: "text",
        required: false,
        config: { maxLength: 3, placeholder: "DK", defaultFont: "sans-serif", defaultColor: "#111111", layer: 50 },
        options: [],
      },
    ],
  },
};

const jeansProduct = {
  id: "jeans-001",
  slug: "custom-straight-jeans",
  name: "Custom Straight Jeans",
  category: "Jeans",
  description: "Build your own denim look with wash, distressing and stitching options.",
  basePrice: 1899,
  currency: "INR",
  thumbnail: "assets/products/jeans/thumbnail.png",
  images: ["assets/products/jeans/front.png", "assets/products/jeans/back.png"],
  preview: { shape: "jeans" },
  isCustomizable: true,
  variants: [
    {
      id: "waist",
      name: "Waist",
      type: "select",
      required: true,
      options: [
        { id: "28", name: "28", price: 0 },
        { id: "30", name: "30", price: 0 },
        { id: "32", name: "32", price: 0 },
        { id: "34", name: "34", price: 0 },
      ],
    },
    {
      id: "length",
      name: "Length",
      type: "select",
      required: true,
      options: [
        { id: "30", name: "30", price: 0 },
        { id: "32", name: "32", price: 0 },
        { id: "34", name: "34", price: 0 },
      ],
    },
  ],
  customization: {
    enabled: true,
    groups: [
      {
        id: "wash",
        name: "Wash",
        description: "Choose your denim wash",
        displayType: "image",
        required: true,
        options: [
          {
            id: "dark",
            name: "Dark Wash",
            price: 0,
            asset: { image: "assets/products/jeans/wash/dark.png", layer: 20 },
          },
          {
            id: "light",
            name: "Light Wash",
            price: 0,
            asset: { image: "assets/products/jeans/wash/light.png", layer: 20 },
          },
        ],
      },
      {
        id: "distressing",
        name: "Distressing",
        description: "Choose your distressing level",
        displayType: "image",
        required: false,
        options: [
          { id: "none", name: "Clean", price: 0, asset: { image: null, layer: 30 } },
          {
            id: "light",
            name: "Light Distress",
            price: 150,
            asset: { image: "assets/products/jeans/distressing/light.png", layer: 30 },
          },
        ],
      },
      {
        id: "stitching",
        name: "Stitch Color",
        description: "Choose your stitching color",
        displayType: "color",
        required: true,
        options: [
          {
            id: "blue",
            name: "Blue",
            price: 0,
            value: "#2563EB",
            asset: { image: "assets/products/jeans/stitching/blue.png", layer: 40 },
          },
          {
            id: "contrast",
            name: "Contrast",
            price: 100,
            value: "#F59E0B",
            asset: { image: "assets/products/jeans/stitching/contrast.png", layer: 40 },
          },
        ],
      },
    ],
  },
};

const dressProduct = {
  id: "dress-001",
  slug: "custom-midi-dress",
  name: "Custom Midi Dress",
  category: "Dresses",
  description: "Create your own midi dress by choosing neckline, sleeves and silhouette.",
  basePrice: 2299,
  currency: "INR",
  thumbnail: "assets/products/dress/thumbnail.png",
  images: ["assets/products/dress/front.png", "assets/products/dress/back.png"],
  preview: { shape: "dress" },
  isCustomizable: true,
  variants: [
    {
      id: "size",
      name: "Size",
      type: "select",
      required: true,
      options: [
        { id: "XS", name: "XS", price: 0 },
        { id: "S", name: "S", price: 0 },
        { id: "M", name: "M", price: 0 },
        { id: "L", name: "L", price: 0 },
      ],
    },
    {
      id: "color",
      name: "Color",
      type: "color",
      required: true,
      options: [
        { id: "black", name: "Black", price: 0, value: "#111111" },
        { id: "wine", name: "Wine", price: 0, value: "#881337" },
      ],
    },
  ],
  customization: {
    enabled: true,
    groups: [
      {
        id: "neckline",
        name: "Neckline",
        description: "Choose your neckline",
        displayType: "image",
        required: true,
        options: [
          {
            id: "round",
            name: "Round",
            price: 0,
            asset: { image: "assets/products/dress/neckline/round.png", layer: 30 },
          },
          {
            id: "square",
            name: "Square",
            price: 150,
            asset: { image: "assets/products/dress/neckline/square.png", layer: 30 },
          },
        ],
      },
      {
        id: "sleeve",
        name: "Sleeves",
        description: "Choose sleeve style",
        displayType: "image",
        required: true,
        options: [
          {
            id: "short",
            name: "Short Sleeve",
            price: 0,
            asset: { image: "assets/products/dress/sleeves/short.png", layer: 40 },
          },
          {
            id: "puff",
            name: "Puff Sleeve",
            price: 200,
            asset: { image: "assets/products/dress/sleeves/puff.png", layer: 40 },
          },
        ],
      },
      {
        id: "fit",
        name: "Silhouette",
        description: "Choose your dress silhouette",
        displayType: "card",
        required: true,
        options: [
          { id: "a-line", name: "A-Line", price: 0, description: "Classic flowing silhouette" },
          { id: "fit-flare", name: "Fit & Flare", price: 250, description: "Fitted upper with a flowing skirt" },
        ],
      },
    ],
  },
};

const bagProduct = {
  id: "bag-001",
  slug: "custom-everyday-tote",
  name: "Custom Everyday Tote",
  category: "Bags",
  description: "Personalize your everyday tote with colors, straps and monogram details.",
  basePrice: 1599,
  currency: "INR",
  thumbnail: "assets/products/bag/thumbnail.png",
  images: ["assets/products/bag/front.png", "assets/products/bag/side.png"],
  preview: { shape: "bag" },
  isCustomizable: true,
  variants: [
    {
      id: "size",
      name: "Size",
      type: "select",
      required: true,
      options: [
        { id: "small", name: "Small", price: 0 },
        { id: "medium", name: "Medium", price: 200 },
        { id: "large", name: "Large", price: 400 },
      ],
    },
  ],
  customization: {
    enabled: true,
    groups: [
      {
        id: "body-color",
        name: "Bag Color",
        description: "Choose the main bag color",
        displayType: "color",
        required: true,
        options: [
          {
            id: "tan",
            name: "Tan",
            price: 0,
            value: "#A16207",
            asset: { image: "assets/products/bag/colors/tan.png", layer: 20 },
          },
          {
            id: "black",
            name: "Black",
            price: 0,
            value: "#111111",
            asset: { image: "assets/products/bag/colors/black.png", layer: 20 },
          },
        ],
      },
      {
        id: "strap",
        name: "Strap",
        description: "Choose your strap style",
        displayType: "image",
        required: true,
        options: [
          {
            id: "short",
            name: "Short Handle",
            price: 0,
            asset: { image: "assets/products/bag/straps/short.png", layer: 30 },
          },
          {
            id: "long",
            name: "Long Strap",
            price: 200,
            asset: { image: "assets/products/bag/straps/long.png", layer: 30 },
          },
        ],
      },
      {
        id: "hardware",
        name: "Hardware",
        description: "Choose hardware finish",
        displayType: "image",
        required: true,
        options: [
          {
            id: "gold",
            name: "Gold",
            price: 150,
            asset: { image: "assets/products/bag/hardware/gold.png", layer: 40 },
          },
          {
            id: "silver",
            name: "Silver",
            price: 100,
            asset: { image: "assets/products/bag/hardware/silver.png", layer: 40 },
          },
        ],
      },
      {
        id: "monogram",
        name: "Monogram",
        description: "Add your initials",
        displayType: "text",
        required: false,
        config: {
          maxLength: 3,
          placeholder: "Your initials",
          defaultFont: "serif",
          defaultColor: "#111111",
          layer: 50,
        },
        options: [],
      },
    ],
  },
};

const capProduct = {
  id: "cap-001",
  slug: "custom-classic-cap",
  name: "Custom Classic Cap",
  category: "Caps",
  description: "Create your own cap with colors, embroidery and personalization.",
  basePrice: 699,
  currency: "INR",
  thumbnail: "assets/products/cap/thumbnail.png",
  images: ["assets/products/cap/front.png", "assets/products/cap/side.png"],
  preview: { shape: "cap" },
  isCustomizable: true,
  variants: [
    {
      id: "size",
      name: "Size",
      type: "select",
      required: true,
      options: [
        { id: "S-M", name: "S-M", price: 0 },
        { id: "M-L", name: "M-L", price: 0 },
      ],
    },
  ],
  customization: {
    enabled: true,
    groups: [
      {
        id: "cap-color",
        name: "Cap Color",
        description: "Choose your cap color",
        displayType: "color",
        required: true,
        options: [
          {
            id: "black",
            name: "Black",
            price: 0,
            value: "#111111",
            asset: { image: "assets/products/cap/colors/black.png", layer: 20 },
          },
          {
            id: "beige",
            name: "Beige",
            price: 0,
            value: "#D6D3D1",
            asset: { image: "assets/products/cap/colors/beige.png", layer: 20 },
          },
        ],
      },
      {
        id: "embroidery",
        name: "Embroidery",
        description: "Add embroidered text",
        displayType: "text",
        required: false,
        config: {
          maxLength: 12,
          placeholder: "Enter text",
          defaultFont: "sans-serif",
          defaultColor: "#111111",
          layer: 40,
        },
        options: [],
      },
      {
        id: "patch",
        name: "Front Patch",
        description: "Choose a front patch",
        displayType: "image",
        required: false,
        options: [
          { id: "none", name: "None", price: 0, asset: { image: null, layer: 30 } },
          {
            id: "minimal",
            name: "Minimal",
            price: 150,
            asset: { image: "assets/products/cap/patches/minimal.png", layer: 30 },
          },
        ],
      },
    ],
  },
};

const necklaceProduct = {
  id: "necklace-001",
  slug: "custom-minimal-necklace",
  name: "Custom Minimal Necklace",
  category: "Necklaces",
  description: "Personalize your necklace with pendant, chain and engraving options.",
  basePrice: 999,
  currency: "INR",
  thumbnail: "assets/products/necklace/thumbnail.png",
  images: ["assets/products/necklace/front.png"],
  preview: { shape: "necklace" },
  isCustomizable: true,
  variants: [
    {
      id: "chain-length",
      name: "Chain Length",
      type: "select",
      required: true,
      options: [
        { id: "16", name: "16 inch", price: 0 },
        { id: "18", name: "18 inch", price: 100 },
        { id: "20", name: "20 inch", price: 200 },
      ],
    },
  ],
  customization: {
    enabled: true,
    groups: [
      {
        id: "material",
        name: "Material",
        description: "Choose your finish",
        displayType: "image",
        required: true,
        options: [
          {
            id: "silver",
            name: "Silver",
            price: 0,
            asset: { image: "assets/products/necklace/material/silver.png", layer: 20 },
          },
          {
            id: "gold",
            name: "Gold",
            price: 400,
            asset: { image: "assets/products/necklace/material/gold.png", layer: 20 },
          },
        ],
      },
      {
        id: "pendant",
        name: "Pendant",
        description: "Choose your pendant",
        displayType: "image",
        required: true,
        options: [
          {
            id: "circle",
            name: "Circle",
            price: 0,
            asset: { image: "assets/products/necklace/pendants/circle.png", layer: 30 },
          },
          {
            id: "heart",
            name: "Heart",
            price: 150,
            asset: { image: "assets/products/necklace/pendants/heart.png", layer: 30 },
          },
        ],
      },
      {
        id: "engraving",
        name: "Engraving",
        description: "Add a personal engraving",
        displayType: "text",
        required: false,
        config: {
          maxLength: 12,
          placeholder: "Enter name or initials",
          defaultFont: "serif",
          defaultColor: "#111111",
          layer: 40,
        },
        options: [],
      },
    ],
  },
};

// Exposed catalog — replace with NestJS API response later (same shape).
const products = [
  shirtProduct,
  tshirtProduct,
  kurtiProduct,
  shoeProduct,
  jeansProduct,
  dressProduct,
  bagProduct,
  capProduct,
  necklaceProduct,
];

// Helper: resolve a product by id or slug (falls back to first).
function getCatalogProduct(idOrSlug) {
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug) || products[0];
}
