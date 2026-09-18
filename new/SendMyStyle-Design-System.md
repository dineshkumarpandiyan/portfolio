# SendMyStyle — UI Color & Typography Design System

## 1. Design Direction

SendMyStyle follows a **Premium Monochrome + Signature Pink** visual language.

The interface must feel like a premium fashion-commerce platform rather than a fully pink-themed website.

### Core principle

> **Black + White + Neutral Gray = UI foundation**
>
> **SendMyStyle Pink = Brand accent**

Recommended visual balance:

- **90–95%** monochrome / neutral colors
- **5–10%** SendMyStyle brand accent

The product imagery, photography, fabrics, patterns, and customization previews should provide most of the visual richness. The UI should remain restrained so that the products stay the focus.

---

## 2. Tailwind Configuration

Use the following Tailwind configuration as the base design system:

```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        fontFamily: {
          sans: ["Poppins", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
          display: ["Space Grotesk", "sans-serif"],
        },

        boxShadow: {
          soft: "0 18px 50px rgba(0, 0, 0, 0.06)",
        },

        colors: {
          /* ========================================
             CORE UI
             Monochrome foundation
             ======================================== */

          background: "#FFFFFF",
          surface: "#FFFFFF",

          heading: "#111111",
          body: "#4B4B4B",
          muted: "#737373",

          border: "#E5E5E5",
          "border-light": "#F0F0F0",

          /* ========================================
             BRAND ACCENT
             Use sparingly
             ======================================== */

          primary: "#D01050",
          "primary-hover": "#B00040",
          "primary-active": "#900030",

          accent: "#D01050",

          /* ========================================
             BASIC COLORS
             ======================================== */

          black: "#111111",
          "black-soft": "#1A1A1A",
          white: "#FFFFFF",

          /* ========================================
             NEUTRALS
             Main UI color system
             ======================================== */

          neutral: {
            50: "#FAFAFA",
            100: "#F5F5F5",
            200: "#E5E5E5",
            300: "#D4D4D4",
            400: "#A3A3A3",
            500: "#737373",
            600: "#525252",
            700: "#404040",
            800: "#262626",
            900: "#171717",
            950: "#0A0A0A",
          },

          /* ========================================
             SENDMYSTYLE BRAND
             Accent scale only
             Do not use across the entire UI
             ======================================== */

          sendmystyle: {
            50: "#FCEEF2",
            100: "#FAD9E2",
            200: "#F4B3C6",
            300: "#E97DA0",
            400: "#DE4675",
            500: "#D01050",
            600: "#B00040",
            700: "#900030",
            800: "#800028",
            900: "#500018",
            950: "#35000F",
          },
        },
      },
    },
  };
</script>
```

---

## 3. Color Roles

### Core UI

| Token          | Hex       | Purpose                     |
| -------------- | --------- | --------------------------- |
| `background`   | `#FFFFFF` | Main page background        |
| `surface`      | `#FFFFFF` | Cards, panels, modals       |
| `heading`      | `#111111` | Main headings               |
| `body`         | `#4B4B4B` | Primary body text           |
| `muted`        | `#737373` | Secondary / supporting text |
| `border`       | `#E5E5E5` | Standard borders            |
| `border-light` | `#F0F0F0` | Subtle separators           |

### Brand

| Token            | Hex       | Purpose                         |
| ---------------- | --------- | ------------------------------- |
| `primary`        | `#D01050` | Main CTA, active brand elements |
| `primary-hover`  | `#B00040` | Hover state                     |
| `primary-active` | `#900030` | Pressed / active state          |
| `accent`         | `#D01050` | Brand accent                    |

---

## 4. Brand Palette

The full brand palette is available, but it is **not intended to be used everywhere**.

