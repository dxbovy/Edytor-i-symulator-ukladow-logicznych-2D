/** Logika trójwartościowa: np. AND(0, null) = 0, ale AND(1, null) = null. */
/** @typedef {0 | 1 | null} Bit */

/** @param {Bit[]} v @returns {Bit} */
function and(v) {
	if (v.includes(0)) return 0;
	if (v.includes(null)) return null;
	return 1;
}

/** @param {Bit[]} v @returns {Bit} */
function or(v) {
	if (v.includes(1)) return 1;
	if (v.includes(null)) return null;
	return 0;
}

/** @param {Bit[]} v @returns {Bit} */
function xor(v) {
	if (v.includes(null)) return null;
	return v.reduce((a, b) => a ^ b, 0);
}

/** @param {Bit} v @returns {Bit} */
function not(v) {
	return v === null ? null : v === 1 ? 0 : 1;
}

export const GATE_EVAL = {
	AND: (i) => ({ out_Q: and([i.in_A, i.in_B]) }),
	OR: (i) => ({ out_Q: or([i.in_A, i.in_B]) }),
	XOR: (i) => ({ out_Q: xor([i.in_A, i.in_B]) }),
	NOT: (i) => ({ out_Q: not(i.in_A) }),
};
