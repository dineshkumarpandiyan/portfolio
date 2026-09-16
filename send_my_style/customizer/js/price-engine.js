// ==============================================================
// Price Engine (generic)
// Base + variant deltas + customization deltas.
// Handles all displayTypes:
//   image | color | card  -> priced via the selected option
//   text                  -> priced only when text entered (group.config.price || 0)
//   upload                -> priced only when an image is uploaded (group.config.price || 0)
// Pure functions — no DOM.
// ==============================================================

function findVariantOption(product, groupId, optionId) {
  const group = product.variants.find((v) => v.id === groupId);
  return group ? group.options.find((o) => o.id === optionId) : null;
}

function findCustomOption(group, optionId) {
  return group.options ? group.options.find((o) => o.id === optionId) : null;
}

// state = { variants:{gid:oid}, customization:{gid:oid}, text:{gid:str}, uploads:{gid:dataURL} , textMeta:{gid:{font,color}}, transform:{gid:{...}} }
function calculateTotalPrice(product, state) {
  const lines = [];
  let variantsPrice = 0;
  let customizationPrice = 0;

  // Variants
  Object.entries(state.variants || {}).forEach(([gid, oid]) => {
    const opt = findVariantOption(product, gid, oid);
    if (opt) {
      variantsPrice += opt.price || 0;
      lines.push({ type: "variant", group: gid, groupName: groupName(product.variants, gid), label: opt.name, price: opt.price || 0 });
    }
  });

  // Customization groups
  product.customization.groups.forEach((group) => {
    if (group.displayType === "text") {
      const val = (state.text || {})[group.id];
      if (val) {
        const price = (group.config && group.config.price) || 0;
        customizationPrice += price;
        lines.push({ type: "text", group: group.id, groupName: group.name, label: `“${val}”`, price });
      }
    } else if (group.displayType === "upload") {
      const up = (state.uploads || {})[group.id];
      if (up) {
        const price = (group.config && group.config.price) || 0;
        customizationPrice += price;
        lines.push({ type: "upload", group: group.id, groupName: group.name, label: "Uploaded design", price });
      }
    } else {
      const oid = (state.customization || {})[group.id];
      const opt = oid ? findCustomOption(group, oid) : null;
      if (opt) {
        customizationPrice += opt.price || 0;
        lines.push({ type: "customization", group: group.id, groupName: group.name, label: opt.name, price: opt.price || 0 });
      }
    }
  });

  return {
    base: product.basePrice,
    variantsPrice,
    customizationPrice,
    total: product.basePrice + variantsPrice + customizationPrice,
    lines,
  };
}

function groupName(groups, id) {
  const g = groups.find((x) => x.id === id);
  return g ? g.name : id;
}

function formatINR(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}
