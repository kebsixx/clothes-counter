import { derived } from 'svelte/store';
import { createPersistentStringStore } from './clothingStore.js';

export const language = createPersistentStringStore('language', 'en');

const messages = {
  id: {
    gearAria: 'Pengaturan',
    helpBtnAria: 'Cara pakai',
    helpDialogAria: 'Cara Pakai',
    helpTitle: 'Cara Pakai',
    helpSub: 'Panduan singkat',
    closeHelp: 'Tutup cara pakai',
    helpSteps: [
      { title: 'Hitung pemakaian', desc: 'Ketuk kartu untuk menambah angka <strong>+1</strong> setiap kali dipakai.' },
      {
        title: 'Batas maksimum',
        desc: 'Saat angka mencapai batas yang diatur (mis. 3), angka berubah <strong>merah</strong>. Ketuk sekali lagi untuk kembali ke <strong>0</strong>.',
      },
      { title: 'Reset satu kartu', desc: 'Tekan lama (long-press) atau klik kanan pada kartu untuk mengatur ulang kartu itu ke 0.' },
      { title: 'Ganti nama', desc: 'Ketuk teks di bawah kartu untuk mengubah namanya, misalnya dari "Baju" menjadi "Kemeja".' },
      {
        title: 'Kelola outfit',
        desc: 'Gunakan tab di atas (desktop) atau bawah (HP) untuk berpindah antar outfit. Tambah dengan tombol <strong>+</strong>, ubah nama dengan klik dua kali, hapus dengan tahan lama / klik kanan.',
      },
      { title: 'Pengaturan', desc: 'Buka ikon gear untuk mengubah batas maksimum, tema warna, dan mereset semua counter.' },
    ],
    settingsAria: 'Pengaturan',
    settingsTitle: 'Pengaturan',
    settingsSub: 'Batas maksimum & preferensi',
    closeSettings: 'Tutup pengaturan',
    maxLimits: 'Batas Maksimum',
    decreaseLimit: 'Kurangi batas {label}',
    increaseLimit: 'Tambah batas {label}',
    themeTitle: 'Tema Warna',
    themeAria: 'Pilih tema warna',
    dark: 'Gelap',
    light: 'Terang',
    languageTitle: 'Bahasa',
    languageAria: 'Pilih bahasa',
    resetAllConfirm: 'Reset semua counter ke 0?',
    cancel: 'Batal',
    yesReset: 'Ya, Reset',
    resetAll: 'Reset Semua Counter',
    renameLabel: 'Ubah nama label',
    rename: 'Ubah nama {label}',
    resetQuestion: 'Reset {label} ke 0?',
    yes: 'Ya',
    tabsAria: 'Daftar outfit',
    addOutfit: 'Tambah outfit',
    deleteOutfit: 'Hapus {name}',
    deleteOutfitConfirm: 'Hapus outfit {name}?',
    renameOutfitLabel: 'Ubah nama outfit',
    renameOutfit: 'Ubah nama {name}',
    tabHints: 'Klik dua kali untuk ganti nama, klik kanan / tahan lama untuk hapus',
    delete: 'Hapus',
  },
  en: {
    gearAria: 'Settings',
    helpBtnAria: 'How to use',
    helpDialogAria: 'How to Use',
    helpTitle: 'How to Use',
    helpSub: 'Quick guide',
    closeHelp: 'Close guide',
    helpSteps: [
      { title: 'Track wears', desc: "Tap a card to add <strong>+1</strong> each time it's worn." },
      {
        title: 'Max limit',
        desc: 'When a count reaches its limit (e.g. 3), the number turns <strong>red</strong>. Tap once more to reset it to <strong>0</strong>.',
      },
      { title: 'Reset one card', desc: 'Long-press or right-click a card to reset it to 0.' },
      { title: 'Rename', desc: 'Tap the text below a card to change its name, for example from "Shirt" to "T-Shirt".' },
      {
        title: 'Manage outfits',
        desc: 'Use the tabs (top on desktop, bottom on mobile) to switch outfits. Tap <strong>+</strong> to add, double-click to rename, long-press / right-click to delete.',
      },
      { title: 'Settings', desc: 'Open the gear icon to change max limits, color theme, and reset all counters.' },
    ],
    settingsAria: 'Settings',
    settingsTitle: 'Settings',
    settingsSub: 'Max limits & preferences',
    closeSettings: 'Close settings',
    maxLimits: 'Max Limits',
    decreaseLimit: 'Decrease {label} limit',
    increaseLimit: 'Increase {label} limit',
    themeTitle: 'Theme',
    themeAria: 'Choose color theme',
    dark: 'Dark',
    light: 'Light',
    languageTitle: 'Language',
    languageAria: 'Choose language',
    resetAllConfirm: 'Reset all counters to 0?',
    cancel: 'Cancel',
    yesReset: 'Yes, Reset',
    resetAll: 'Reset All Counters',
    renameLabel: 'Rename label',
    rename: 'Rename {label}',
    resetQuestion: 'Reset {label} to 0?',
    yes: 'Yes',
    tabsAria: 'Outfits',
    addOutfit: 'Add outfit',
    deleteOutfit: 'Delete {name}',
    deleteOutfitConfirm: 'Delete outfit {name}?',
    renameOutfitLabel: 'Rename outfit',
    renameOutfit: 'Rename {name}',
    tabHints: 'Double-click to rename, right-click / long-press to delete',
    delete: 'Delete',
  },
};

export const t = derived(language, ($language) => (key, params) => {
  let str = messages[$language]?.[key] ?? messages.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = String(str).replaceAll(`{${k}}`, v);
    }
  }
  return str;
});
