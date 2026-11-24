const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

// Keeps Tab inside a dialog and returns focus to the trigger when it unmounts.
export function focusTrap(node) {
  const previous = document.activeElement;
  const items = () => [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.getClientRects().length > 0);

  node.focus();

  function onKeydown(e) {
    if (e.key !== 'Tab') return;
    const list = items();
    if (!list.length) {
      e.preventDefault();
      return;
    }
    const i = list.indexOf(document.activeElement);
    const next = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : i === list.length - 1 || i === -1 ? 0 : i + 1;
    e.preventDefault();
    list[next].focus();
  }

  node.addEventListener('keydown', onKeydown);
  return {
    destroy() {
      node.removeEventListener('keydown', onKeydown);
      if (previous instanceof HTMLElement && previous !== document.body && document.contains(previous)) {
        previous.focus();
      }
    },
  };
}