| Shade   | Hex           | Recommended Usage                |
| ------- | ------------- | -------------------------------- |
| 50      | `#FCEEF2`     | Very subtle brand background     |
| 100     | `#FAD9E2`     | Soft highlight                   |
| 200     | `#F4B3C6`     | Soft border / selected states    |
| 300     | `#E97DA0`     | Secondary accent                 |
| 400     | `#DE4675`     | Strong secondary accent          |
| **500** | **`#D01050`** | **Primary brand color**          |
| 600     | `#B00040`     | Hover / stronger interaction     |
| 700     | `#900030`     | Active / pressed                 |
| 800     | `#800028`     | Deep brand usage                 |
| 900     | `#500018`     | Rare dark brand sections         |
| 950     | `#35000F`     | Very rare / deep brand treatment |

### Primary brand color

**`#D01050` is the official primary SendMyStyle accent.**

Do not replace the primary color with a softer pink just because the UI is minimal. The minimalism comes from **how frequently the accent is used**, not from weakening the brand color.

---

## 5. Neutral Palette

Neutral colors are the primary UI system.

| Shade | Hex       | Typical Usage               |
| ----- | --------- | --------------------------- |
| 50    | `#FAFAFA` | Subtle page sections        |
| 100   | `#F5F5F5` | Inputs / secondary surfaces |
| 200   | `#E5E5E5` | Borders                     |
| 300   | `#D4D4D4` | Disabled borders / dividers |
| 400   | `#A3A3A3` | Placeholder text            |
| 500   | `#737373` | Muted text                  |
| 600   | `#525252` | Secondary text              |
| 700   | `#404040` | Strong secondary text       |
| 800   | `#262626` | Dark UI                     |
| 900   | `#171717` | Primary dark                |
| 950   | `#0A0A0A` | Maximum contrast            |

---

## 6. Typography

### Sans Font

Use:

```text
Poppins → Inter → ui-sans-serif → system-ui → sans-serif
```

Recommended for:

- Navigation
- Product information
- Buttons
- Forms
- Body content
- Labels
- Commerce UI

### Display Font

Use:

```text
Space Grotesk
```

Recommended for:

- Hero headlines
- Large promotional headings
- Brand statements
- Major section headings
- Editorial fashion content

### Typography principle

Use typography to create hierarchy instead of adding more colors.

Example:

```text
SPACE GROTESK
Large editorial headline
        ↓
Poppins
Supporting description
        ↓
Poppins
CTA / product information
```

---

## 7. Color Usage Rules

### Rule 1 — White is the default

Use:

```html
bg-white
```

or:

```html
bg-surface
```

for the majority of the interface.

Do not make large sections pink unless there is a deliberate campaign/editorial reason.

---

### Rule 2 — Black is the primary text language

Use:

```html
text-heading
```

for headings.

Use:

```html
text-body
```

for body content.

Avoid using pink for normal paragraphs or large amounts of text.

---

### Rule 3 — Pink means interaction or brand

Use `#D01050` primarily for:

- Primary CTA
- Active navigation
- Selected options
- Wishlist active state
- Important links
- Customization selections
- Small badges
- Important promotional highlights
- Brand moments

Example:

```html
<button class="bg-primary hover:bg-primary-hover text-white">Customize</button>
```

---

### Rule 4 — Do not color entire cards pink

Avoid:

```html
<div class="bg-sendmystyle-50 border-sendmystyle-200"></div>
```

for ordinary product cards.

Prefer:

```html
<div class="border border-neutral-200 bg-white"></div>
```

Use brand colors only for meaningful states.

---

### Rule 5 — Product imagery must remain dominant

Product cards should generally be:

```text
White background
+
Product image
+
Black typography
+
Neutral borders
+
Small brand accent
```

The product itself should be more visually prominent than the UI.

---

## 8. Component Guidelines

### Header

Recommended:

- Background: `#FFFFFF`
- Navigation text: `#111111`
- Icons: `#111111`
- Hover: `#D01050`
- Active item: `#D01050`
- Border: `#E5E5E5`
- CTA: black or `#D01050`

Do not create a pink header by default.

---

### Buttons

#### Primary

```html
<button class="bg-primary hover:bg-primary-hover text-white">Customize</button>
```

#### Secondary

```html
<button class="hover:bg-black-soft bg-black text-white">Shop Now</button>
```

#### Outline

