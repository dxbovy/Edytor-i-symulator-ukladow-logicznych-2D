import { projectState, notify } from "../state/projectState.js";
import { screenToWorld } from "../canvas/coordinates.js";
import { isViewPan } from "../canvas/cameraInput.js";
import { push } from "../history/history.js";
import { getPinWorldPosition } from "../canvas/pinPositions.js";
import { setWireDragPreview } from "../canvas/wireRender.js";
import { setHoveredInputPin } from "../canvas/portRender.js";
import {
  findWireAtInput,
  syncWireInputs,
  wireOutputState,
} from "../canvas/wireStore.js";

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

function wireSnapshot(wire) {
  return {
    fromNode: wire.fromNode,
    fromPin: wire.fromPin,
    toNode: wire.toNode,
    toPin: wire.toPin,
  };
}

function applyWireSnap(snap) {
  const id = freshWireId();
  projectState.wires[id] = {
    ...structuredClone(snap),
    state: wireOutputState(snap.fromNode, snap.fromPin),
  };
  syncWireInputs();
  return id;
}

export function initWireTool() {
  const root = document.getElementById("canvas-root");
  if (!root) return;

  /** @type {{ fromNode: string, fromPin: string, pointerId: number, pulled?: { snap: object } } | null} */
  let drag = null;

  const screenFrom = (event) => {
    const r = root.getBoundingClientRect();
    return { x: event.clientX - r.left, y: event.clientY - r.top };
  };

  const endDrag = () => {
    drag = null;
    setWireDragPreview(null);
    setHoveredInputPin(null);
  };

  root.addEventListener(
    "pointerdown",
    (event) => {
      if (isViewPan(event) || event.button !== 0) return;
      const screen = screenFrom(event);
      const world = screenToWorld(screen.x, screen.y, projectState.camera);
      const pin = hitPin(world.x, world.y);
      if (!pin) return;

      if (pin.dir === "in" && IN_PINS.has(pin.pin)) {
        const attached = findWireAtInput(pin.nodeId, pin.pin);
        if (!attached) return;
        const snap = wireSnapshot(attached.wire);
        delete projectState.wires[attached.id];
        syncWireInputs();
        notify();
        drag = {
          fromNode: snap.fromNode,
          fromPin: snap.fromPin,
          pointerId: event.pointerId,
          pulled: { snap },
        };
        setWireDragPreview({ ...drag, x: world.x, y: world.y });
        event.stopImmediatePropagation();
        root.setPointerCapture(event.pointerId);
        return;
      }

      if (pin.dir !== "out" || !OUT_PINS.has(pin.pin)) return;
      drag = { fromNode: pin.nodeId, fromPin: pin.pin, pointerId: event.pointerId };
      setWireDragPreview({ ...drag, x: world.x, y: world.y });
      event.stopImmediatePropagation();
      root.setPointerCapture(event.pointerId);
    },
    true
  );

  root.addEventListener("pointermove", (event) => {
    const screen = screenFrom(event);
    const world = screenToWorld(screen.x, screen.y, projectState.camera);
    const near = hitPin(world.x, world.y);
    if (near?.dir === "in" && IN_PINS.has(near.pin)) {
      setHoveredInputPin({ nodeId: near.nodeId, pin: near.pin });
    } else {
      setHoveredInputPin(null);
    }
    if (!drag || event.pointerId !== drag.pointerId) return;
    const preview = { ...drag, x: world.x, y: world.y };
    if (near?.dir === "in" && IN_PINS.has(near.pin)) {
      preview.toNode = near.nodeId;
      preview.toPin = near.pin;
    }
    setWireDragPreview(preview);
  });

  const finish = (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const screen = screenFrom(event);
    const world = screenToWorld(screen.x, screen.y, projectState.camera);
    const target = hitPin(world.x, world.y);
    const from = drag;
    const pulled = drag.pulled;
    if (root.hasPointerCapture(event.pointerId)) {
      root.releasePointerCapture(event.pointerId);
    }
    endDrag();

    const canConnect =
      target &&
      target.dir === "in" &&
      IN_PINS.has(target.pin) &&
      target.nodeId !== from.fromNode;

    if (canConnect) {
      const existing = findWireAtInput(target.nodeId, target.pin);
      const displaced = existing ? wireSnapshot(existing.wire) : null;
      if (existing) delete projectState.wires[existing.id];

      const snap = {
        fromNode: from.fromNode,
        fromPin: from.fromPin,
        toNode: target.nodeId,
        toPin: target.pin,
      };
      applyWireSnap(snap);
      const prev = pulled?.snap ?? null;
      push({
        undo: () => {
          const cur = findWireAtInput(snap.toNode, snap.toPin);
          if (cur) delete projectState.wires[cur.id];
          if (displaced) applyWireSnap(displaced);
          if (prev) applyWireSnap(prev);
          syncWireInputs();
          notify();
        },
        redo: () => {
          if (prev) {
            const atPrev = findWireAtInput(prev.toNode, prev.toPin);
            if (atPrev) delete projectState.wires[atPrev.id];
          }
          if (displaced) {
            const atDisp = findWireAtInput(displaced.toNode, displaced.toPin);
            if (atDisp) delete projectState.wires[atDisp.id];
          }
          applyWireSnap(snap);
          notify();
        },
      });
      notify();
      return;
    }

    if (pulled) {
      push({
        undo: () => {
          applyWireSnap(pulled.snap);
          notify();
        },
        redo: () => {
          const hit = findWireAtInput(pulled.snap.toNode, pulled.snap.toPin);
          if (hit) delete projectState.wires[hit.id];
          syncWireInputs();
          notify();
        },
      });
      notify();
    }
  };

  root.addEventListener("pointerup", finish);
  root.addEventListener("pointercancel", finish);
}