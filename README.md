# Clothes counter

Aplikasi web sederhana untuk menghitung berapa lama pakaian (baju & celana) sudah dipakai. Didesain dengan tema digital flip-clock untuk tampilan minimalis dan modern.

## Fitur

- **Counter Baju & Celana:** Klik untuk menambah hari pakai (+1). Jika mencapai batas maksimum, otomatis reset ke 0.
- **Batas Maksimal:** Atur jumlah maksimal hari pakai sebelum reset otomatis terjadi.
- **Indikator Visual:** Angka berubah merah ketika sudah mencapai atau melebihi batas maksimal.
- **Tema Gelap/Terang:** Toggle tema warna sesuai preferensi.
- **Reset Individu:** Long-press atau klik kanan pada card untuk mereset counter spesifik.
- **Reset Semua:** Reset semua counter sekaligus melalui pengaturan.
- **Offline Mode:** Bekerja tanpa koneksi internet. Data tersimpan otomatis di localStorage browser.

## Teknologi

- **Build Tool:** Vite
- **Framework:** Svelte
- **CSS Framework:** Tailwind CSS
- **Icons:** lucide-svelte
- **Font:** @fontsource/orbitron, @fontsource/inter
- **State Management:** Svelte Writable Stores dengan localStorage persistence

## Instalasi

```bash
npm create vite@latest clothes_counter -- --template svelte
cd clothes_counter
npm install
npm install -D tailwindcss postcss autoprefixer
npm install lucide-svelte @fontsource/orbitron @fontsource/inter
```

## Menjalankan Aplikasi

```bash
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173) di browser.

## Struktur Folder

```
src/
  ├── stores/
  │     └── clothingStore.js    # State management (outfits, counters per outfit)
  ├── lib/
  │     ├── Counter.svelte
  │     ├── FlipDigit.svelte
  │     └── OutfitTabs.svelte
  ├── app.css
  └── app.html
docs/
  ├── AGENTS.md
  ├── PRD.md
  └── DESIGN.md
```

## Spesifikasi

Lihat dokumen berikut untuk detail lengkap:

- [PRD.md](docs/PRD.md) - Persyaratan fungsional aplikasi
- [DESIGN.md](docs/DESIGN.md) - Spesifikasi visual dan desain UI
- [AGENTS.md](docs/AGENTS.md) - Panduan pengembangan

## Lisensi

MIT
