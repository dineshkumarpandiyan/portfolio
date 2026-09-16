// ==============================================================
// Customization Engine (generic, product-agnostic)
// Single source of truth for the active product + selections.
// No category conditionals — driven entirely by product data.
// ==============================================================

const CustomizationEngine = (() => {
  let product;

  // One state object.
  const state = {
    productId: null,
    variants: {}, // { groupId: optionId }
    customization: {}, // { groupId: optionId }  (image/color/card groups)
    text: {}, // { groupId: string }     (text groups)
    textMeta: {}, // { groupId: { font, color } }
    uploads: {}, // { groupId: dataURL }    (upload groups)
    transform: {}, // { groupId: { dx, dy, scale, rotation } } for uploads
  };

  let initialState;

  function init(productData) {
    product = productData;
    state.productId = product.id;
    state.variants = {};
    state.customization = {};
    state.text = {};
    state.textMeta = {};
    state.uploads = {};
    state.transform = {};

    // Defaults: first option of each variant + each option-based custom group
    product.variants.forEach((g) => {
      state.variants[g.id] = g.options[0].id;
    });

    product.customization.groups.forEach((g) => {
      if (g.displayType === "text") {
        state.text[g.id] = "";
        state.textMeta[g.id] = {
          font: (g.config && g.config.defaultFont) || "sans-serif",
          color: (g.config && g.config.defaultColor) || "#111111",
        };
      } else if (g.displayType === "upload") {
        state.uploads[g.id] = null;
        state.transform[g.id] = { dx: 0, dy: 0, scale: 1, rotation: 0 };
      } else if (g.options && g.options.length) {
        state.customization[g.id] = g.options[0].id;
      }
    });

    initialState = JSON.parse(JSON.stringify(state));
  }

  function getProduct() {
    return product;
  }

  function selectVariant(groupId, optionId) {
    state.variants[groupId] = optionId;
  }
  function selectCustomization(groupId, optionId) {
    state.customization[groupId] = optionId;
  }

  function setText(groupId, value) {
    state.text[groupId] = value;
  }
  function setTextMeta(groupId, meta) {
    state.textMeta[groupId] = { ...state.textMeta[groupId], ...meta };
  }

  function setUpload(groupId, dataURL) {
    state.uploads[groupId] = dataURL;
    state.transform[groupId] = { dx: 0, dy: 0, scale: 1, rotation: 0 };
  }
  function clearUpload(groupId) {
    state.uploads[groupId] = null;
    state.transform[groupId] = { dx: 0, dy: 0, scale: 1, rotation: 0 };
  }
  function setTransform(groupId, patch) {
    state.transform[groupId] = { ...state.transform[groupId], ...patch };
  }

  function resetCustomization() {
    const fresh = JSON.parse(JSON.stringify(initialState));
    Object.keys(fresh).forEach((k) => {
      state[k] = fresh[k];
    });
    PreviewEngine.clearUploadCache();
  }

  // Structured cart item — customization stays attached (not a new SKU).
  function buildCartItem() {
    const pricing = calculateTotalPrice(product, state);
    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      variants: { ...state.variants },
      customization: { ...state.customization },
      personalization: {
        text: { ...state.text },
        textMeta: { ...state.textMeta },
        uploads: { ...state.uploads },
        transform: { ...state.transform },
      },
      basePrice: pricing.base,
      customizationPrice: pricing.variantsPrice + pricing.customizationPrice,
      totalPrice: pricing.total,
      currency: product.currency,
    };
  }

  return {
    state,
    init,
    getProduct,
    selectVariant,
    selectCustomization,
    setText,
    setTextMeta,
    setUpload,
    clearUpload,
    setTransform,
    resetCustomization,
    buildCartItem,
  };
})();
