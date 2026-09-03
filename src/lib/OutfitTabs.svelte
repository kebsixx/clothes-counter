<script>
  import { Plus } from 'lucide-svelte';
  import { fade, scale } from 'svelte/transition';
  import { tick, onMount } from 'svelte';
  import { MAX_OUTFITS } from '../stores/clothingStore.js';
  import { t } from '../stores/i18n.js';

  export let outfits = [];
  export let activeId = '';
  export let onSelect = () => {};
  export let onAdd = () => {};
  export let onDelete = () => {};
  export let onRename = () => {};

  let pressTimer;
  let confirmOutfit = null;
  let renamingId = null;
  let draft = '';

  $: canDelete = outfits.length > 1;

  const letterOf = (o) => o.name.replace(/^Outfit\s*/i, '').charAt(0).toUpperCase() || '?';

  function select(o) {
    if (renamingId === o.id) return;
    onSelect(o.id);
  }

  function startPress(o) {
    clearPress();
    if (!canDelete) return;
    pressTimer = window.setTimeout(() => {
      confirmOutfit = o;
    }, 600);
  }

  function clearPress() {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  }

  function onContextMenu(e, o) {
    e.preventDefault();
    if (!canDelete) return;
    confirmOutfit = o;
  }

  function confirmDelete() {
    onDelete(confirmOutfit.id);
    confirmOutfit = null;
  }

  function startRename(o) {
    renamingId = o.id;
    draft = o.name;
  }

  function commitRename() {
    if (renamingId && draft.trim()) onRename(renamingId, draft.trim());
    renamingId = null;
  }

  function cancelRename() {
    renamingId = null;
  }

  function autofocus(node) {
    node.focus();
    node.select();
    return {};
  }

  function onKeydown(e) {
    if (e.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      commitRename();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelRename();
    }
  }

  // Pill putih geser mengikuti tab aktif (lebar tab dibuat permanen
  // supaya hover tidak menggeser layout dan pill tidak ikut-ikutan)
  let tabsEl = null;
  let indicatorStyle = 'opacity: 0;';

  async function updateIndicator() {
    await tick();
    if (!tabsEl) return;
    const btn = tabsEl.querySelector('.tab.active');
    if (!btn) {
      indicatorStyle = 'opacity: 0;';
      return;
    }
    const c = tabsEl.getBoundingClientRect();
    const r = btn.getBoundingClientRect();
    const left = r.left - (c.left + tabsEl.clientLeft) + tabsEl.scrollLeft;
    const top = r.top - (c.top + tabsEl.clientTop) + tabsEl.scrollTop;
    indicatorStyle =
      `transform: translateX(${left}px) translateY(${top}px); ` +
      `width: ${r.width}px; height: ${r.height}px; opacity: 1;`;
    try {
      btn.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'auto' });
    } catch {
      /* abaikan */
    }
  }

  $: if (tabsEl || activeId || outfits) updateIndicator();

  onMount(() => {
    updateIndicator();
    const onResize = () => updateIndicator();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  });
</script>

