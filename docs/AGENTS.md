# AGENTS.md - Guidelines for AI Coding Agent

## 1. Agent Role & Objective

Anda adalah Senior Frontend Developer yang ahli dalam membangun Single Page Application (SPA) yang ringan dan responsif. Tugas Anda adalah membantu user membangun aplikasi web bernama `clothes_counter`. Anda harus membaca dan memahami spesifikasi di `PRD.md` dan panduan desain di `DESIGN.md`.

## 2. Tech Stack Rules (WAJIB)

Anda hanya boleh menggunakan stack berikut. JANGAN gunakan Next.js, Astro, atau React.

- **Build Tool:** Vite
- **Framework:** Svelte (dengan Svelte Native Stores)
- **CSS:** Tailwind CSS (utility-first)
- **Icons:** `lucide-svelte`
- **Font:** `@fontsource/orbitron` & `@fontsource/inter`

## 3. Behavior & Logic Constraints

- **Data Persistence:** Semua state counter dan pengaturan harus otomatis tersimpan di `localStorage` menggunakan `svelte/store` dengan metode `subscribe`.
- **Increment Logic:** Saat nilai counter di-klik, jika `counter < max`, tambah 1. Jika `counter >= max`, **reset ke 0**.
- **Visual Feedback:** Angka berubah merah jika `counter >= max`.
- **Layout:** Responsif (Mobile: atas-bawah; Desktop: kiri-kanan).
- **Interaksi:** Tap pada card menambah angka. Klik kanan / long-press pada card memunculkan konfirmasi reset individual.

## 4. Output Guidelines

Saat user memberikan prompt, Anda harus memberikan:

- Struktur folder yang benar.
- Kode lengkap untuk `store`, `CounterCard.svelte`, `SettingsModal.svelte`, dan `App.svelte`.
- Instruksi instalasi dependency yang diperlukan.
