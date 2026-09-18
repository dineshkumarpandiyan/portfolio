// ==============================================================
// SendMyStyle — Upload Handler
// Reads an uploaded image and tracks its placement (position,
// scale, rotation). Consumed by the preview engine.
// ==============================================================

const UploadHandler = (() => {
  const art = { img: null, x: 300, y: 400, scale: 1, rotation: 0 };
  let onChange = () => {};

  function setOnChange(fn) {
    onChange = fn || (() => {});
  }

  function loadFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        art.img = img;
        art.x = 300;
        art.y = 400;
        art.scale = 1;
        art.rotation = 0;
        onChange();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function clear() {
    art.img = null;
    onChange();
  }

  function has() {
    return !!art.img;
  }

  function setScale(v) {
    art.scale = Number(v);
    onChange();
  }
  function setRotation(v) {
    art.rotation = Number(v);
    onChange();
  }
  function move(x, y) {
    art.x = x;
    art.y = y;
    onChange();
  }

  function get() {
    return art;
  }

  return { setOnChange, loadFile, clear, has, setScale, setRotation, move, get };
})();