<div class="tabs" role="tablist" aria-label={$t('tabsAria')} bind:this={tabsEl}>
  <div class="tab-indicator" aria-hidden="true" style={indicatorStyle}></div>
  {#each outfits as o}
    <div class="tab-wrap" class:active={o.id === activeId}>
      {#if renamingId === o.id}
        <input
          class="tab-rename"
          type="text"
          maxlength="16"
          bind:value={draft}
          aria-label={$t('renameOutfitLabel')}
          use:autofocus
          on:keydown={onKeydown}
          on:blur={commitRename}
        />
      {:else}
        <button
          class="tab"
          class:active={o.id === activeId}
          role="tab"
          aria-selected={o.id === activeId}
          title={$t('tabHints')}
          on:click={() => select(o)}
          on:dblclick={() => startRename(o)}
          on:pointerdown={() => startPress(o)}
          on:pointerup={clearPress}
          on:pointercancel={clearPress}
          on:pointerleave={clearPress}
          on:contextmenu={(e) => onContextMenu(e, o)}
        >
          <span class="tab-letter" aria-hidden="true">{letterOf(o)}</span>
          <span class="tab-name">{o.name}</span>
        </button>
        {/if}
    </div>
  {/each}

  {#if outfits.length < MAX_OUTFITS}
    <button class="tab-add" on:click={onAdd} aria-label={$t('addOutfit')} title={$t('addOutfit')}>
      <Plus size={16} />
    </button>
  {/if}
</div>

{#if confirmOutfit}
  <div
    class="tab-backdrop"
    transition:fade={{ duration: 150 }}
    on:click={() => (confirmOutfit = null)}
    on:keydown={(e) => {
      if (e.key === 'Escape') confirmOutfit = null;
    }}
  >
    <div
      class="tab-confirm"
      transition:scale={{ duration: 160, start: 0.92 }}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
      aria-label={$t('deleteOutfitConfirm', { name: confirmOutfit.name })}
      on:click|stopPropagation
    >
      <span class="tab-confirm-text">{$t('deleteOutfitConfirm', { name: confirmOutfit.name })}</span>
      <div class="tab-confirm-actions">
        <button class="tab-confirm-btn danger" on:click={confirmDelete}>{$t('delete')}</button>
        <button class="tab-confirm-btn" on:click={() => (confirmOutfit = null)}>{$t('cancel')}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .tabs {
    position: fixed;
    bottom: max(16px, env(safe-area-inset-bottom));
    left: 50%;
    transform: translateX(-50%);
    z-index: 40;
    display: flex;
    align-items: center;
    gap: 6px;
    max-width: calc(100vw - 24px);
    padding: 7px;
    border-radius: 999px;
    border: 1px solid var(--colors-card-line);
    background: color-mix(in srgb, var(--colors-card-bg) 85%, transparent);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.45);
    overflow-x: auto;
    scrollbar-width: none;
  }

  .tabs::-webkit-scrollbar {
    display: none;
  }

  .tab-wrap {
    position: relative;
    flex-shrink: 0;
    z-index: 1;
  }

  .tab-indicator {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0;
    opacity: 0;
    border-radius: 999px;
    background: var(--colors-number);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    transition:
      transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
      width 320ms cubic-bezier(0.22, 1, 0.36, 1),
      height 320ms cubic-bezier(0.22, 1, 0.36, 1),
      opacity 200ms ease;
    will-change: transform, width;
    pointer-events: none;
    z-index: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .tab-indicator {
      transition: none;
    }
  }

  .tab {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 6px 12px 6px 6px;
    border: 1px solid transparent;
    border-radius: 999px;
    background: transparent;
    color: var(--colors-label);
    font-family: 'Inter', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
    transition:
      background 0.18s ease,
      color 0.18s ease,
      border-color 0.18s ease,
      transform 0.1s ease;
  }

  .tab:hover {
    color: var(--colors-number);
    background: color-mix(in srgb, var(--colors-hover-bg) 55%, transparent);
  }

  .tab:active {
    transform: scale(0.96);
  }

  .tab.active {
    background: transparent;
    border-color: transparent;
    color: var(--colors-card-bg);
    box-shadow: none;
  }

  .tab.active:hover {
    background: transparent;
    color: var(--colors-card-bg);
  }

  .tab-letter {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-family: 'Orbitron', monospace;
    font-size: 0.68rem;
    font-weight: 700;
    background: var(--colors-input-bg);
    border: 1px solid var(--colors-card-line);
    color: var(--colors-number);
  }

  .tab.active .tab-letter {
    background: rgba(0, 0, 0, 0.14);
    border-color: transparent;
    color: var(--colors-card-bg);
  }

  .tab-name {
    max-width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .tab-add {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    border: 1.5px dashed var(--colors-card-line);
    background: transparent;
    color: var(--colors-label);
    cursor: pointer;
    transition:
      color 0.15s ease,
      border-color 0.15s ease,
      background 0.15s ease,
      transform 0.1s ease;
  }

  .tab-add:hover {
    color: var(--colors-number);
    border-color: var(--colors-number);
    background: var(--colors-input-bg);
  }

  .tab-add:active {
    transform: scale(0.92);
  }

  .tab-rename {
    width: 130px;
    padding: 7px 14px;
    border: 1px solid var(--colors-number);
    border-radius: 999px;
    background: var(--colors-input-bg);
    color: var(--colors-number);
    font-family: 'Inter', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    outline: none;
  }

  /* Confirm delete dialog */
  .tab-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 60;
  }

  .tab-confirm {
    background: var(--colors-card-bg);
    border: 1px solid var(--colors-card-line);
    border-radius: 20px;
    padding: 20px 24px;
    text-align: center;
    box-shadow: 0 24px 50px rgba(0, 0, 0, 0.5);
  }

  .tab-confirm-text {
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--colors-number);
    margin-bottom: 16px;
  }

  .tab-confirm-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .tab-confirm-btn {
    border: 1px solid var(--colors-card-line);
    background: var(--colors-input-bg);
    color: var(--colors-number);
    border-radius: 10px;
    padding: 9px 18px;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.15s ease,
      filter 0.15s ease,
      transform 0.1s ease;
  }

  .tab-confirm-btn:hover {
    background: var(--colors-hover-bg);
  }

  .tab-confirm-btn:active {
    transform: scale(0.96);
  }

  .tab-confirm-btn.danger {
    border: none;
    background: var(--colors-number-alert);
    color: #fff;
  }

  .tab-confirm-btn.danger:hover {
    filter: brightness(1.1);
  }

  @media (min-width: 768px) {
    /* MacBook-style notch hanging from the top edge: black, flat top, rounded bottom */
    .tabs {
      position: static;
      transform: none;
      margin: 0 auto;
      max-width: min(92vw, calc(100vw - 260px));
      padding: 18px 14px 14px;
      border: none;
      border-radius: 0 0 22px 22px;
      background: linear-gradient(180deg, #121218, #09090c);
      box-shadow:
        0 16px 32px rgba(0, 0, 0, 0.45),
        inset 0 1px 0 rgba(255, 255, 255, 0.07);
    }

    /* The notch stays black in both themes, so pin light text/accents on it */
    .tab-indicator {
      background: #f2f2f7;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.45);
    }

    .tab {
      color: #9a9aa6;
    }

    .tab:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
    }

    .tab.active {
      background: transparent;
      color: #0b0b0f;
    }

    .tab.active:hover {
      background: transparent;
      color: #0b0b0f;
    }

    .tab-letter {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.16);
      color: #e5e5ea;
    }

    .tab.active .tab-letter {
      background: rgba(0, 0, 0, 0.15);
      border-color: transparent;
      color: #0b0b0f;
    }

    .tab-add {
      color: #9a9aa6;
      border-color: rgba(255, 255, 255, 0.28);
    }

    .tab-add:hover {
      color: #ffffff;
      border-color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
    }

  }
</style>
