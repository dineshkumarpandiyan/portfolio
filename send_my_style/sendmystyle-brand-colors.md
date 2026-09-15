# SendMyStyle Theme

## 1. Purpose

The entire SendMyStyle website must use this theme as the single source of truth for colors.

All pages and components should follow the same color system:

* Navbar
* Hero
* Buttons
* Cards
* Forms
* Product sections
* Modals
* Badges
* Footer
* Links
* Hover states
* Active states
* Focus states

Do not use random colors or hardcoded hex colors inside HTML unless absolutely required.

---

# 2. Brand Color Palette

```text
50   → #FCF3F5
100  → #F8E5E9
200  → #F1CBD3
300  → #E5A9B5
400  → #D78494
500  → #C45C72
600  → #A9475C
700  → #89394B
800  → #6B2D3B
900  → #481F29
950  → #2D141A
```

---

# 3. Semantic Theme

Use semantic names in HTML instead of directly using the color scale.

| Semantic Name    | Color     | Purpose                   |
| ---------------- | --------- | ------------------------- |
| `primary`        | `#C45C72` | Main brand color          |
| `primary-hover`  | `#A9475C` | Primary hover             |
| `primary-active` | `#89394B` | Active / selected         |
| `background`     | `#FCF3F5` | Main page background      |
| `surface`        | `#FFFFFF` | Cards / sections / modals |
| `border`         | `#F1CBD3` | Borders / dividers        |
| `heading`        | `#481F29` | Headings                  |
| `body`           | `#6B2D3B` | Body text                 |
| `accent`         | `#89394B` | Accent / highlights       |

---

# 4. Tailwind CDN Configuration

Since the website uses Tailwind CSS through CDN, define the theme directly in the HTML.

```html
<script src="https://cdn.tailwindcss.com"></script>

<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          primary: "#C45C72",
          "primary-hover": "#A9475C",
          "primary-active": "#89394B",

          background: "#FCF3F5",
          surface: "#FFFFFF",
          border: "#F1CBD3",

          heading: "#481F29",
          body: "#6B2D3B",

          accent: "#89394B",

          sendmystyle: {
            50: "#FCF3F5",
            100: "#F8E5E9",
            200: "#F1CBD3",
            300: "#E5A9B5",
            400: "#D78494",
            500: "#C45C72",
            600: "#A9475C",
            700: "#89394B",
            800: "#6B2D3B",
            900: "#481F29",
            950: "#2D141A"
          }
        }
      }
    }
  };
</script>
```

---

# 5. HTML Usage

## Primary Button

```html
<button
  class="
    bg-primary
    hover:bg-primary-hover
    active:bg-primary-active
    text-white
    px-6 py-3
    rounded-lg
  "
>
  Get Started
</button>
```

---

## Secondary Button

```html
<button
  class="
    bg-sendmystyle-100
    hover:bg-sendmystyle-200
    text-sendmystyle-700
    px-6 py-3
    rounded-lg
  "
>
  Learn More
</button>
```

---

## Outline Button

```html
<button
  class="
    bg-surface
    border border-border
    text-primary
    hover:bg-background
    px-6 py-3
    rounded-lg
  "
>
  Explore
</button>
```

---

# 6. Page Background

All main website pages should use:

```html
<body class="bg-background text-body">
```

This gives:

```text
Background → #FCF3F5
Body Text  → #6B2D3B
```

---

# 7. Surface / Cards

Cards, modals and elevated sections should use `surface`.

```html
<div class="bg-surface border border-border rounded-2xl p-6">
  <h3 class="text-heading">
    Product Title
  </h3>

  <p class="text-body">
    Product description goes here.
  </p>
</div>
```

---

# 8. Typography

## Heading

```html
<h1 class="text-heading">
  Discover Your Style
</h1>
```

Color:

```text
#481F29
```

---

## Body

```html
<p class="text-body">
  Find products that match your personal style.
</p>
```

Color:

```text
#6B2D3B
```

---

# 9. Links

Default:

```html
<a class="text-primary">
  View Details
</a>
```

Hover:

```html
<a class="text-primary hover:text-primary-hover">
  View Details
</a>
```

Active:

```html
<a class="text-primary-active">
  Products
</a>
```

---

# 10. Input / Forms

```html
<input
  type="text"
  class="
    w-full
    bg-surface
    border border-border
    text-body
    placeholder:text-sendmystyle-400
    rounded-lg
    px-4 py-3
    outline-none
    focus:border-primary
    focus:ring-2
    focus:ring-sendmystyle-100
  "
  placeholder="Enter your name"
/>
```

### Form Colors

```text
Background   → surface
Border       → border
Text         → body
Placeholder  → sendmystyle-400
Focus Border → primary
Focus Ring   → sendmystyle-100
```

