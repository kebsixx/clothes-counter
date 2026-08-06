# PRD.md - clothes_counter (Web App)

## 1. Overview
A single-page web application named **`clothes_counter`** designed to help users track how many days their clothes (shirts and pants) have been worn. It uses a minimalist digital flip-clock aesthetic. The app runs entirely client-side, requires no internet, and stores all data locally.

## 2. Requirements
- **Platform:** Web (Desktop, Mobile, PWA - installable on screen).
- **User:** Single user, private, no authentication required.
- **Data Persistence:** All data stored locally in the browser's `localStorage`.
- **Tech Stack:** Vite + Svelte + Tailwind CSS.
- **Interaction:** Tap/Click on counters to increment. Tap gear icon to open settings.

## 3. Core Features (MVP)
### 3.1 Flip-Clock Counter Cards
- **Two main cards:** "Baju" (Top/Left) and "Celana" (Bottom/Right).
- **Visual Style:** Replicates a digital flip clock (dark rounded card, large bold monospace numbers, horizontal line exactly in the middle).
- **State:** Each counter starts at `0` and increments by `+1` on click.
- **Max Limit Logic:** The counters have a user-defined max limit. 
  - *If counter < max limit:* Clicking adds `+1`.
  - *If counter >= max limit:* Clicking **resets the counter back to 0** (not blocked).
- **Indicators:** When `counter >= max limit`, the number turns bright red.
- **Long Press / Right Click:** Opens a confirmation dialog to reset that specific card to `0`.

### 3.2 Settings Modal (Gear Icon)
- Triggered by a gear icon ⚙️ in the top right corner.
- **Settings Contents:**
  - `Batas Maksimum Baju`: Number input (Default: `3`).
  - `Batas Maksimum Celana`: Number input (Default: `3`).
  - `Tema Warna`: Toggle button (Terang / Gelap).
  - `Reset Semua`: Button to reset BOTH counters to `0` (requires confirmation).

### 3.3 Data Schema (localStorage)
| Key | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `counter_baju` | int | 0 | Worn days for shirts |
| `counter_celana` | int | 0 | Worn days for pants |
| `max_baju` | int | 3 | Max threshold for shirts |
| `max_celana` | int | 3 | Max threshold for pants |
| `theme_mode` | string | `'dark'` | Stored theme preference |

## 4. Architecture
- **UI Framework:** Svelte (reactive components).
- **State Management:** Svelte Native Stores with auto-subscription to `localStorage`.
- **Styling:** Tailwind CSS (utility-first, responsive).
- **Icons:** `lucide-svelte` for the gear icon.
- **Fonts:** `@fontsource/orbitron` (numbers) and `@fontsource/inter` (labels).

## 5. Design Language
Refer to `DESIGN.md` for complete UI specifications, colors, and layout. 