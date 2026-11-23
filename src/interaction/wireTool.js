import { projectState, notify } from "../state/projectState.js";
import { screenToWorld } from "../canvas/coordinates.js";
import { isViewPan } from "../canvas/cameraInput.js";
import { push } from "../history/history.js";
import { getPinWorldPosition } from "../canvas/pinPositions.js";
import { setWireDragPreview } from "../canvas/wireRender.js";
import { wireOutputState } from "../canvas/wireStore.js";

const HIT_R = 12;
const OUT_PINS = new Set(["out", "out_Q"]);
const IN_PINS = new Set(["in_A", "in_B", "in_D", "in_CLK", "in"]);

let wireSeq = 0;

function freshWireId() {
  wireSeq += 1;
  let id = `wire_${wireSeq}`;
  let n = 0;
  while (id in projectState.wires) {
    n += 1;
    id = `wire_${wireSeq}_${n}`;
  }
  return id;
}

function inputOccupied(nodeId, pin) {
  return Object.values(projectState.wires).some(
    (w) => w.toNode === nodeId && w.toPin === pin
  );
}

/** @param {number} wx @param {number} wy */
function hitPin(wx, wy) {
  let best = null;
  let bestD = HIT_R;
  for (const [nodeId, node] of Object.entries(projectState.nodes)) {
    const pins = [
      ...Object.keys(node.inputStates),
      ...Object.keys(node.outputStates),
    ];
    for (const pin of pins) {
      const p = getPinWorldPosition(nodeId, pin);
      const d = Math.hypot(p.x - wx, p.y - wy);
      if (d < bestD) {
        bestD = d;
        const dir = OUT_PINS.has(pin) ? "out" : "in";
        best = { nodeId, pin, dir };
      }
    }
  }
  return best;
}

export function initWireTool() {
  const root = document.getElementById("canvas-root");
  if (!root) return;

  /** @type {{ fromNode: string, fromPin: string, pointerId: number } | null} */
  let drag = null;

  const screenFrom = (event) => {
    const r = root.getBoundingClientRect();
    return { x: event.clientX - r.left, y: event.clientY - r.top };
  };

  const endDrag = () => {
    drag = null;
    setWireDragPreview(null);
  };

  root.addEventListener(
    "pointerdown",
    (event) => {
      if (isViewPan(event) || event.button !== 0) return;
      const screen = screenFrom(event);
      const world = screenToWorld(screen.x, screen.y, projectState.camera);
      const pin = hitPin(world.x, world.y);
      if (!pin || pin.dir !== "out" || !OUT_PINS.has(pin.pin)) return;
      drag = { fromNode: pin.nodeId, fromPin: pin.pin, pointerId: event.pointerId };
      setWireDragPreview({ ...drag, x: world.x, y: world.y });
      event.stopImmediatePropagation();
      root.setPointerCapture(event.pointerId);
    },
    true
  );

  root.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const screen = screenFrom(event);
    const world = screenToWorld(screen.x, screen.y, projectState.camera);
    setWireDragPreview({ ...drag, x: world.x, y: world.y });
  });

  const finish = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const screen = screenFrom(event);
    const world = screenToWorld(screen.x, screen.y, projectState.camera);
    const target = hitPin(world.x, world.y);
    const from = drag;
    if (root.hasPointerCapture(event.pointerId)) {
      root.releasePointerCapture(event.pointerId);
    }
    endDrag();

    if (
      !target ||
      target.dir !== "in" ||
      !IN_PINS.has(target.pin) ||
      target.nodeId === from.fromNode ||
      inputOccupied(target.nodeId, target.pin)
    ) {
      return;
    }

    const id = freshWireId();
    const wire = {
      fromNode: from.fromNode,
      fromPin: from.fromPin,
      toNode: target.nodeId,
      toPin: target.pin,
      state: wireOutputState(from.fromNode, from.fromPin),
    };
    projectState.wires[id] = wire;
    const snap = {
      fromNode: wire.fromNode,
      fromPin: wire.fromPin,
      toNode: wire.toNode,
      toPin: wire.toPin,
    };
    push({
      undo: () => {
        delete projectState.wires[id];
        notify();
      },
      redo: () => {
        projectState.wires[id] = {
          ...structuredClone(snap),
          state: wireOutputState(snap.fromNode, snap.fromPin),
        };
        notify();
      },
    });
    notify();
  };

  root.addEventListener("pointerup", finish);
  root.addEventListener("pointercancel", finish);
}