---

# 11. Navigation

Recommended navbar:

```html
<nav class="bg-surface border-b border-border">
```

Navigation text:

```html
<a class="text-body hover:text-primary">
  Home
</a>
```

Active navigation:

```html
<a class="text-primary-active">
  Products
</a>
```

---

# 12. Hero Section

Use:

```html
<section class="bg-background">
```

Heading:

```html
<h1 class="text-heading">
  Your Style. Your Way.
</h1>
```

Description:

```html
<p class="text-body">
  Discover a style that feels uniquely yours.
</p>
```

CTA:

```html
<button class="bg-primary hover:bg-primary-hover active:bg-primary-active text-white">
  Explore Now
</button>
```

---

# 13. Badges

Primary badge:

```html
<span
  class="
    bg-sendmystyle-100
    text-sendmystyle-700
    px-3 py-1
    rounded-full
  "
>
  New
</span>
```

Featured badge:

```html
<span
  class="
    bg-primary
    text-white
    px-3 py-1
    rounded-full
  "
>
  Featured
</span>
```

---

# 14. Footer

The footer should use the deepest brand color.

```html
<footer class="bg-sendmystyle-950 text-white">
```

Heading:

```html
<h3 class="text-white">
  SendMyStyle
</h3>
```

Description:

```html
<p class="text-sendmystyle-100">
  Your style. Your way.
</p>
```

Links:

```html
<a class="text-sendmystyle-300 hover:text-white">
  Privacy Policy
</a>
```

---

# 15. Color State System

All interactive elements should follow this pattern.

```text
Default
→ primary
→ #C45C72

Hover
→ primary-hover
→ #A9475C

Active
→ primary-active
→ #89394B
```

For primary buttons:

```html
<button
  class="
    bg-primary
    hover:bg-primary-hover
    active:bg-primary-active
  "
>
```

---

# 16. Raw Palette Usage

The numbered SendMyStyle palette can be used when a specific shade is required.

```html
bg-sendmystyle-50
bg-sendmystyle-100
bg-sendmystyle-200
bg-sendmystyle-300
bg-sendmystyle-400
bg-sendmystyle-500
bg-sendmystyle-600
bg-sendmystyle-700
bg-sendmystyle-800
bg-sendmystyle-900
bg-sendmystyle-950
```

Example:

```html
<div class="bg-sendmystyle-50">
```

```html
<div class="border border-sendmystyle-200">
```

```html
<p class="text-sendmystyle-800">
```

---

# 17. Semantic Classes vs Raw Colors

## Preferred

```html
<button class="bg-primary hover:bg-primary-hover">
```

## Avoid

```html
<button class="bg-[#C45C72] hover:bg-[#A9475C]">
```

The semantic approach makes the entire website easier to maintain.

If the brand color changes later, only the theme configuration needs to be updated.

---

# 18. Recommended Global Defaults

Use these defaults across the website:

```text
Page Background → background
Surface         → surface
Primary         → primary
Primary Hover   → primary-hover
Primary Active  → primary-active
Heading         → heading
Body Text       → body
Border          → border
Accent          → accent
```

---

# 19. Complete Theme Reference

```text
PRIMARY
primary
#C45C72

PRIMARY HOVER
primary-hover
#A9475C

PRIMARY ACTIVE
primary-active
#89394B

BACKGROUND
background
#FCF3F5

SURFACE
surface
#FFFFFF

BORDER
border
#F1CBD3

HEADING
heading
#481F29

BODY
body
#6B2D3B

ACCENT
accent
#89394B
```

---

# 20. Design Rule

The entire SendMyStyle website should be designed around this theme.

### Use semantic classes for normal UI:

```text
bg-primary
bg-background
bg-surface

text-heading
text-body
text-primary

border-border
```

### Use the numbered palette only when a specific shade is needed:

```text
sendmystyle-50
sendmystyle-100
sendmystyle-200
...
sendmystyle-950
```

### Avoid hardcoded colors:

```text
bg-[#C45C72]
text-[#481F29]
border-[#F1CBD3]
```

unless there is a specific reason.

---

# 21. Final Brand Identity

SendMyStyle should have a:

* Soft
* Elegant
* Modern
* Premium
* Fashion-focused
* Clean

visual identity.

The `#C45C72` pink/mauve color is the primary brand identity and should remain the dominant accent throughout the website.

The complete UI should visually follow:

```text
#FCF3F5  → Background
#FFFFFF  → Surface
#C45C72  → Primary
#A9475C  → Hover
#89394B  → Active / Accent
#F1CBD3  → Border
#481F29  → Heading
#6B2D3B  → Body
#2D141A  → Deep Brand / Footer
```

**This theme is the single color source of truth for the SendMyStyle website.**
