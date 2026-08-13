<script>
  import { Settings, HelpCircle, X, Moon, Sun, Minus, Plus, Trash2, TriangleAlert } from 'lucide-svelte';
  import { fade, scale } from 'svelte/transition';
  import Counter from './lib/Counter.svelte';
  import { counterBaju, counterCelana, maxBaju, maxCelana, labelBaju, labelCelana, themeMode } from './stores/clothingStore.js';
  import { language, t } from './stores/i18n.js';

  $: themeClass = $themeMode === 'dark' ? 'dark' : 'light';
  $: isDark = $themeMode === 'dark';
  $: if (typeof document !== 'undefined') document.documentElement.lang = $language === 'en' ? 'en' : 'id';

  let showSettings = false;
  let showHelp = false;
  let confirmResetOpen = false;

  function toggleTheme(mode) {
    themeMode.set(mode);
  }

  function adjustMax(store, delta) {
    store.update((n) => {
      const val = Number(n) || 1;
      return Math.min(99, Math.max(1, val + delta));
    });
  }

  function resetAll() {
    counterBaju.set(0);
    counterCelana.set(0);
    confirmResetOpen = false;
  }

  function closeSettings() {
    showSettings = false;
    confirmResetOpen = false;
    requestAnimationFrame(() => document.querySelector('.gear')?.focus());
  }

  function closeHelp() {
    showHelp = false;
    requestAnimationFrame(() => document.querySelector('.help-btn')?.focus());
  }

  function onKeydown(e) {
    if (e.key === 'Escape') {
      if (showHelp) closeHelp();
      else if (showSettings) closeSettings();
    }
  }

  function focusPanel(node) {
    node.focus();
    return {};
  }
</script>

<svelte:window on:keydown={onKeydown} />

