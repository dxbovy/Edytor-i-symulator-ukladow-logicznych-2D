/** @typedef {{ type: string, x: number, y: number, rotation: number, scale: number, inputStates: object, outputStates: object }} ClipNode */

/** @type {ClipNode[] | null} */
let items = null;
let pasteGeneration = 0;
const listeners = new Set();

function emit() {
  for (const fn of listeners) fn();
}

export function isClipboardEmpty() {
  return !items || items.length === 0;
}

/** @param {ClipNode[]} next */
export function setClipboard(next) {
  items = next.map((n) => structuredClone(n));
  pasteGeneration = 0;
  emit();
}

export function getClipboardItems() {
  return items ? items.map((n) => structuredClone(n)) : null;
}

export function nextPasteOffset() {
  pasteGeneration += 1;
  return pasteGeneration;
}

/** @param {() => void} fn */
export function subscribeClipboard(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}