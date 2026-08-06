<script>
  import { fade, scale } from 'svelte/transition';
  import FlipDigit from './FlipDigit.svelte';

  export let label = '';
  export let counter;
  export let max;

  let pressTimer;
  let showReset = false;

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
</script>

<div class="relative inline-block">
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
  <span class="card-label">{label}</span>
</div>

{#if showReset}
  <div class="reset-dialog" transition:fade={{ duration: 150 }} role="dialog" aria-modal="true">
    <div class="reset-panel" transition:scale={{ duration: 160, start: 0.92 }}>
      <span class="reset-question">Reset {label} ke 0?</span>
      <div class="reset-actions">
        <button class="reset-btn confirm" on:click={confirmReset}>Ya</button>
        <button class="reset-btn cancel" on:click={() => (showReset = false)}>Batal</button>
      </div>
    </div>
  </div>
{/if}

<style>
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
    display: block;
    margin: 12px auto 0;
    text-align: center;
    font-family: 'Inter', sans-serif;
    font-size: 0.75rem;
    color: var(--colors-label);
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
