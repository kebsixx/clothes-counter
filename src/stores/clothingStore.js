import { writable, derived, get } from 'svelte/store';

export const sanitizeLabel = (val, fallback) => {
  const trimmed = String(val ?? '').trim();
  return trimmed === '' ? fallback : trimmed;
};

export const createPersistentStringStore = (key, initial) => {
  const stored = localStorage.getItem(key);
  const value = stored !== null ? stored : initial;
  const store = writable(value);
  store.subscribe((val) => localStorage.setItem(key, String(val)));
  return store;
};

export const themeMode = createPersistentStringStore('theme_mode', 'dark');

/* -------------------- Outfits -------------------- */

export const MAX_OUTFITS = 10;
const OUTFITS_KEY = 'clothing_outfits';
const ACTIVE_KEY = 'clothing_active_outfit';
const LETTERS = 'ABCDEFGHIJ'.split('');

let uid = 0;
const newId = () => `outfit_${Date.now().toString(36)}_${(uid++).toString(36)}`;

export const defaultCounters = () => ({
  baju: { label: 'Shirt', count: 0, max: 3 },
  celana: { label: 'Pants', count: 0, max: 3 },
});

const defaultOutfit = (list) => {
  const used = new Set(list.map((o) => o.name));
  const letter = LETTERS.find((l) => !used.has(`Outfit ${l}`)) ?? list.length + 1;
  return {
    id: newId(),
    name: `Outfit ${letter}`,
    counters: defaultCounters(),
  };
};

const LEGACY_KEYS = ['counter_baju', 'counter_celana', 'max_baju', 'max_celana', 'label_baju', 'label_celana'];

// One-time migration from the legacy flat localStorage keys (pre-tabs version).
function migrateLegacyData(outfits) {
  const readInt = (k, d) => {
    const v = localStorage.getItem(k);
    return v !== null ? parseInt(v, 10) || d : d;
  };
  const readStr = (k, d) => {
    const v = localStorage.getItem(k);
    return v !== null ? v : d;
  };
  const first = outfits[0];
  first.counters.baju.count = readInt('counter_baju', 0);
  first.counters.celana.count = readInt('counter_celana', 0);
  first.counters.baju.max = readInt('max_baju', 3);
  first.counters.celana.max = readInt('max_celana', 3);
  first.counters.baju.label = readStr('label_baju', 'Shirt');
  first.counters.celana.label = readStr('label_celana', 'Pants');
  for (const key of LEGACY_KEYS) localStorage.removeItem(key);
}

function loadOutfits() {
  try {
    const raw = localStorage.getItem(OUTFITS_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* corrupted storage — fall through to defaults */
  }
  const outfits = [defaultOutfit([])];
  migrateLegacyData(outfits);
  return outfits;
}

export const outfits = writable(loadOutfits());
outfits.subscribe((val) => localStorage.setItem(OUTFITS_KEY, JSON.stringify(val)));

function loadActiveId() {
  const list = get(outfits);
  const stored = localStorage.getItem(ACTIVE_KEY);
  if (stored !== null && list.some((o) => o.id === stored)) return stored;
  return list[0].id;
}

export const activeOutfitId = writable(loadActiveId());
activeOutfitId.subscribe((id) => localStorage.setItem(ACTIVE_KEY, id));

export const activeOutfit = derived([outfits, activeOutfitId], ([$outfits, $id]) => {
  return $outfits.find((o) => o.id === $id) ?? $outfits[0];
});

/* -------------------- Outfit actions -------------------- */

export function setActiveOutfit(id) {
  activeOutfitId.set(id);
}

export function addOutfit() {
  let created = null;
  outfits.update((list) => {
    if (list.length >= MAX_OUTFITS) return list;
    created = defaultOutfit(list);
    return [...list, created];
  });
  if (created) activeOutfitId.set(created.id);
}

export function removeOutfit(id) {
  let nextActive = null;
  outfits.update((list) => {
    if (list.length <= 1) return list;
    const idx = list.findIndex((o) => o.id === id);
    if (idx === -1) return list;
    const next = list.filter((o) => o.id !== id);
    nextActive = next[Math.min(idx, next.length - 1)].id;
    return next;
  });
  if (nextActive) activeOutfitId.set(nextActive);
}

export function renameOutfit(id, name) {
  const clean = sanitizeLabel(name, '');
  if (!clean) return;
  outfits.update((list) => list.map((o) => (o.id === id ? { ...o, name: clean } : o)));
}

/* -------------------- Counter actions (active outfit) -------------------- */

function updateActiveOutfit(fn) {
  const list = get(outfits);
  const idx = list.findIndex((o) => o.id === get(activeOutfitId));
  if (idx === -1) return;
  const next = [...list];
  next[idx] = fn(next[idx]);
  outfits.set(next);
}

const withCounter = (o, slot, patch) => ({
  ...o,
  counters: { ...o.counters, [slot]: { ...o.counters[slot], ...patch } },
});

export function incrementCounter(slot) {
  updateActiveOutfit((o) => {
    const c = o.counters[slot];
    return withCounter(o, slot, { count: c.count >= c.max ? 0 : c.count + 1 });
  });
}

export function setCounter(slot, value) {
  updateActiveOutfit((o) => withCounter(o, slot, { count: value }));
}

export function adjustMax(slot, delta) {
  updateActiveOutfit((o) => {
    const c = o.counters[slot];
    return withCounter(o, slot, { max: Math.min(99, Math.max(1, c.max + delta)) });
  });
}

export function setLabel(slot, label) {
  updateActiveOutfit((o) => {
    const c = o.counters[slot];
    return withCounter(o, slot, { label: sanitizeLabel(label, c.label) });
  });
}

export function resetAll() {
  outfits.update((list) =>
    list.map((o) => {
      const counters = {};
      for (const key of Object.keys(o.counters)) {
        counters[key] = { ...o.counters[key], count: 0 };
      }
      return { ...o, counters };
    })
  );
}
