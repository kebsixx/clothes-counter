# Clothes Counter — Logo

**Mark:** a bold "C" split by the flip-clock hinge. One idea: the counter digit caught mid-flip.

## Files

| File | Use |
|---|---|
| `svg/cc-mark.svg` | Master. Use at **64 px and up**. |
| `svg/cc-mark-small.svg` | Small cut. Use at **48 px and below** (hinge removed — it closes up at these sizes). |
| `svg/cc-mark-white.svg` | Reversed for dark backgrounds. |
| `svg/cc-mark-red.svg` | Accent `#ff3333` — limit/highlight moments only, never the default mark. |
| `png/` | Rendered ladder: 1024, 512, 256, 192, 128, 96, 64 (master); 48, 32, 24, 16 (small); white 512/64; red 512. |
| `exploration/` | Superseded concepts and proofs. Not for use. |

## Construction

Canvas `0 0 256 256`, mark bbox `162 × 176`, optically centred.
Annulus outer `R 88`, inner `r 40`. Aperture `±30°` from 3 o'clock. Hinge: a 14-unit gap at `y = 128`, parallel to the card seam.
Small cut: same annulus, aperture `±34°`, inner `r 36`, no hinge.

## Rules

- **One colour.** Black on light, white on dark, red only as an accent. Never two colours at once.
- **Never stretch.** Scale uniformly; the mark is square.
- **Clear space:** at least ¼ of the mark's height on all sides.
- **Minimum size:** 16 px (small cut). Below that, don't use the mark.
- **Don't** add shadows, gradients, outlines, or rotate the mark.
- The hinge gap must stay horizontal — it is the flip seam, not a decorative cut.

## In the app

| Asset | Source |
|---|---|
| `public/favicon.svg` | `svg/cc-mark-small.svg` (crisp at 16 px in a tab) |
| `public/icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | white mark on `#121212`, generated from `svg/cc-mark-white.svg` |

Regenerate icons: `node <temp>/cc-icons-final.js` (Playwright) or any SVG→PNG renderer at 1:1.

## Limits

- No trademark clearance has been run. Search before commercial use.
- Letterforms are constructed paths, not type — no font licence applies.
