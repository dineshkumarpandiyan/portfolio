# SendMyStyle — Product Customization Engine

A generic, data-driven 2D product customization tool built with **HTML5, Tailwind
CSS (CDN), vanilla JavaScript and HTML5 Canvas**. No frameworks, no UI libraries.

> “Choose it. Customize it. Make it yours.”

## What it does

- View the product and select **standard variants** (color / size / fit)
- Select **customization** options (collar / cuff / pattern / buttons)
- **Live preview** composed from layers, updates instantly
- **Live price** — base + variant + customization + personalization
- Add a **monogram** (text, font, colour)
- **Upload** a personal design (PNG/JPG/WEBP) and move / scale / rotate it
  inside a defined printable area
- Review the **final configuration** and **Add to Cart** with the full
  customization attached (not a separate SKU)

## Catalog

`product-data.js` ships **8 products across different categories** (no shirt):
T-Shirt, Kurti, Shoes, Jeans, Dress, Bag, Cap, Necklace — all exposed via the
`products` array. Switch products in the UI (product picker) or via
`?id=<productId>` / `?slug=<slug>`.

## Architecture

Clear separation of concerns — the engine is generic and knows nothing about a
specific category. There are **no** `if (product.category === ...)` conditionals.
The UI is built entirely from `product.customization.groups`, and the engine
handles every `displayType`:

| displayType | UI                           | Data                    |
| ----------- | ---------------------------- | ----------------------- |
| `image`     | image option cards           | `options[].asset`       |
| `color`     | colour swatches              | `options[].value`       |
| `card`      | text option cards            | `options[].description` |
| `text`      | input + font + colour        | `config` (maxLength…)   |
| `upload`    | file upload + move/scale/rot | `config.printableArea`  |

To add a new product, append another object with the same shape to `products`.
Nothing in the engine changes.

```
customizer/
├── index.html                 UI layout (2-col desktop, stacked mobile)
├── js/
│   ├── product-data.js         MOCK product config (data)
│   ├── customization-engine.js STATE + selection API (single state object)
│   ├── preview-engine.js       Canvas layered composition (PREVIEW)
│   ├── price-engine.js         Pure price calculation (PRICE)
│   ├── upload-handler.js       File read + move/scale/rotate (UPLOAD)
│   └── app.js                  Orchestration + UI rendering
├── assets/shirt/               Real seller PNG layers go here
└── README.md
```

### Layers

The preview is composed from independent layers sorted by `layer` (low = back,
high = front): `base → pattern → cuff → collar → buttons → monogram → upload`.
We **never** generate an image per combination — layers are composed at runtime.

### Placeholder rendering

Real product PNGs are not bundled. Until seller assets are connected,
`preview-engine.js` draws styled **vector placeholders** (a stylised shirt with
collar/cuff/pattern/buttons) so the tool is fully functional. Each asset in
`product-data.js` has an `image` path and a `placeholder` descriptor:

```js
asset: { image: "assets/shirt/collars/spread.png", layer: 5,
         placeholder: { part: "collar", style: "spread" } }
```

When the real PNG at `image` loads successfully, it is drawn instead of the
placeholder — **no code change needed**, just drop the files in `assets/shirt/`.

## State

One source of truth (`customization-engine.js`):

```js
customizationState = {
  variants: {}, // { color, size, fit }
  customization: {}, // { collar, cuff, pattern, buttons }
  personalization: { text, font, textColor, uploadedImage, position, scale, rotation },
};
```

## Cart item

`Add to Cart` builds a structured item and stores it in `localStorage.sms_cart`
(shared with the main site cart). Customization stays attached to the product —
it is **not** a new SKU:

```js
{
  (productId, variants, customization, personalization, basePrice, customizationPrice, totalPrice);
}
```

## Connecting real data / APIs later

- Replace the `PRODUCT` object in `product-data.js` with data from the NestJS API.
- Drop real PNG layers into `assets/shirt/...` matching the `image` paths.
- In `app.js › onAddToCart`, replace the `localStorage` write with a
  `POST` to the cart endpoint (marked with a comment).

## Accessibility

Semantic HTML, `radiogroup`/`radio` roles on option groups, `aria-checked`,
visible focus rings, alt/ARIA labels, selection shown by more than colour
(check icon + ring + label), and `prefers-reduced-motion` respected.

## Run

Open `customizer/index.html` via a local server (needed for module loading and
file reads), e.g. `npx serve` or VS Code Live Server.