```html
<button class="text-heading hover:border-primary hover:text-primary border border-neutral-300">View Details</button>
```

#### Ghost

```html
<button class="text-heading hover:text-primary">Explore</button>
```

---

### Product Cards

Default:

```html
<div class="border border-neutral-200 bg-white"></div>
```

Typography:

```html
<h3 class="text-heading"></h3>
```

Secondary information:

```html
<p class="text-body"></p>
```

Muted information:

```html
<span class="text-muted"></span>
```

Wishlist hover:

```text
Neutral → Pink
```

Customization CTA:

```text
Primary Pink
```

---

### Inputs

Default:

```html
<input
  class="text-heading placeholder:text-muted focus:border-primary focus:ring-primary border border-neutral-200 bg-white"
/>
```

Avoid pink backgrounds for normal inputs.

---

### Selected Options

For customization controls:

```html
<div class="border-primary text-primary border-2 bg-white">Mandarin Collar</div>
```

For subtle selected backgrounds:

```html
<div class="border-primary bg-sendmystyle-50 text-sendmystyle-700 border">Selected</div>
```

---

### Badges

Normal badge:

```html
<span class="bg-neutral-100 text-neutral-700"> New </span>
```

Brand badge:

```html
<span class="bg-sendmystyle-50 text-sendmystyle-700"> Customizable </span>
```

Do not make every badge pink.

---

## 9. Customization Experience

Customization is the key SendMyStyle product experience.

The brand accent can be more visible here.

Use pink to communicate:

> **This is where the customer makes the product their own.**

Recommended states:

```text
Default
→ White + neutral border

Hover
→ Neutral border becomes pink

Selected
→ Pink border + subtle pink background

Active
→ Dark brand pink
```

Example:

```text
┌───────────────────────┐
│ Collar                │
├───────────────────────┤
│                       │
│  Classic              │
│  Spread               │
│  ✓ Mandarin           │
│  Button Down          │
│                       │
└───────────────────────┘
```

Selected option:

```text
border: #D01050
background: #FCEEF2
text: #900030
```

---

## 10. Hero Sections

Hero sections should be editorial and premium.

Preferred:

```text
WHITE / IMAGE
        +
BLACK TYPOGRAPHY
        +
SMALL PINK ACCENT
```

Example:

```text
FIND IT.
MAKE IT.
WEAR IT.

Fashion that becomes yours.

[ Explore Styles ]
```

Use pink selectively on:

- One keyword
- CTA
- Small label
- Decorative detail

Avoid:

```text
Entire hero background = pink
+
Pink heading
+
Pink button
+
Pink cards
```

That creates the over-colored appearance we want to avoid.

---

## 11. Product Listing / Category Pages

The category page should feel like a premium fashion catalog.

### Recommended hierarchy

```text
White background
        ↓
Black heading
        ↓
Gray supporting text
        ↓
Neutral filter controls
        ↓
White product cards
        ↓
Product imagery
        ↓
Black product information
        ↓
Small pink interaction accents
```

Pink should not dominate the product grid.

---

## 12. Dark Sections

Dark sections can be used occasionally for:

- Brand story
- Premium campaigns
- Editorial sections
- Special promotional blocks

Recommended dark colors:

```text
#111111
#171717
#262626
```

Brand accent:

```text
#D01050
```

Avoid making dark sections entirely dark pink.

### Footer

The footer should stay **light**, in line with the overall monochrome
direction (like Myntra and Tira). Use:

```text
Background → #FAFAFA (neutral-50)
Headings   → #111111
Links      → #4B4B4B, hover #D01050
Borders    → #E5E5E5
Accent     → #D01050 (subscribe CTA, social hover, trust icons)
```

Do not use a dark footer by default. Reserve dark treatments for
deliberate editorial or campaign sections, not structural chrome.

---

## 13. Shadows

Primary soft shadow:

```css
0 18px 50px rgba(0, 0, 0, 0.06)
```

Use shadows subtly.

Premium fashion UI should rely more on:

- spacing
- typography
- image quality
- borders
- whitespace