<div class={['app', themeClass]}>
  <header class="header">
    <div class="header-actions">
      <button
        class="help-btn"
        on:click={() => (showHelp = true)}
        aria-label={$t('helpBtnAria')}
        aria-haspopup="dialog"
      >
        <HelpCircle />
      </button>
      <button class="gear" on:click={() => (showSettings = true)} aria-label={$t('gearAria')} aria-haspopup="dialog">
        <Settings />
      </button>
    </div>
  </header>

  <main class="main">
    <div class="grid">
      <Counter labelStore={labelBaju} fallback="Shirt" counter={counterBaju} max={maxBaju} />
      <Counter labelStore={labelCelana} fallback="Pants" counter={counterCelana} max={maxCelana} />
    </div>
  </main>

  {#if showHelp}
  <div class="settings-backdrop" transition:fade={{ duration: 150 }} on:click={closeHelp}>
    <div
      class="settings-panel"
      transition:scale={{ duration: 180, start: 0.92 }}
      on:click|stopPropagation
      role="dialog"
      aria-modal="true"
      aria-label={$t('helpDialogAria')}
      tabindex="-1"
      use:focusPanel
    >
      <header class="settings-head">
        <div class="head-left">
          <span class="head-icon"><HelpCircle size={18} /></span>
          <div class="head-text">
            <h2 class="settings-title">{$t('helpTitle')}</h2>
            <p class="settings-sub">{$t('helpSub')}</p>
          </div>
        </div>
        <button class="close-btn" on:click={closeHelp} aria-label={$t('closeHelp')}>
          <X size={18} />
        </button>
      </header>

      <ol class="help-list">
        {#each $t('helpSteps') as step, i}
          <li class="help-item">
            <span class="help-num" aria-hidden="true">{i + 1}</span>
            <div class="help-body">
              <p class="help-title">{step.title}</p>
              <p class="help-desc">{@html step.desc}</p>
            </div>
          </li>
        {/each}
      </ol>
    </div>
  </div>
  {/if}

  {#if showSettings}
  <div class="settings-backdrop" transition:fade={{ duration: 150 }} on:click={closeSettings}>
    <div
      class="settings-panel"
      transition:scale={{ duration: 180, start: 0.92 }}
      on:click|stopPropagation
      role="dialog"
      aria-modal="true"
      aria-label={$t('settingsAria')}
      tabindex="-1"
      use:focusPanel
    >
      <header class="settings-head">
        <div class="head-left">
          <span class="head-icon"><Settings size={18} /></span>
          <div class="head-text">
            <h2 class="settings-title">{$t('settingsTitle')}</h2>
            <p class="settings-sub">{$t('settingsSub')}</p>
          </div>
        </div>
        <button class="close-btn" on:click={closeSettings} aria-label={$t('closeSettings')}>
          <X size={18} />
        </button>
      </header>

      <div class="setting-section">
        <p class="section-title">{$t('maxLimits')}</p>

        <div class="setting-row">
          <span class="setting-label">{$labelBaju}</span>
          <div class="stepper">
            <button class="step-btn" on:click={() => adjustMax(maxBaju, -1)} aria-label={$t('decreaseLimit', { label: $labelBaju })}>
              <Minus size={14} />
            </button>
            <span class="step-value">{$maxBaju}</span>
            <button class="step-btn" on:click={() => adjustMax(maxBaju, 1)} aria-label={$t('increaseLimit', { label: $labelBaju })}>
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div class="setting-row">
          <span class="setting-label">{$labelCelana}</span>
          <div class="stepper">
            <button class="step-btn" on:click={() => adjustMax(maxCelana, -1)} aria-label={$t('decreaseLimit', { label: $labelCelana })}>
              <Minus size={14} />
            </button>
            <span class="step-value">{$maxCelana}</span>
            <button class="step-btn" on:click={() => adjustMax(maxCelana, 1)} aria-label={$t('increaseLimit', { label: $labelCelana })}>
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      <div class="setting-section">
        <p class="section-title">{$t('themeTitle')}</p>
        <div class="segmented" role="radiogroup" aria-label={$t('themeAria')}>
          <button
            class:active={isDark}
            role="radio"
            aria-checked={isDark}
            on:click={() => toggleTheme('dark')}
          >
            <Moon size={14} /> {$t('dark')}
          </button>
          <button
            class:active={!isDark}
            role="radio"
            aria-checked={!isDark}
            on:click={() => toggleTheme('light')}
          >
            <Sun size={14} /> {$t('light')}
          </button>
        </div>
      </div>

      <div class="setting-section">
        <p class="section-title">{$t('languageTitle')}</p>
        <div class="segmented" role="radiogroup" aria-label={$t('languageAria')}>
          <button
            class:active={$language === 'id'}
            role="radio"
            aria-checked={$language === 'id'}
            on:click={() => language.set('id')}
          >
            Indonesia
          </button>
          <button
            class:active={$language === 'en'}
            role="radio"
            aria-checked={$language === 'en'}
            on:click={() => language.set('en')}
          >
            English
          </button>
        </div>
      </div>

      <section class="danger-zone">
        {#if confirmResetOpen}
          <div class="danger-confirm" transition:fade={{ duration: 120 }}>
            <div class="danger-confirm-text">
              <TriangleAlert size={16} />
              <span>{$t('resetAllConfirm')}</span>
            </div>
            <div class="danger-actions">
              <button class="danger-cancel" on:click={() => (confirmResetOpen = false)}>{$t('cancel')}</button>
              <button class="danger-confirm-btn" on:click={resetAll}>{$t('yesReset')}</button>
            </div>
          </div>
        {:else}
          <button class="danger-btn" transition:fade={{ duration: 120 }} on:click={() => (confirmResetOpen = true)}>
            <Trash2 size={15} />
            {$t('resetAll')}
          </button>
        {/if}
      </section>
    </div>
  </div>
  {/if}
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--colors-page-bg);
  }

  .header {
    display: flex;
    justify-content: flex-end;
    padding: 16px 20px;
  }

  .header-actions {
    display: flex;
    gap: 10px;
  }

  .gear,
  .help-btn {
    background: var(--colors-card-bg);
    border: 1px solid var(--colors-card-line);
    border-radius: 12px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.35);
    color: var(--colors-gear);
    transition:
      transform 0.3s ease,
      background 0.15s ease;
  }

  .gear:hover,
  .help-btn:hover {
    background: var(--colors-hover-bg);
  }

  .gear:hover {
    transform: rotate(45deg);
  }

  .help-btn:hover {
    transform: translateY(-2px);
  }

  .help-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .help-item {
    display: flex;
    gap: 12px;
    padding: 10px 12px;
    border: 1px solid var(--colors-card-line);
    border-radius: 12px;
    background: var(--colors-input-bg);
  }

  .help-num {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Orbitron', monospace;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--colors-number);
    background: var(--colors-card-bg);
    border: 1px solid var(--colors-card-line);
  }

  .help-body {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .help-title {
    margin: 0;
    font-size: 0.83rem;
    font-weight: 700;
    color: var(--colors-number);
  }

  .help-desc {
    margin: 0;
    font-size: 0.75rem;
    line-height: 1.5;
    color: var(--colors-label);
  }

  .help-desc :global(strong) {
    color: var(--colors-number);
  }

  .main {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
  }

  .grid {
    display: grid;
    gap: 24px;
    grid-template-columns: 1fr;
    place-items: center;
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    .grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  /* ---------- Settings Modal ---------- */

  .settings-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 50;
  }

  .settings-panel {
    width: min(92vw, 380px);
    background: var(--colors-card-bg);
    border: 1px solid var(--colors-card-line);
    border-radius: 24px;
    padding: 20px;
    box-shadow: 0 24px 50px rgba(0, 0, 0, 0.5);
    font-family: 'Inter', sans-serif;
    max-height: calc(100vh - 40px);
    overflow-y: auto;
  }

  .settings-panel:focus {
    outline: none;
  }

  .settings-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--colors-card-line);
  }

  .head-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .head-icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--colors-input-bg);
    border: 1px solid var(--colors-card-line);
    color: var(--colors-number);
  }

  .head-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .settings-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: var(--colors-number);
  }

  .settings-sub {
    margin: 0;
    font-size: 0.72rem;
    color: var(--colors-label);
  }

  .close-btn {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    border: 1px solid var(--colors-card-line);
    background: var(--colors-input-bg);
    color: var(--colors-number);
    cursor: pointer;
    transition:
      background 0.15s ease,
      transform 0.15s ease;
  }

  .close-btn:hover {
    background: var(--colors-hover-bg);
  }

  .close-btn:active {
    transform: scale(0.92);
  }

  .setting-section {
    margin-bottom: 18px;
  }

  .section-title {
    margin: 0 0 8px;
    font-size: 0.68rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--colors-label);
  }

  .setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    border: 1px solid var(--colors-card-line);
    border-radius: 12px;
    background: var(--colors-input-bg);
    margin-bottom: 8px;
  }

  .setting-label {
    font-size: 0.85rem;
    color: var(--colors-number);
  }

  .stepper {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .step-btn {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 1px solid var(--colors-card-line);
    background: var(--colors-card-bg);
    color: var(--colors-number);
    cursor: pointer;
    transition:
      background 0.15s ease,
      transform 0.1s ease;
  }

  .step-btn:hover {
    background: var(--colors-hover-bg);
  }

  .step-btn:active {
    transform: scale(0.9);
  }

  .step-value {
    min-width: 42px;
    text-align: center;
    font-family: 'Orbitron', monospace;
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--colors-number);
  }

  .segmented {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4px;
    padding: 4px;
    border: 1px solid var(--colors-card-line);
    border-radius: 12px;
    background: var(--colors-input-bg);
  }

  .segmented button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 8px 10px;
    border: none;
    border-radius: 9px;
    background: transparent;
    color: var(--colors-label);
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      background 0.18s ease,
      color 0.18s ease,
      box-shadow 0.18s ease;
  }

  .segmented button.active {
    background: var(--colors-card-bg);
    color: var(--colors-number);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
  }

  .danger-zone {
    border: 1px solid var(--colors-danger-line);
    border-radius: 12px;
    background: var(--colors-danger-bg);
    padding: 10px;
  }

  .danger-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--colors-number-alert);
    font-family: 'Inter', sans-serif;
    font-size: 0.83rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .danger-btn:hover {
    background: var(--colors-danger-bg-hover);
  }

  .danger-confirm {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .danger-confirm-text {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.83rem;
    font-weight: 600;
    color: var(--colors-number-alert);
  }

  .danger-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  .danger-cancel {
    border: 1px solid var(--colors-card-line);
    background: var(--colors-input-bg);
    color: var(--colors-number);
    border-radius: 8px;
    padding: 7px 14px;
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .danger-cancel:hover {
    background: var(--colors-hover-bg);
  }

  .danger-confirm-btn {
    border: none;
    background: var(--colors-number-alert);
    color: #fff;
    border-radius: 8px;
    padding: 7px 14px;
    font-family: 'Inter', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      filter 0.15s ease,
      transform 0.1s ease;
  }

  .danger-confirm-btn:hover {
    filter: brightness(1.1);
  }

  .danger-confirm-btn:active {
    transform: scale(0.96);
  }
</style>
