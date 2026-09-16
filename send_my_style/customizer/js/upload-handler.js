// ==============================================================
// Upload Handler (generic, per upload-group)
// Validates and reads a user image for a given group, and manages
// move/scale/rotate of the active uploaded design on the canvas.
// ==============================================================

const UploadHandler = (() => {
  let canvas, onChange;
  let activeGroupId = null; // the group currently being dragged/edited

  function init({ canvasEl, onChangeCb }) {
    canvas = canvasEl;
    onChange = onChangeCb;
    enableDrag();
  }

  function validate(group, file) {
    const cfg = group.config || {};
    const accepted = cfg.acceptedTypes || ["image/png", "image/jpeg", "image/webp"];
    if (!accepted.includes(file.type)) return "Please upload a PNG, JPG or WEBP image.";
    const maxMB = cfg.maxFileSizeMB || 5;
    if (file.size > maxMB * 1024 * 1024) return `Image is too large (max ${maxMB}MB).`;
    return null;
  }

  function handleFile(group, file) {
    return new Promise((resolve, reject) => {
      const err = validate(group, file);
      if (err) return reject(err);
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          CustomizationEngine.setUpload(group.id, reader.result);
          PreviewEngine.setUploadImage(group.id, img);
          activeGroupId = group.id;
          onChange();
          resolve(img);
        };
        img.onerror = () => reject("Could not read that image.");
        img.src = reader.result;
      };
      reader.onerror = () => reject("Could not read that file.");
      reader.readAsDataURL(file);
    });
  }

  function remove(group) {
    CustomizationEngine.clearUpload(group.id);
    PreviewEngine.setUploadImage(group.id, null);
    if (activeGroupId === group.id) activeGroupId = null;
    onChange();
  }

  function setScale(group, scale) {
    activeGroupId = group.id;
    CustomizationEngine.setTransform(group.id, { scale: Math.max(0.3, Math.min(2.5, scale)) });
    onChange();
  }
  function setRotation(group, deg) {
    activeGroupId = group.id;
    CustomizationEngine.setTransform(group.id, { rotation: deg });
    onChange();
  }
  function setActive(groupId) {
    activeGroupId = groupId;
  }

  function enableDrag() {
    let dragging = false,
      startX = 0,
      startY = 0,
      origDx = 0,
      origDy = 0;

    function ratio(delta, dim) {
      const rect = canvas.getBoundingClientRect();
      const r = dim === "x" ? canvas.width / rect.width : canvas.height / rect.height;
      return delta * r;
    }

    canvas.addEventListener("pointerdown", (e) => {
      if (!activeGroupId) return;
      const t = CustomizationEngine.state.transform[activeGroupId];
      if (!CustomizationEngine.state.uploads[activeGroupId]) return;
      dragging = true;
      canvas.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startY = e.clientY;
      origDx = t.dx;
      origDy = t.dy;
    });
    canvas.addEventListener("pointermove", (e) => {
      if (!dragging || !activeGroupId) return;
      CustomizationEngine.setTransform(activeGroupId, {
        dx: origDx + ratio(e.clientX - startX, "x"),
        dy: origDy + ratio(e.clientY - startY, "y"),
      });
      onChange();
    });
    const end = (e) => {
      if (dragging) {
        dragging = false;
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch (_) {}
      }
    };
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
  }

  return { init, handleFile, remove, setScale, setRotation, setActive };
})();
