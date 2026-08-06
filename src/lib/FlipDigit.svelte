<script>
  export let value = 0;
  export let over = false;

  // Value shown by the base layers (the NEW value)
  let shown = value;
  // Over-state matching `shown` (color of the NEW halves)
  let shownOver = over;
  // Value + over-state shown by the falling card & old bottom (the OLD value)
  let flipFrom = value;
  let flipFromOver = over;
  // Incremented on every change to restart the CSS animation (keyed block)
  let frame = 0;

  $: if (value !== shown) {
    flipFrom = shown;
    flipFromOver = shownOver;
    shown = value;
    shownOver = over;
    frame += 1;
  }
</script>

<div class="flip-cell" class:over>
  <div class="half base-top"><span class="digit">{value}</span></div>
  <!-- Never-flipped cells show the current value, so they follow the live over state;
       once flipped, the bottom shows the old value during flips (covered afterward). -->
  <div class="half base-bottom" class:over={frame === 0 ? over : flipFromOver}>
    <span class="digit">{flipFrom}</span>
  </div>

  {#if frame > 0}
    {#key frame}
      <div class="card">
        <div class="face card-front" class:over={flipFromOver}>
          <span class="digit">{flipFrom}</span>
        </div>
        <div class="face card-back">
          <span class="digit">{value}</span>
        </div>
      </div>
    {/key}
  {/if}

  <div class="hinge" aria-hidden="true"></div>
</div>

<style>
  .flip-cell {
    position: relative;
    width: 126px;
    height: 200px;
    perspective: 700px;
  }

  .half {
    position: absolute;
    left: 0;
    right: 0;
    height: 50%;
    overflow: hidden;
    background: var(--colors-card-bg);
  }

  .base-top {
    top: 0;
  }

  .base-bottom {
    bottom: 0;
  }

  .digit {
    position: absolute;
    left: 0;
    right: 0;
    height: 200%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Orbitron', monospace;
    font-weight: 700;
    font-size: 6rem;
    line-height: 1;
    color: var(--colors-number);
    pointer-events: none;
    user-select: none;
  }

  .base-top .digit,
  .card-front .digit {
    top: 0;
  }

  .base-bottom .digit,
  .card-back .digit {
    bottom: 0;
  }

  /* NEW-value halves take the NEW over state */
  .flip-cell.over .base-top .digit,
  .flip-cell.over .card-back .digit {
    color: var(--colors-number-alert);
  }

  /* OLD-value halves keep the OLD over state */
  .base-bottom.over .digit,
  .card-front.over .digit {
    color: var(--colors-number-alert);
  }

  .card {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    transform-origin: 50% 100%;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    z-index: 2;
    animation: card-fall 0.45s cubic-bezier(0.55, 0, 0.85, 0.36) forwards;
  }

  .face {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background: var(--colors-card-bg);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .card-back {
    transform: rotateX(180deg);
  }

  @keyframes card-fall {
    0% {
      transform: rotateX(0deg);
    }
    70% {
      transform: rotateX(-178deg);
    }
    85% {
      transform: rotateX(-184deg);
    }
    100% {
      transform: rotateX(-180deg);
    }
  }

  .hinge {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    transform: translateY(-50%);
    background: var(--colors-card-line);
    z-index: 3;
    pointer-events: none;
  }
</style>
