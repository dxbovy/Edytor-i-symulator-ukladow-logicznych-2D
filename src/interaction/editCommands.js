import { projectState, notify } from "../state/projectState.js";
import { GRID_SIZE } from "../canvas/snap.js";
import { push } from "../history/history.js";
import {
  applyTransforms,
  captureFullNodes,
  captureTransforms,
  insertNodes,
  removeNodes,
} from "../history/snapshots.js";
import {
  getClipboardItems,
  isClipboardEmpty,
  nextPasteOffset,
  setClipboard,
} from "../clipboard/clipboard.js";
import { getSelectedIds, selectMany } from "./selection.js";
import { rotateSelection90 } from "./rotateScale.js";

export { isClipboardEmpty };

function clipFromNode(node) {
  return {
    type: node.type,
    x: node.x,
    y: node.y,
    rotation: node.rotation,
    scale: node.scale,
    inputStates: structuredClone(node.inputStates),
    outputStates: structuredClone(node.outputStates),
  };
}

let idSeq = 0;
function freshId(type) {
  idSeq += 1;
  let id = `node_${type.toLowerCase()}_${idSeq}`;
  let n = 0;
  while (id in projectState.nodes) {
    n += 1;
    id = `node_${type.toLowerCase()}_${idSeq}_${n}`;
  }
  return id;
}

export function copySelection() {
  const ids = getSelectedIds();
  if (ids.length === 0) return;
  setClipboard(
    ids.map((id) => {
      const node = projectState.nodes[id];
      return node ? clipFromNode(node) : null;
    }).filter(Boolean)
  );
}

export function pasteSelection() {
  const items = getClipboardItems();
  if (!items || items.length === 0) return;
  const gen = nextPasteOffset();
  const offset = gen * GRID_SIZE;
  const prevSel = getSelectedIds();
  /** @type {Record<string, object>} */
  const created = {};
  const createdIds = [];
  for (const item of items) {
    const id = freshId(item.type);
    created[id] = {
      ...structuredClone(item),
      x: item.x + offset,
      y: item.y + offset,
    };
    createdIds.push(id);
  }
  insertNodes(created);
  selectMany(createdIds);
  push({
    undo: () => {
      removeNodes(createdIds);
      selectMany(prevSel);
    },
    redo: () => {
      insertNodes(created);
      selectMany(createdIds);
    },
  });
}

export function deleteSelection() {
  const ids = getSelectedIds();
  if (ids.length === 0) return;
  const saved = captureFullNodes(ids);
  removeNodes(ids);
  selectMany([]);
  push({
    undo: () => {
      insertNodes(saved);
      selectMany(ids);
    },
    redo: () => {
      removeNodes(ids);
      selectMany([]);
    },
  });
}

export function rotateSelection90WithHistory() {
  const ids = getSelectedIds();
  if (ids.length === 0) return;
  const before = captureTransforms(ids);
  rotateSelection90();
  const after = captureTransforms(ids);
  const idList = [...ids];
  push({
    undo: () => {
      applyTransforms(before);
      selectMany(idList);
    },
    redo: () => {
      applyTransforms(after);
      selectMany(idList);
    },
  });
}

/** @param {Record<string, { x: number, y: number, rotation: number, scale: number }>} before */
/** @param {Record<string, { x: number, y: number, rotation: number, scale: number }>} after */
export function pushTransformCommand(before, after, selectionIds) {
  const ids = [...selectionIds];
  push({
    undo: () => {
      applyTransforms(before);
      selectMany(ids);
    },
    redo: () => {
      applyTransforms(after);
      selectMany(ids);
    },
  });
}