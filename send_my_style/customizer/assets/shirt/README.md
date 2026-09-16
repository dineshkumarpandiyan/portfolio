# Shirt asset layers (real seller PNGs)

Drop transparent PNG layers here. The customizer composes them by `layer`
order defined in `../../js/product-data.js`. Until these exist, the preview
engine draws styled vector placeholders automatically.

```
shirt/
├── base.png              layer 0  — garment silhouette
├── colors/               (fabric colour handled via variant tint)
├── patterns/
│   ├── plain.png         layer 1
│   ├── checks.png        layer 1
│   └── stripes.png       layer 1
├── cuffs/
│   ├── normal.png        layer 4
│   └── french.png        layer 4
├── collars/
│   ├── classic.png       layer 5
│   ├── spread.png        layer 5
│   └── mandarin.png      layer 5
└── buttons/
    ├── white.png         layer 6
    ├── black.png         layer 6
    └── wooden.png        layer 6
```

All layers should share the same canvas dimensions (e.g. 720×820) and be
transparent outside the garment so they compose cleanly.
