<script>
  import { Pencil } from 'lucide-svelte';
  import { fade, scale } from 'svelte/transition';
  import FlipDigit from './FlipDigit.svelte';
  import { sanitizeLabel } from '../stores/clothingStore.js';
  import { t } from '../stores/i18n.js';

  export let labelStore;
  export let fallback = '';
  export let counter;
  export let max;

  let pressTimer;
  let showReset = false;
  let editing = false;
  let draft = '';

  $: label = $labelStore;
  $: padded = String($counter).padStart(2, '0');
  $: tens = Number(padded.charAt(0));
  $: units = Number(padded.charAt(1));
  $: over = $counter >= $max;

  function handleClick() {
    counter.update((n) => (n >= $max ? 0 : n + 1));
  }

  function handlePressStart() {
    showReset = false;
    pressTimer = window.setTimeout(() => {
      showReset = true;
    }, 600);
  }

  function handlePressEnd() {
    if (pressTimer) clearTimeout(pressTimer);
  }

  function handleContextMenu(e) {
    e.preventDefault();
    showReset = true;
  }

  function confirmReset() {
    counter.set(0);
    showReset = false;
  }

  function autofocus(node) {
    node.focus();
    node.select();
  }

  function startEdit() {
    draft = label;
    editing = true;
  }

  function commitEdit() {
    labelStore.set(sanitizeLabel(draft, fallback));
    editing = false;
  }

  function cancelEdit() {
    editing = false;
  }

  function onInputKeydown(e) {
    if (e.isComposing) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      commitEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEdit();
    }
  }

  function onBlur() {
    if (!editing) return;
    commitEdit();
  }

  function onLabelKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      startEdit();
    }
  }
</script>

<div class="relative inline-block counter-wrap">
  <button
    class="flip-card group"
    aria-live="polite"
    on:click={handleClick}
    on:pointerdown={handlePressStart}
    on:pointerup={handlePressEnd}
    on:pointercancel={handlePressEnd}
    on:pointerleave={handlePressEnd}
    on:contextmenu={handleContextMenu}
  >
    <div class="flip-row">
      <FlipDigit value={tens} {over} />
      <FlipDigit value={units} {over} />
    </div>
  </button>

  {#if editing}
    <input
      class="label-input"
      type="text"
      maxlength="20"
      bind:value={draft}
      aria-label={$t('renameLabel')}
      use:autofocus
      on:keydown={onInputKeydown}
      on:blur={onBlur}
    />
  {:else}
    <button
      class="card-label"
      type="button"
      title={$t('renameLabel')}
      aria-label={$t('rename', { label })}
      on:click={startEdit}
      on:keydown={onLabelKeydown}
    >
      <span class="label-text">{label}</span>
      <span class="label-icon" aria-hidden="true"><Pencil size={11} /></span>
    </button>
  {/if}
</div>

{#if showReset}
  <div class="reset-dialog" transition:fade={{ duration: 150 }} role="dialog" aria-modal="true">
    <div class="reset-panel" transition:scale={{ duration: 160, start: 0.92 }}>
      <span class="reset-question">{$t('resetQuestion', { label })}</span>
      <div class="reset-actions">
        <button class="reset-btn confirm" on:click={confirmReset}>{$t('yes')}</button>
        <button class="reset-btn cancel" on:click={() => (showReset = false)}>{$t('cancel')}</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .counter-wrap {
    text-align: center;
  }

  .flip-card {
    position: relative;
    width: 280px;
    height: 220px;
    border-radius: 24px;
    background: var(--colors-card-bg);
    overflow: hidden;
    border: none;
    padding: 0;
    cursor: pointer;
    box-shadow:
      0 10px 15px rgba(0, 0, 0, 0.25),
      0 4px 6px rgba(0, 0, 0, 0.15);
    transition: transform 0.1s ease;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .flip-card:active {
    transform: scale(0.97);
  }

  .flip-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    height: 100%;
  }

  .card-label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    gap: 5px;
    margin: 12px auto 0;
    padding: 6px 10px;
    border: 1px solid transparent;
    border-radius: 8px;
    background: transparent;
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    color: var(--colors-label);
    cursor: pointer;
    transition:
      color 0.15s ease,
      border-color 0.15s ease,
      background 0.15s ease,
      transform 0.1s ease;
  }

  .card-label:hover,
  .card-label:focus-visible {
    color: var(--colors-number);
    border-color: var(--colors-card-line);
    background: var(--colors-input-bg);
  }

  .card-label:active {
    transform: scale(0.96);
  }

  .card-label:focus-visible {
    outline: none;
  }

  .label-icon {
    display: inline-flex;
    opacity: 0.5;
    transition:
      opacity 0.15s ease,
      transform 0.15s ease;
  }

  .card-label:hover .label-icon,
  .card-label:focus-visible .label-icon {
    opacity: 1;
    transform: translateY(-1px);
  }

  .label-input {
    display: block;
    margin: 12px auto 0;
    width: 160px;
    padding: 4px 10px;
    border: 1px solid var(--colors-card-line);
    border-radius: 8px;
    background: var(--colors-input-bg);
    color: var(--colors-number);
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    text-align: center;
    outline: none;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .label-input:focus {
    border-color: var(--colors-number);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--colors-number) 30%, transparent);
  }

  .reset-dialog {
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

  .reset-panel {
    background: var(--colors-card-bg);
    border: 1px solid var(--colors-card-line);
    border-radius: 20px;
    padding: 20px 24px;
    text-align: center;
    box-shadow: 0 24px 50px rgba(0, 0, 0, 0.5);
  }

  .reset-question {
    font-family: 'Inter', sans-serif;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--colors-number);
    margin-bottom: 16px;
  }

  .reset-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .reset-btn {
    border: none;
    border-radius: 10px;
    padding: 9px 18px;
    font-family: 'Inter', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition:
      filter 0.15s ease,
      background 0.15s ease,
      transform 0.1s ease;
  }

  .reset-btn:active {
    transform: scale(0.96);
  }

  .confirm {
    background: var(--colors-number-alert);
    color: #fff;
  }

  .confirm:hover {
    filter: brightness(1.1);
  }

  .cancel {
    background: var(--colors-input-bg);
    border: 1px solid var(--colors-card-line);
    color: var(--colors-number);
  }

  .cancel:hover {
    background: var(--colors-hover-bg);
  }
</style>
