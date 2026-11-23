import { projectState } from "../state/projectState.js";

const selected = new Set();
const listeners = new Set();

function emit() {
  for (const fn of listeners) fn();
}

export function subscribeSelection(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function selectOnly(id) {
  selected.clear();
  if (id in projectState.nodes) selected.add(id);
  emit();
}

export function toggle(id) {
  if (!(id in projectState.nodes)) return;
  if (selected.has(id)) selected.delete(id);
  else selected.add(id);
  emit();
}

export function selectMany(ids, { additive = false } = {}) {
  if (!additive) selected.clear();
  for (const id of ids) {
    if (id in projectState.nodes) selected.add(id);
  }
  emit();
}

export function clear() {
  if (selected.size === 0) return;
  selected.clear();
  emit();
}

export function isSelected(id) {
  return selected.has(id);
}

export function getSelectedIds() {
  return [...selected];
}

export function getSelectionCount() {
  return selected.size;
}