and less on heavy shadows.

Avoid strong, obvious card shadows unless the component requires elevation.

---

## 14. Border Rules

Default:

```text
#E5E5E5
```

Subtle:

```text
#F0F0F0
```

Selected:

```text
#D01050
```

Do not use pink borders on every card.

---

## 15. Common Mistakes to Avoid

### Avoid 1 — Pink page backgrounds

```html
<body class="bg-sendmystyle-50"></body>
```

Do not use this as the default website background.

Prefer:

```html
<body class="bg-white"></body>
```

---

### Avoid 2 — Pink typography everywhere

Bad:

```html
<h1 class="text-primary">
  <p class="text-primary">
    <span class="text-primary"></span>
  </p>
</h1>
```

Prefer:

```html
<h1 class="text-heading">
  <p class="text-body">
    <span class="text-muted"></span>
  </p>
</h1>
```

Use pink only when it carries meaning.

---

### Avoid 3 — Pink product cards

Bad:

```html
<div class="bg-sendmystyle-50 border-sendmystyle-200"></div>
```

Prefer:

```html
<div class="border border-neutral-200 bg-white"></div>
```

---

### Avoid 4 — Using the entire brand scale randomly

Do not randomly assign:

```text
sendmystyle-50
sendmystyle-100
sendmystyle-200
...
sendmystyle-950
```

to UI elements just because the colors exist.

The brand scale exists for controlled design states and special treatments.

---

## 16. Recommended Semantic Mapping

Use these semantic tokens whenever possible:

```text
Background
→ background

Surface
→ surface

Heading
→ heading

Body
→ body

Muted
→ muted

Border
→ border

Light Border
→ border-light

Primary
→ primary

Primary Hover
→ primary-hover

Primary Active
→ primary-active

Accent
→ accent
```

This keeps the UI consistent and makes future theme changes easier.

---

## 17. Brand Color Decision

### Official primary

```text
#D01050
```

### Interaction

```text
Hover  → #B00040
Active → #900030
```

### Soft brand treatment

```text
Background → #FCEEF2
Border     → #F4B3C6
Text       → #900030
```

---

## 18. Visual Identity Summary

SendMyStyle should visually communicate:

- Premium
- Modern
- Fashion-forward
- Clean
- Editorial
- Minimal
- Customizable
- Confident
- Sophisticated

The website should **not** feel:

- overly pink
- childish
- candy-like
- generic beauty UI
- gradient-heavy
- overly decorative
- color-saturated

### Final formula

```text
SENDMYSTYLE

BLACK
+
WHITE
+
NEUTRAL GRAYS
+
SIGNATURE #D01050
+
HIGH-QUALITY PRODUCT IMAGERY
+
STRONG TYPOGRAPHY
+
GENEROUS WHITESPACE
```

This is the core visual direction for all SendMyStyle customer-facing web pages.

---

## 19. AI / Developer Implementation Rule

When generating or modifying SendMyStyle UI, AI coding assistants must follow this rule:

> **Do not introduce new colors unless explicitly required. Use the existing semantic colors and neutral palette first. The SendMyStyle brand pink palette must be treated as an accent system, not the default UI color system. Prefer white, black, and neutral gray for structure, typography, surfaces, borders, and product grids. Use `#D01050` primarily for meaningful brand and interaction states.**

Before introducing a new color, check whether an existing token can satisfy the requirement.

### Priority

```text
1. Semantic tokens
2. Neutral palette
3. SendMyStyle accent palette
4. New color only when explicitly justified
```

---

## 20. Quick Reference

```text
PRIMARY
#D01050

HOVER
#B00040

ACTIVE
#900030

SOFT BRAND
#FCEEF2

BRAND BORDER
#F4B3C6

HEADING
#111111

BODY
#4B4B4B

MUTED
#737373

BORDER
#E5E5E5

LIGHT BORDER
#F0F0F0

BACKGROUND
#FFFFFF

SURFACE
#FFFFFF
```

### Design mantra

> **Let the products bring the color. Let SendMyStyle bring the accent.**
