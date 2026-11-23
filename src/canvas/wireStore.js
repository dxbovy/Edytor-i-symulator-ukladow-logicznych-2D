import { projectState } from "../state/projectState.js";

/** @param {string} nodeId @param {string} pin */
export function wireOutputState(nodeId, pin) {
  const node = projectState.nodes[nodeId];
  if (!node) return null;
  const v = node.outputStates[pin];
  return v === 0 || v === 1 ? v : null;
}

/** @param {Record<string, object>} wire */
export function refreshWireState(wire) {
  wire.state = wireOutputState(wire.fromNode, wire.fromPin);
}

/** @param {string[]} nodeIds */
export function removeWiresForNodes(nodeIds) {
  const drop = new Set(nodeIds);
  for (const [id, w] of Object.entries(projectState.wires)) {
    if (drop.has(w.fromNode) || drop.has(w.toNode)) delete projectState.wires[id];
  }
}

/** @param {string} nodeId */
export function syncWiresFromNode(nodeId) {
  const node = projectState.nodes[nodeId];
  if (!node) return;
  for (const wire of Object.values(projectState.wires)) {
    if (wire.fromNode !== nodeId) continue;
    const v = node.outputStates[wire.fromPin];
    wire.state = v === 0 || v === 1 ? v : null;
  }
}