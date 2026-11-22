import { projectState } from "../state/projectState.js";
import { screenToWorld } from "../canvas/coordinates.js";
import { nodeSizeFor } from "../canvas/nodeSizes.js";
import { GRID_SIZE, snapToGrid } from "../canvas/snap.js";
import { push } from "../history/history.js";
import { insertNodes, removeNodes } from "../history/snapshots.js";
import { freshId } from "./editCommands.js";
import { getSelectedIds, selectMany, selectOnly } from "./selection.js";

/** @type {Record<string, { inputStates: object, outputStates: object }>} */
const PIN_DEFAULTS = {
  AND: { inputStates: { in_A: null, in_B: null }, outputStates: { out_Q: null } },
  OR: { inputStates: { in_A: null, in_B: null }, outputStates: { out_Q: null } },
  XOR: { inputStates: { in_A: null, in_B: null }, outputStates: { out_Q: null } },
  NOT: { inputStates: { in_A: null }, outputStates: { out_Q: null } },
  DFF: { inputStates: { in_D: null, in_CLK: null }, outputStates: { out_Q: null } },
  INPUT: { inputStates: {}, outputStates: { out: 0 } },
  LED: { inputStates: { in_A: null }, outputStates: {} },
};

function overlaps(x, y, w, h) {
  const gap = GRID_SIZE;
  for (const node of Object.values(projectState.nodes)) {
    const size = nodeSizeFor(node.type);
    const nw = size.w * (node.scale || 1);
    const nh = size.h * (node.scale || 1);
    if (
      x < node.x + nw + gap &&
      x + w + gap > node.x &&
      y < node.y + nh + gap &&
      y + h + gap > node.y
    ) {
      return true;
    }
  }
  return false;
}

function viewportCenterWorld() {
  const root = document.getElementById("canvas-root");
  const camera = projectState.camera;
  if (!root) return { x: 0, y: 0 };
  const rect = root.getBoundingClientRect();
  return screenToWorld(rect.width / 2, rect.height / 2, camera);
}

function pickPlacement(type) {
  const size = nodeSizeFor(type);
  const center = viewportCenterWorld();
  let { x, y } = snapToGrid(center.x, center.y);
  let guard = 0;
  while (overlaps(x, y, size.w, size.h) && guard < 500) {
    x += GRID_SIZE;
    guard += 1;
  }
  return { x, y };
}

/** @param {string} type */
export function addComponent(type) {
  const pins = PIN_DEFAULTS[type];
  if (!pins) return;
  const { x, y } = pickPlacement(type);
  const id = freshId(type);
  const node = {
    type,
    x,
    y,
    rotation: 0,
    scale: 1,
    inputStates: structuredClone(pins.inputStates),
    outputStates: structuredClone(pins.outputStates),
  };
  const created = { [id]: node };
  const prevSel = getSelectedIds();
  insertNodes(created);
  selectOnly(id);
  push({
    undo: () => {
      removeNodes([id]);
      selectMany(prevSel);
    },
    redo: () => {
      insertNodes(created);
      selectOnly(id);
    },
  });
}

export const PLACEABLE_TYPES = [
  "AND",
  "OR",
  "NOT",
  "XOR",
  "DFF",
  "INPUT",
  "LED",
];