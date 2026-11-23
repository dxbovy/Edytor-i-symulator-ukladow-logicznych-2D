import { projectState } from '../state/projectState.js';
import { GATE_EVAL } from './gateDefs.js';

/** @typedef {import("./gateDefs.js").Bit} Bit */

/**
 * Poprzedni stan wejścia CLK każdego przerzutnika (do wykrywania zbocza)
 * Trzymany poza projectState zeby nie byl w historii undo
 * @type {Map<string, Bit>}
 */
const prevClock = new Map();

/** Limit rund "zbocze zegara -> przeliczenie" (zabezpieczenie przed zegarem sterowanym z własnego wyjścia) */
const MAX_EDGE_ROUNDS = 64;

let warnedUnstable = false;

/** @param {unknown} v @returns {Bit} */
function bit(v) {
	return v === 0 || v === 1 ? v : null;
}

const key = (nodeId, pin) => `${nodeId}\u0000${pin}`;

/** Mapuje wejście z kablem który je zasila */
function buildDrivers() {
	const nodes = projectState.nodes;
	/** @type {Map<string, object>} */
	const drivers = new Map();
	for (const wire of Object.values(projectState.wires)) {
		if (!nodes[wire.fromNode] || !nodes[wire.toNode]) continue;
		drivers.set(key(wire.toNode, wire.toPin), wire);
	}
	return drivers;
}

/** @returns {Bit} */
function readInput(drivers, nodeId, pin) {
	const wire = drivers.get(key(nodeId, pin));
	if (!wire) return null;
	return bit(projectState.nodes[wire.fromNode]?.outputStates[wire.fromPin]);
}

/**
 * Przelicza bramki aż sygnały się ustabilizują.
 * @returns {boolean} true, jeśli układ się ustabilizował
 */
function settle(drivers) {
	const entries = Object.entries(projectState.nodes);
	const limit = entries.length * 2 + 10;
	for (let iter = 0; iter < limit; iter += 1) {
		let changed = false;
		for (const [id, node] of entries) {
			const evaluate = GATE_EVAL[node.type];
			if (!evaluate) continue; // INPUT, LED, OUTPUT, DFF i nieznane typy
			const inputs = {};
			for (const pin of Object.keys(node.inputStates)) {
				inputs[pin] = readInput(drivers, id, pin);
			}
			const out = evaluate(inputs);
			for (const [pin, value] of Object.entries(out)) {
				if (node.outputStates[pin] !== value) {
					node.outputStates[pin] = value;
					changed = true;
				}
			}
		}
		if (!changed) return true;
	}
	return false;
}

/** Bramki + przerzutniki D (reagują na zbocze narastające CLK). */
function evaluateCircuit(drivers) {
	const nodes = projectState.nodes;

	for (const id of prevClock.keys()) {
		if (!nodes[id]) prevClock.delete(id);
	}

	const dffIds = Object.keys(nodes).filter((id) => nodes[id].type === 'DFF');

	// Nowy przerzutnik startuje z Q = 0 (zamiast null)
	for (const id of dffIds) {
		if (!prevClock.has(id) && bit(nodes[id].outputStates.out_Q) === null) {
			nodes[id].outputStates.out_Q = 0;
		}
	}

	let stable = true;
	for (let round = 0; round < MAX_EDGE_ROUNDS; round += 1) {
		stable = settle(drivers) && stable;

		/** @type {[string, Bit][]} */
		const captures = [];
		for (const id of dffIds) {
			const clk = readInput(drivers, id, 'in_CLK');
			const prev = prevClock.get(id);
			prevClock.set(id, clk);
			if (prev === 0 && clk === 1) {
				captures.push([id, readInput(drivers, id, 'in_D')]);
			}
		}
		if (captures.length === 0) break;
		// Wszystkie D są próbkowane przed zmianą jakiegokolwiek Q
		for (const [id, d] of captures) nodes[id].outputStates.out_Q = d;
	}

	if (!stable && !warnedUnstable) {
		warnedUnstable = true;
		console.warn(
			'[simulation] Układ nie ustabilizował się (pętla sprzężenia zwrotnego?).',
		);
	}
	if (stable) warnedUnstable = false;
}

/** Zapisuje wynik do kabli i wejść węzłów (z tego korzystają renderery i widgety). */
function writeBack(drivers) {
	const nodes = projectState.nodes;
	for (const wire of Object.values(projectState.wires)) {
		wire.state = bit(nodes[wire.fromNode]?.outputStates[wire.fromPin]);
	}
	for (const [id, node] of Object.entries(nodes)) {
		for (const pin of Object.keys(node.inputStates)) {
			node.inputStates[pin] = readInput(drivers, id, pin);
		}
	}
}

/** Przelicza cały układ na podstawie aktualnego projectState */
export function runSimulation() {
	const drivers = buildDrivers();
	evaluateCircuit(drivers);
	writeBack(drivers);
}
