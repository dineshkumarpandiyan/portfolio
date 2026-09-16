// ==============================================================
// Preview Engine (HTML5 Canvas, layered composition)
// --------------------------------------------------------------
// Draws a per-product vector PROTOTYPE (driven by product.preview.shape)
// and lets the current option selections visibly modify it — so each
// product looks distinct and options change the preview, even without
// real PNG assets.
//
// If a real asset.image loads, it is drawn instead of the prototype
// layer — no code change needed. Text + upload always render on top.
// ==============================================================

const PreviewEngine = (() => {
  const imageCache = new Map();
  const uploadImgCache = new Map();
  let canvas, ctx, getState, getProduct;

  function init(canvasEl, productGetter, stateGetter) {
    canvas = canvasEl;
    ctx = canvas.getContext("2d");
    getProduct = productGetter;
    getState = stateGetter;
  }

  function loadImage(src) {
    if (!src) return Promise.resolve(null);
    if (imageCache.has(src)) return Promise.resolve(imageCache.get(src));
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => { imageCache.set(src, img); resolve(img); };
      img.onerror = () => { imageCache.set(src, null); resolve(null); };
      img.src = src;
    });
  }

  function setUploadImage(groupId, img) {
    if (img) uploadImgCache.set(groupId, img); else uploadImgCache.delete(groupId);
  }
  function clearUploadCache() { uploadImgCache.clear(); }

  // ---------- selection helpers ----------
  function sel() {
    // Flattened { groupId: optionId } for customization + a helper for values.
    const state = getState();
    return state.customization || {};
  }
  function variantColor() {
    const p = getProduct(), s = getState();
    const g = p.variants.find((v) => v.type === "color");
    if (!g) return "#E9E4E0";
    const o = g.options.find((x) => x.id === s.variants[g.id]);
    return o ? o.value : "#E9E4E0";
  }
  // resolve a chosen option's `value` for a group (used for accent/stitch colours)
  function optionValue(groupId) {
    const p = getProduct(), s = getState();
    const g = p.customization.groups.find((x) => x.id === groupId);
    if (!g) return null;
    const o = g.options && g.options.find((x) => x.id === s.customization[groupId]);
    return o ? o.value || null : null;
  }
  function chosen(groupId) { return sel()[groupId]; }

  const STROKE = "#C9A9AF";
  const SHADE = "rgba(72,31,41,0.10)";

  function base(fill) { ctx.fillStyle = fill; ctx.strokeStyle = STROKE; ctx.lineWidth = 2.5; }

  // ============================================================
  // PROTOTYPES — one per product.preview.shape
  // Each receives (w, h) and reads current selections to adapt.
  // ============================================================
  const Prototypes = {
    shirt(w, h) {
      const fill = variantColor();
      const collar = chosen("collar");     // classic | spread | mandarin
      const french = chosen("cuff") === "french";
      const pattern = chosen("pattern");    // plain | checks | stripes
      const buttonCol = optionValue("buttons") || "#FBF7F4";
      const cx = w / 2;
      base(fill);
      // body + sleeves
      ctx.beginPath();
      ctx.moveTo(w * 0.3, h * 0.24);
      ctx.lineTo(w * 0.12, h * 0.34);
      ctx.lineTo(w * 0.2, h * 0.52);
      ctx.lineTo(w * 0.24, h * 0.5);
      ctx.lineTo(w * 0.24, h * 0.86);
      ctx.lineTo(w * 0.76, h * 0.86);
      ctx.lineTo(w * 0.76, h * 0.5);
      ctx.lineTo(w * 0.8, h * 0.52);
      ctx.lineTo(w * 0.88, h * 0.34);
      ctx.lineTo(w * 0.7, h * 0.24);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // pattern fill (clipped to body)
      if (pattern && pattern !== "plain") {
        ctx.save();
        ctx.beginPath(); ctx.rect(w * 0.24, h * 0.26, w * 0.52, h * 0.6); ctx.clip();
        ctx.strokeStyle = "rgba(72,31,41,0.18)"; ctx.lineWidth = 1;
        if (pattern === "stripes") {
          for (let x = w * 0.24; x < w * 0.76; x += 14) { ctx.beginPath(); ctx.moveTo(x, h * 0.26); ctx.lineTo(x, h * 0.86); ctx.stroke(); }
        } else {
          for (let x = w * 0.24; x < w * 0.76; x += 18) { ctx.beginPath(); ctx.moveTo(x, h * 0.26); ctx.lineTo(x, h * 0.86); ctx.stroke(); }
          for (let y = h * 0.26; y < h * 0.86; y += 18) { ctx.beginPath(); ctx.moveTo(w * 0.24, y); ctx.lineTo(w * 0.76, y); ctx.stroke(); }
        }
        ctx.restore();
      }
      // placket
      ctx.strokeStyle = SHADE; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(cx, h * 0.28); ctx.lineTo(cx, h * 0.84); ctx.stroke();
      // collar
      base(fill); ctx.lineWidth = 2.5;
      if (collar === "mandarin") {
        ctx.beginPath();
        ctx.moveTo(w * 0.4, h * 0.24); ctx.lineTo(cx, h * 0.3); ctx.lineTo(w * 0.6, h * 0.24);
        ctx.lineTo(w * 0.58, h * 0.18); ctx.lineTo(w * 0.42, h * 0.18); ctx.closePath();
        ctx.fill(); ctx.stroke();
      } else {
        const spread = collar === "spread" ? 0.16 : 0.1;
        ctx.beginPath(); ctx.moveTo(cx, h * 0.26); ctx.lineTo(w * (0.5 - spread), h * 0.18); ctx.lineTo(w * 0.42, h * 0.3); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, h * 0.26); ctx.lineTo(w * (0.5 + spread), h * 0.18); ctx.lineTo(w * 0.58, h * 0.3); ctx.closePath(); ctx.fill(); ctx.stroke();
      }
      // cuffs
      const cuffH = french ? h * 0.06 : h * 0.035;
      ctx.fillStyle = fill; ctx.strokeStyle = STROKE;
      ctx.fillRect(w * 0.12, h * 0.5, w * 0.08, cuffH); ctx.strokeRect(w * 0.12, h * 0.5, w * 0.08, cuffH);
      ctx.fillRect(w * 0.8, h * 0.5, w * 0.08, cuffH); ctx.strokeRect(w * 0.8, h * 0.5, w * 0.08, cuffH);
      // buttons
      ctx.fillStyle = buttonCol; ctx.strokeStyle = "rgba(0,0,0,0.15)"; ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) { const y = h * 0.36 + i * h * 0.1; ctx.beginPath(); ctx.arc(cx, y, 4, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
    },

    tshirt(w, h) {
      const fill = variantColor();
      const neck = chosen("neck"); // round | vneck
      const oversized = chosen("fit") === "oversized";
      const bodyW = oversized ? 0.58 : 0.5;
      const lx = (1 - bodyW) / 2, rx = 1 - lx;
      base(fill);
      // sleeves + body
      ctx.beginPath();
      ctx.moveTo(w * 0.34, h * 0.2);
      ctx.lineTo(w * 0.12, h * 0.3);
      ctx.lineTo(w * 0.2, h * 0.44);
      ctx.lineTo(w * (lx + 0.04), h * 0.36);
      ctx.lineTo(w * (lx + 0.04), h * 0.82);
      ctx.lineTo(w * (rx - 0.04), h * 0.82);
      ctx.lineTo(w * (rx - 0.04), h * 0.36);
      ctx.lineTo(w * 0.8, h * 0.44);
      ctx.lineTo(w * 0.88, h * 0.3);
      ctx.lineTo(w * 0.66, h * 0.2);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // neckline
      ctx.beginPath();
      if (neck === "vneck") {
        ctx.moveTo(w * 0.42, h * 0.2); ctx.lineTo(w * 0.5, h * 0.32); ctx.lineTo(w * 0.58, h * 0.2);
      } else {
        ctx.moveTo(w * 0.42, h * 0.2); ctx.quadraticCurveTo(w * 0.5, h * 0.28, w * 0.58, h * 0.2);
      }
      ctx.strokeStyle = STROKE; ctx.lineWidth = 3; ctx.stroke();
      if (chosen("print") === "graphic") badge(w * 0.5, h * 0.55, "ART");
    },

    kurti(w, h) {
      const fill = variantColor();
      const long = chosen("length") === "long";
      const bottom = long ? 0.92 : 0.74;
      const vneck = chosen("neckline") === "vneck";
      const threeQ = chosen("sleeve") === "three-quarter";
      base(fill);
      ctx.beginPath();
      ctx.moveTo(w * 0.36, h * 0.18);
      ctx.lineTo(w * 0.16, h * (threeQ ? 0.5 : 0.34));
      ctx.lineTo(w * 0.22, h * (threeQ ? 0.54 : 0.4));
      ctx.lineTo(w * 0.3, h * 0.4);
      ctx.lineTo(w * 0.26, h * bottom);
      ctx.lineTo(w * 0.74, h * bottom);
      ctx.lineTo(w * 0.7, h * 0.4);
      ctx.lineTo(w * 0.78, h * (threeQ ? 0.54 : 0.4));
      ctx.lineTo(w * 0.84, h * (threeQ ? 0.5 : 0.34));
      ctx.lineTo(w * 0.64, h * 0.18);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      if (vneck) { ctx.moveTo(w * 0.44, h * 0.18); ctx.lineTo(w * 0.5, h * 0.32); ctx.lineTo(w * 0.56, h * 0.18); }
      else { ctx.moveTo(w * 0.44, h * 0.18); ctx.quadraticCurveTo(w * 0.5, h * 0.26, w * 0.56, h * 0.18); }
      ctx.lineWidth = 3; ctx.stroke();
      if (chosen("embroidery") === "floral") { ctx.fillStyle = "#B98"; flower(w * 0.5, h * 0.5); }
    },

    dress(w, h) {
      const fill = variantColor();
      const flare = chosen("fit") === "fit-flare";
      const puff = chosen("sleeve") === "puff";
      const square = chosen("neckline") === "square";
      base(fill);
      ctx.beginPath();
      ctx.moveTo(w * 0.38, h * 0.18);
      ctx.lineTo(w * (puff ? 0.2 : 0.24), h * (puff ? 0.34 : 0.3));
      ctx.lineTo(w * 0.3, h * 0.4);
      if (flare) { ctx.lineTo(w * 0.34, h * 0.5); ctx.lineTo(w * 0.18, h * 0.9); ctx.lineTo(w * 0.82, h * 0.9); ctx.lineTo(w * 0.66, h * 0.5); }
      else { ctx.lineTo(w * 0.3, h * 0.9); ctx.lineTo(w * 0.7, h * 0.9); }
      ctx.lineTo(w * 0.7, h * 0.4);
      ctx.lineTo(w * (puff ? 0.8 : 0.76), h * (puff ? 0.34 : 0.3));
      ctx.lineTo(w * 0.62, h * 0.18);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      if (square) { ctx.moveTo(w * 0.44, h * 0.18); ctx.lineTo(w * 0.44, h * 0.26); ctx.lineTo(w * 0.56, h * 0.26); ctx.lineTo(w * 0.56, h * 0.18); }
      else { ctx.moveTo(w * 0.44, h * 0.18); ctx.quadraticCurveTo(w * 0.5, h * 0.27, w * 0.56, h * 0.18); }
      ctx.lineWidth = 3; ctx.stroke();
    },

    jeans(w, h) {
      const light = chosen("wash") === "light";
      const fill = light ? "#9DB4D6" : "#3E5C86";
      const stitch = optionValue("stitching") || "#2563EB";
      base(fill);
      ctx.beginPath();
      ctx.moveTo(w * 0.32, h * 0.16);
      ctx.lineTo(w * 0.68, h * 0.16);
      ctx.lineTo(w * 0.7, h * 0.4);
      ctx.lineTo(w * 0.56, h * 0.9);
      ctx.lineTo(w * 0.44, h * 0.9);
      ctx.lineTo(w * 0.5, h * 0.5);
      ctx.lineTo(w * 0.44, h * 0.9);
      ctx.lineTo(w * 0.32, h * 0.9);
      ctx.lineTo(w * 0.3, h * 0.4);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // stitching accents
      ctx.strokeStyle = stitch; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5;
      ctx.strokeRect(w * 0.34, h * 0.2, w * 0.32, h * 0.06);
      ctx.setLineDash([]);
      if (chosen("distressing") === "light") { ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.beginPath(); ctx.moveTo(w * 0.4, h * 0.5); ctx.lineTo(w * 0.46, h * 0.52); ctx.stroke(); }
    },

    shoe(w, h) {
      const s = getState();
      const baseCol = (s.variants["base-color"] === "black") ? "#2B2B2B" : "#F3F1EE";
      const soleSport = chosen("sole") === "sport";
      const lace = optionValue ? null : null;
      const laceCol = chosen("laces") === "red" ? "#DC2626" : "#FFFFFF";
      const accent = optionValue("accent") || "#DC2626";
      base(baseCol);
      // upper
      ctx.beginPath();
      ctx.moveTo(w * 0.2, h * 0.62);
      ctx.quadraticCurveTo(w * 0.24, h * 0.4, w * 0.5, h * 0.4);
      ctx.quadraticCurveTo(w * 0.74, h * 0.42, w * 0.82, h * 0.6);
      ctx.lineTo(w * 0.82, h * 0.66);
      ctx.lineTo(w * 0.2, h * 0.66);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // accent swoosh
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.moveTo(w * 0.3, h * 0.62); ctx.quadraticCurveTo(w * 0.55, h * 0.46, w * 0.72, h * 0.6);
      ctx.lineTo(w * 0.68, h * 0.64); ctx.quadraticCurveTo(w * 0.54, h * 0.54, w * 0.34, h * 0.64);
      ctx.closePath(); ctx.fill();
      // laces
      ctx.strokeStyle = laceCol; ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) { const y = h * (0.46 + i * 0.04); ctx.beginPath(); ctx.moveTo(w * 0.4, y); ctx.lineTo(w * 0.56, y + h * 0.02); ctx.stroke(); }
      // sole
      ctx.fillStyle = soleSport ? "#C45C72" : "#DAD5D0";
      ctx.strokeStyle = STROKE; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.18, h * 0.66);
      ctx.lineTo(w * 0.84, h * 0.66);
      ctx.lineTo(w * 0.82, h * (soleSport ? 0.76 : 0.72));
      ctx.lineTo(w * 0.2, h * (soleSport ? 0.76 : 0.72));
      ctx.closePath(); ctx.fill(); ctx.stroke();
    },

    bag(w, h) {
      const body = optionValue("body-color") || "#A16207";
      const longStrap = chosen("strap") === "long";
      const hardware = chosen("hardware") === "gold" ? "#D4AF37" : "#C0C0C0";
      base(body);
      // body
      ctx.beginPath();
      ctx.moveTo(w * 0.3, h * 0.42);
      ctx.lineTo(w * 0.7, h * 0.42);
      ctx.lineTo(w * 0.74, h * 0.78);
      ctx.lineTo(w * 0.26, h * 0.78);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // strap
      ctx.strokeStyle = body; ctx.lineWidth = 6; ctx.beginPath();
      if (longStrap) { ctx.moveTo(w * 0.32, h * 0.42); ctx.quadraticCurveTo(w * 0.5, h * 0.08, w * 0.68, h * 0.42); }
      else { ctx.moveTo(w * 0.38, h * 0.42); ctx.quadraticCurveTo(w * 0.5, h * 0.26, w * 0.62, h * 0.42); }
      ctx.stroke();
      // hardware clasp
      ctx.fillStyle = hardware; ctx.beginPath(); ctx.arc(w * 0.5, h * 0.5, 6, 0, Math.PI * 2); ctx.fill();
    },

    cap(w, h) {
      const col = optionValue("cap-color") || "#111111";
      base(col);
      // crown
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.52, w * 0.2, Math.PI, 0);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // brim
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.52);
      ctx.quadraticCurveTo(w * 0.86, h * 0.5, w * 0.86, h * 0.6);
      ctx.quadraticCurveTo(w * 0.7, h * 0.58, w * 0.5, h * 0.58);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      if (chosen("patch") === "minimal") { ctx.fillStyle = "#FBF7F4"; ctx.fillRect(w * 0.44, h * 0.4, w * 0.12, h * 0.06); }
    },

    necklace(w, h) {
      const gold = chosen("material") === "gold";
      const metal = gold ? "#D4AF37" : "#C7C7C7";
      const heart = chosen("pendant") === "heart";
      ctx.strokeStyle = metal; ctx.lineWidth = 3;
      // chain
      ctx.beginPath();
      ctx.moveTo(w * 0.3, h * 0.28);
      ctx.quadraticCurveTo(w * 0.5, h * 0.62, w * 0.7, h * 0.28);
      ctx.stroke();
      // pendant
      ctx.fillStyle = metal;
      if (heart) {
        const cx = w * 0.5, cy = h * 0.56;
        ctx.beginPath();
        ctx.moveTo(cx, cy + 10);
        ctx.bezierCurveTo(cx + 14, cy - 6, cx + 6, cy - 16, cx, cy - 8);
        ctx.bezierCurveTo(cx - 6, cy - 16, cx - 14, cy - 6, cx, cy + 10);
        ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(w * 0.5, h * 0.56, 12, 0, Math.PI * 2); ctx.fill();
      }
    },
  };

  function badge(x, y, text) {
    ctx.save();
    ctx.fillStyle = "rgba(72,31,41,0.85)";
    ctx.font = "700 22px 'Poppins', sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
    ctx.restore();
  }
  function flower(x, y) {
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * 10, y + Math.sin(a) * 10, 6, 3, a, 0, Math.PI * 2); ctx.fill();
    }
  }

  // ---------- text + upload (always on top) ----------
  function drawText(w, h, group) {
    const s = getState();
    const val = s.text[group.id];
    if (!val) return;
    const meta = s.textMeta[group.id] || {};
    const fam = meta.font === "serif" ? "Georgia, serif" : "'Poppins', sans-serif";
    ctx.save();
    ctx.fillStyle = meta.color || "#111";
    ctx.font = `700 ${Math.round(h * 0.04)}px ${fam}`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(val, w * 0.5, h * 0.5);
    ctx.restore();
  }
  function drawUpload(w, h, group) {
    const s = getState();
    const img = uploadImgCache.get(group.id);
    if (!img) return;
    const area = (group.config && group.config.printableArea) || { x: 25, y: 25, width: 50, height: 50 };
    const ax = w * (area.x / 100), ay = h * (area.y / 100), aw = w * (area.width / 100), ah = h * (area.height / 100);
    const t = s.transform[group.id] || { dx: 0, dy: 0, scale: 1, rotation: 0 };
    ctx.save();
    ctx.beginPath(); ctx.rect(ax, ay, aw, ah); ctx.clip();
    const bs = Math.min(aw / img.width, ah / img.height);
    const dw = img.width * bs * t.scale, dh = img.height * bs * t.scale;
    ctx.translate(ax + aw / 2 + t.dx, ay + ah / 2 + t.dy);
    ctx.rotate((t.rotation || 0) * Math.PI / 180);
    ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
    ctx.save(); ctx.strokeStyle = "rgba(196,92,114,0.5)"; ctx.setLineDash([6, 4]); ctx.strokeRect(ax, ay, aw, ah); ctx.restore();
  }

  // ---------- render ----------
  async function render() {
    if (!ctx) return;
    const product = getProduct();
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // 1) If any real base/option images exist, draw them layered.
    //    Otherwise draw the vector prototype for this product.
    const shape = product.preview && product.preview.shape;
    const proto = Prototypes[shape];

    // Attempt real option images first (layered). Track if any drew.
    let drewRealImage = false;
    const state = getState();
    const layered = [];
    product.customization.groups.forEach((g) => {
      if (g.displayType === "text" || g.displayType === "upload") return;
      const oid = state.customization[g.id];
      const opt = g.options && g.options.find((o) => o.id === oid);
      if (opt && opt.asset && opt.asset.image) layered.push({ layer: opt.asset.layer || 30, src: opt.asset.image });
    });
    layered.sort((a, b) => a.layer - b.layer);

    // Draw prototype as the base look (fast, always available).
    if (proto) proto(w, h);

    // Overlay any real images that happen to exist (progressive enhancement).
    for (const l of layered) {
      const img = await loadImage(l.src);
      if (img) { ctx.drawImage(img, 0, 0, w, h); drewRealImage = true; }
    }

    // Personalization on top
    product.customization.groups.forEach((g) => {
      if (g.displayType === "text") drawText(w, h, g);
      if (g.displayType === "upload") drawUpload(w, h, g);
    });

    void drewRealImage;
  }

  return { init, render, loadImage, setUploadImage, clearUploadCache };
})();
