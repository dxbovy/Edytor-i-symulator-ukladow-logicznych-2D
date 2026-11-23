export const projectState = {
  meta: {
    name: "Projekt_1",
  },
  camera: {
    x: 0,
    y: 0,
    zoom: 1.0,
  },
  nodes: {
    node_and_1: {
      type: "AND",
      x: 200,
      y: 150,
      rotation: 0,
      scale: 1,
      inputStates: { in_A: null, in_B: null },
      outputStates: { out_Q: null },
    },
    node_not_1: {
      type: "NOT",
      x: 400,
      y: 280,
      rotation: 0,
      scale: 1,
      inputStates: { in_A: null },
      outputStates: { out_Q: null },
    },
    node_input_1: {
      type: "INPUT",
      x: 80,
      y: 100,
      rotation: 0,
      scale: 1,
      inputStates: {},
      outputStates: { out: 0 },
    },
  },
  wires: {},
};

const listeners = new Set();

/** @param {() => void} fn */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** @type {(() => void) | null} */
let preNotifyHook = null;

/**
 * Funkcja uruchamiana przed każdym powiadomieniem subskrybentów
 * (żeby renderować po symulacji).
 * @param {(() => void) | null} fn
 */
export function setPreNotifyHook(fn) {
	preNotifyHook = fn;
}

export function notify() {
  preNotifyHook();
  for (const fn of listeners) fn();
}