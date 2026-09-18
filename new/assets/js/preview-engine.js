// ==============================================================
// SendMyStyle — Preview Engine (Canvas vector composition)
// Draws a stylised garment from the current selection so sellers
// can see how customisation options render live. Vector placeholders
// (no real PNGs needed). Layers: base → pattern → cuff → collar →
// monogram → uploaded artwork.
// ==============================================================

const PreviewEngine = (() => {
  let canvas, ctx, W, H;

  const COLOR_HEX = {
    White: "#F4F4F4",
    Black: "#222222",
    Navy: "#26324A",
    Beige: "#D8C9A6",
    Maroon: "#6E2233",
    Green: "#2E5D46",
    Blue: "#2F5FB0",
    Brown: "#6B4A2B",
    Grey: "#9CA3AF",
    Pink: "#D01050",
    Mustard: "#C9992B",
  };
  const fill = (name) => COLOR_HEX[name] || "#D6D6D6";
  const shade = (hex, amt) => {
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) + amt,
      g = ((n >> 8) & 255) + amt,
      b = (n & 255) + amt;
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    return `rgb(${r},${g},${b})`;
  };

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext("2d");
    W = canvas.width;
    H = canvas.height;
  }

  // group "kind" by subcategory family
  function kindOf(sub) {
    if (["shirts", "custom-shirts"].includes(sub)) return "shirt";
    if (["t-shirts", "custom-tshirts", "tops"].includes(sub)) return "tshirt";
    if (["kurtas", "custom-kurtas"].includes(sub)) return "kurta";
    if (["dresses", "custom-dresses"].includes(sub)) return "dress";
    if (["trousers", "jeans"].includes(sub)) return "pants";
    if (sub === "footwear") return "shoe";
    if (sub === "watches") return "watch";
    if (["bags", "handbags"].includes(sub)) return "bag";
    if (sub === "jewellery") return "jewellery";
    return "generic";
  }

  // Public: render everything from a plain view-model
  // vm = { sub, color, selections{}, monogram, art:{img,x,y,scale,rotation} }
  function render(vm) {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#F5F5F5";
    ctx.fillRect(0, 0, W, H);

    const kind = kindOf(vm.sub);
    const base = fill(vm.color);

    ctx.save();
    ctx.translate(W / 2, 0);
    drawGarment(kind, base, vm.selections || {});
    ctx.restore();

    drawMonogram(vm.monogram);
    drawArt(vm.art);
  }

  // --- garment shapes (centered on x=0 after translate) ---
  function drawGarment(kind, base, sel) {
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    ctx.lineWidth = 3;

    if (kind === "shirt" || kind === "tshirt" || kind === "kurta") {
      drawTop(base, sel, kind);
    } else if (kind === "dress") {
      drawDress(base, sel);
    } else if (kind === "pants") {
      drawPants(base, sel);
    } else if (kind === "shoe") {
      drawShoe(base, sel);
    } else if (kind === "watch") {
      drawWatch(base, sel);
    } else if (kind === "bag") {
      drawBag(base);
    } else if (kind === "jewellery") {
      drawJewellery(base);
    } else {
      drawTop(base, sel, "tshirt");
    }
  }

  function drawTop(base, sel, kind) {
    const top = 150,
      shoulderY = 220;
    // Fit changes the body width + waist taper (visible in the vector)
    const fit = sel.fit || "regular";
    const bodyW = fit === "relaxed" ? 220 : fit === "slim" ? 165 : 190;
    const waistIn = fit === "slim" ? 34 : fit === "relaxed" ? 6 : 20;
    // Kurta length changes the hem
    let hemY = 640;
    if (kind === "kurta") hemY = sel.length === "long" ? 740 : sel.length === "short" ? 560 : 660;

    const g = ctx.createLinearGradient(-bodyW, 0, bodyW, 0);
    g.addColorStop(0, shade(base, -18));
    g.addColorStop(0.5, base);
    g.addColorStop(1, shade(base, -25));
    ctx.fillStyle = g;

    // sleeve length by selection
    const sleeveLen =
      kind === "shirt" || sel.sleeve === "full"
        ? 260
        : sel.sleeve === "half"
          ? 300
          : sel.sleeve === "short"
            ? 300
            : 270;
    ctx.beginPath();
    ctx.moveTo(-bodyW, shoulderY);
    ctx.lineTo(-bodyW - 90, shoulderY + 90);
    ctx.lineTo(-bodyW - 60, sleeveLen);
    ctx.lineTo(-bodyW + 10, sleeveLen - 30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(bodyW, shoulderY);
    ctx.lineTo(bodyW + 90, shoulderY + 90);
    ctx.lineTo(bodyW + 60, sleeveLen);
    ctx.lineTo(bodyW - 10, sleeveLen - 30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // cuffs (shirts)
    if (kind === "shirt") {
      ctx.fillStyle = shade(base, -30);
      const cuffH = sel.cuff === "double" ? 34 : 20;
      ctx.fillRect(-bodyW - 62, sleeveLen - cuffH, 62, cuffH);
      ctx.fillRect(bodyW, sleeveLen - cuffH, 62, cuffH);
      ctx.fillStyle = g;
    }

    // body — waist taper reflects the fit
    ctx.beginPath();
    ctx.moveTo(-bodyW, shoulderY);
    ctx.quadraticCurveTo(-bodyW + waistIn, (shoulderY + hemY) / 2, -bodyW + 20, hemY);
    ctx.lineTo(bodyW - 20, hemY);
    ctx.quadraticCurveTo(bodyW - waistIn, (shoulderY + hemY) / 2, bodyW, shoulderY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // pattern (stripes / checks) clipped to the body
    if (sel.pattern && sel.pattern !== "plain") {
      ctx.save();
      ctx.beginPath();
      ctx.rect(-bodyW, shoulderY, bodyW * 2, hemY - shoulderY);
      ctx.clip();
      ctx.strokeStyle = "rgba(0,0,0,0.14)";
      ctx.lineWidth = 1.5;
      for (let x = -bodyW; x < bodyW; x += 22) {
        ctx.beginPath();
        ctx.moveTo(x, shoulderY);
        ctx.lineTo(x, hemY);
        ctx.stroke();
      }
      if (sel.pattern === "checks")
        for (let y = shoulderY; y < hemY; y += 22) {
          ctx.beginPath();
          ctx.moveTo(-bodyW, y);
          ctx.lineTo(bodyW, y);
          ctx.stroke();
        }
      ctx.restore();
    }

    // collar / neckline
    ctx.fillStyle = shade(base, -28);
    const collar = sel.collar || sel.neck;
    if (kind === "shirt") {
      if (collar === "mandarin") {
        ctx.fillRect(-46, top, 92, 40);
      } else {
        const spread = collar === "spread" ? 66 : 52;
        ctx.beginPath();
        ctx.moveTo(-52, top);
        ctx.lineTo(-8, top + 70);
        ctx.lineTo(-spread, top + 60);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(52, top);
        ctx.lineTo(8, top + 70);
        ctx.lineTo(spread, top + 60);
        ctx.closePath();
        ctx.fill();
      }
      // placket + buttons
      ctx.strokeStyle = "rgba(0,0,0,0.18)";
      ctx.beginPath();
      ctx.moveTo(0, top + 40);
      ctx.lineTo(0, hemY - 20);
      ctx.stroke();
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      for (let y = top + 90; y < hemY - 40; y += 70) {
        ctx.beginPath();
        ctx.arc(0, y, 5, 0, 7);
        ctx.fill();
      }
    } else {
      // t-shirt / kurta neckline
      ctx.beginPath();
      if (collar === "v-neck") {
        ctx.moveTo(-40, top + 10);
        ctx.lineTo(0, top + 80);
        ctx.lineTo(40, top + 10);
      } else if (collar === "band" || collar === "polo") {
        ctx.rect(-42, top + 6, 84, 26);
      } else {
        ctx.arc(0, top + 20, 42, 0, Math.PI);
      }
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
  }

  function drawDress(base, sel) {
    const top = 160,
      shoulderY = 220,
      waistY = 400;
    const hemY = sel.length === "maxi" ? 760 : sel.length === "midi" ? 640 : 560;
    // Relaxed / maxi = fuller flare at the hem
    const flare = sel.fit === "relaxed" || sel.length === "maxi" ? 230 : 170;
    const puff = sel.sleeve === "full";
    const g = ctx.createLinearGradient(-flare, 0, flare, 0);
    g.addColorStop(0, shade(base, -18));
    g.addColorStop(0.5, base);
    g.addColorStop(1, shade(base, -25));
    ctx.fillStyle = g;
    // bodice + flared skirt
    ctx.beginPath();
    ctx.moveTo(-120, shoulderY);
    ctx.lineTo(-70, waistY);
    ctx.lineTo(-flare, hemY);
    ctx.quadraticCurveTo(0, hemY + 30, flare, hemY);
    ctx.lineTo(70, waistY);
    ctx.lineTo(120, shoulderY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // puff sleeves
    if (puff) {
      ctx.beginPath();
      ctx.arc(-130, shoulderY + 20, 40, 0, 7);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(130, shoulderY + 20, 40, 0, 7);
      ctx.fill();
      ctx.stroke();
    }
    // neckline
    ctx.fillStyle = shade(base, -28);
    ctx.beginPath();
    if (sel.neckline === "sweetheart") {
      ctx.moveTo(-60, top + 10);
      ctx.quadraticCurveTo(0, top + 70, 60, top + 10);
    } else if (sel.neckline === "halter" || sel.neckline === "off-shoulder") {
      ctx.rect(-50, top + 6, 100, 24);
    } else {
      ctx.arc(0, top + 20, 46, 0, Math.PI);
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawPants(base, sel) {
    sel = sel || {};
    // Jeans wash overrides the colour; fit changes leg width
    let col = base;
    if (sel.wash === "light") col = "#9DB4D6";
    else if (sel.wash === "dark") col = "#3E5C86";
    else if (sel.wash === "distressed") col = "#5B79A6";
    const legOut = sel.fit === "skinny" ? 90 : sel.fit === "straight" ? 130 : 110;
    const g = ctx.createLinearGradient(-legOut, 0, legOut, 0);
    g.addColorStop(0, shade(col, -18));
    g.addColorStop(0.5, col);
    g.addColorStop(1, shade(col, -25));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-120, 200);
    ctx.lineTo(120, 200);
    ctx.lineTo(legOut, 300);
    ctx.lineTo(60, 740);
    ctx.lineTo(10, 740);
    ctx.lineTo(0, 360);
    ctx.lineTo(-10, 740);
    ctx.lineTo(-60, 740);
    ctx.lineTo(-legOut, 300);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = shade(col, -30);
    ctx.fillRect(-120, 200, 240, 28);
    // waistband stitching
    ctx.strokeStyle = "#D9A441";
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-110, 210, 220, 24);
    ctx.setLineDash([]);
    // distressed marks
    if (sel.wash === "distressed") {
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-60, 420);
      ctx.lineTo(-40, 424);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(40, 500);
      ctx.lineTo(64, 504);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
  }

  function drawShoe(base, sel) {
    sel = sel || {};
    const g = ctx.createLinearGradient(-200, 0, 200, 0);
    g.addColorStop(0, shade(base, -18));
    g.addColorStop(1, base);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(-200, 480);
    ctx.quadraticCurveTo(-210, 380, -90, 380);
    ctx.quadraticCurveTo(-40, 300, 60, 340);
    ctx.quadraticCurveTo(210, 360, 210, 480);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // accent swoosh
    ctx.fillStyle = fill("Pink");
    ctx.beginPath();
    ctx.moveTo(-120, 460);
    ctx.quadraticCurveTo(20, 350, 150, 450);
    ctx.lineTo(130, 470);
    ctx.quadraticCurveTo(10, 390, -100, 476);
    ctx.closePath();
    ctx.fill();
    // laces
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) {
      const y = 370 + i * 26;
      ctx.beginPath();
      ctx.moveTo(-40, y);
      ctx.lineTo(50, y + 12);
      ctx.stroke();
    }
    // sole — cushioned = thicker
    const soleH = sel.sole === "cushioned" ? 60 : 40;
    ctx.fillStyle = sel.material === "leather" ? "#DAD5D0" : "#EDEDED";
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    ctx.lineWidth = 3;
    ctx.fillRect(-210, 480, 430, soleH);
    ctx.strokeRect(-210, 480, 430, soleH);
  }

  function drawWatch(base, sel) {
    ctx.fillStyle = shade(base, -20);
    ctx.fillRect(-24, 200, 48, 150);
    ctx.fillRect(-24, 450, 48, 150);
    ctx.fillStyle = "#3A3A3A";
    if (sel.dial === "square") {
      ctx.fillRect(-90, 340, 180, 180);
    } else {
      ctx.beginPath();
      ctx.arc(0, 430, 95, 0, 7);
      ctx.fill();
    }
    ctx.fillStyle = "#E9E9E9";
    if (sel.dial === "square") {
      ctx.fillRect(-70, 360, 140, 140);
    } else {
      ctx.beginPath();
      ctx.arc(0, 430, 74, 0, 7);
      ctx.fill();
    }
  }

  function drawBag(base) {
    const g = ctx.createLinearGradient(-160, 0, 160, 0);
    g.addColorStop(0, shade(base, -18));
    g.addColorStop(1, base);
    ctx.fillStyle = g;
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(-70, 320, 60, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(70, 320, 60, Math.PI, 0);
    ctx.stroke();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.moveTo(-170, 330);
    ctx.lineTo(170, 330);
    ctx.lineTo(140, 620);
    ctx.lineTo(-140, 620);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  function drawJewellery(base) {
    ctx.strokeStyle = shade(base, 10);
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(0, 380, 150, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = fill("Pink");
    ctx.beginPath();
    ctx.arc(0, 528, 20, 0, 7);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
  }

  // --- monogram (center chest) ---
  function drawMonogram(text) {
    if (!text) return;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.font = "bold 40px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text.toUpperCase(), W / 2, 400);
    ctx.restore();
  }

  // --- uploaded artwork ---
  function drawArt(art) {
    if (!art || !art.img) return;
    ctx.save();
    ctx.translate(art.x, art.y);
    ctx.rotate((art.rotation * Math.PI) / 180);
    ctx.scale(art.scale, art.scale);
    const w = 180,
      h = (art.img.height / art.img.width) * 180 || 180;
    ctx.drawImage(art.img, -w / 2, -h / 2, w, h);
    ctx.restore();
  }

  return { init, render };
})();
