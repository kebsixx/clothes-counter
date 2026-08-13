import { writable } from 'svelte/store';

export const createPersistentStore = (key, initial) => {
  const stored = localStorage.getItem(key);
  const value = stored !== null ? parseInt(stored, 10) : initial;
  const store = writable(value);
  store.subscribe(val => localStorage.setItem(key, String(val)));
  return store;
};

export const sanitizeLabel = (val, fallback) => {
  const trimmed = String(val ?? '').trim();
  return trimmed === '' ? fallback : trimmed;
};

export const createPersistentStringStore = (key, initial) => {
  const stored = localStorage.getItem(key);
  const value = stored !== null ? stored : initial;
  const store = writable(value);
  store.subscribe(val => localStorage.setItem(key, String(val)));
  return store;
};

export const counterBaju = createPersistentStore('counter_baju', 0);
export const counterCelana = createPersistentStore('counter_celana', 0);
export const maxBaju = createPersistentStore('max_baju', 3);
export const maxCelana = createPersistentStore('max_celana', 3);
export const labelBaju = createPersistentStringStore('label_baju', 'Shirt');
export const labelCelana = createPersistentStringStore('label_celana', 'Pants');
export const themeMode = createPersistentStringStore('theme_mode', 'dark');
