# DESIGN.md - Clothing Tracker Web App

## 1. Konsep Visual & Tema
Mengadopsi gaya **"Digital Flip Clock"** (Jam Balik Digital) yang minimalis namun ikonik. 
- **Latar Belakang:** Gelap pekat untuk menonjolkan angka (seperti layar LED).
- **Card Utama:** Kotak besar dengan sudut membulat, dan **garis horizontal tipis di tengah** sebagai "engsel" flip clock.
- **Angka:** Font Monospace tebal dengan ukuran sangat besar, mendominasi card.
- **Label:** Teks kecil dan minimalis di bawah card ("Baju", "Celana").
- **Feedback Interaksi:** Efek animasi klik (skala mengecil dan kembali) dan perubahan warna saat batas maksimal tercapai.

## 2. Layout & Responsivitas
- **Mobile (Vertikal):** Dua card disusun ke bawah (tumpuk). 
- **Desktop/Tablet (Horizontal):** Dua card disusun berdampingan (grid 2 kolom).

## 3. Color Palette (Tema Gelap - Default)
| Elemen | Hex Color | Keterangan |
| :--- | :--- | :--- |
| **Background Halaman** | `#121212` | Latar belakang utama |
| **Background Card** | `#1E1E1E` | Latar card (dark gray) |
| **Garis Tengah Card** | `#333333` | Garis flip clock |
| **Angka (Normal)** | `#E0E0E0` | Putih keabuan (LED mati) |
| **Angka (Over Limit)** | `#FF3333` | Merah cerah (Peringatan cuci) |
| **Label Keterangan** | `#888888` | Abu-abu muda (Baju/Celana) |

## 4. Typography & Font
- **Angka Counter:** Menggunakan font **`'Orbitron'`** (fallback ke `monospace`).
  - *Font weight:* `700` (Bold).
  - *Font size:* `6rem` (Desktop) hingga `10rem` (Mobile) - **pastikan font sangat besar**.
- **Label:** Menggunakan font **`'Inter'`** atau `sans-serif`.
  - *Font size:* `0.75rem` (12px) - **Kecil sesuai permintaan**.
- **Pengaturan (Settings):** Menggunakan font sistem standar `sans-serif`.

## 5. Component & Interaction Specs

### A. Flip Clock Card (Counter)
- **Struktur:**
  - `div` pembungkus card, `border-radius: 24px`, `box-shadow` halus.
  - **Dua bagian pembungkus angka** (Atas & Bawah) dengan `overflow: hidden` untuk memastikan garis tengah memotong angka dengan presisi.
  - Angka dirender identik di bagian atas dan bawah, dengan `position` yang disesuaikan agar terlihat menyatu.
  - Garis `div` horizontal setebal `1px` atau `2px` berwarna `#333` tepat di tengah.
- **Ukuran (Desktop):** Kurang lebih `200px` (lebar) x `240px` (tinggi).
- **Interaksi (Tap / Click):**
  - **Single Click:** Menambah nilai +1.
  - **Conditional Behavior:** Jika nilai saat ini `>= nilai maksimal`, maka ketika di-klik, nilai akan **kembali ke 0** (bukan mentok di maksimal).
  - **Long Press / Right Click:** Membuka dialog konfirmasi "Reset ke 0" pada card tersebut.

### B. Settings Modal
- **Trigger:** Ikon Gear (⚙️) di pojok kanan atas layar.
- **Content:**
  - Input number untuk "Batas Maksimal Baju" (default 3).
  - Input number untuk "Batas Maksimal Celana" (default 3).
  - Tombol toggle tema (Gelap / Terang).
  - Tombol "Reset Semua Counter ke 0" dengan konfirmasi.
- **Storage:** Semua perubahan langsung tersimpan di `localStorage`.

## 6. Assets
- **Font:**
  - Import `@fontsource/orbitron` dan `@fontsource/inter` (via NPM).
- **Ikon:**
  - Gunakan `lucide-react` atau `heroicons` untuk ikon Gear, Plus, dan Reset.