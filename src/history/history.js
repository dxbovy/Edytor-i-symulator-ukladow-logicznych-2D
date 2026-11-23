const MAX = 50;
/** @type {{ undo: () => void, redo: () => void }[]} */
let stack = [];
let index = -1;
const listeners = new Set();

function emit() {
  for (const fn of listeners) fn();
}

/** @param {{ undo: () => void, redo: () => void }} cmd */
export function push(cmd) {
  stack = stack.slice(0, index + 1);
  stack.push(cmd);
  if (stack.length > MAX) stack.shift();
  index = stack.length - 1;
  emit();
}

export function undo() {
  if (index < 0) return;
  stack[index].undo();
  index -= 1;
  emit();
}

export function redo() {
  if (index >= stack.length - 1) return;
  index += 1;
  stack[index].redo();
  emit();
}

export function canUndo() {
  return index >= 0;
}

export function canRedo() {
  return index < stack.length - 1;
}

/** @param {() => void} fn */
export function subscribeHistory(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}