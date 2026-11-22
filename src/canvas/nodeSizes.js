/** @type {Record<string, { w: number, h: number }>} */
export const NODE_SIZES = {
  AND: { w: 88, h: 64 },
  OR: { w: 88, h: 64 },
  XOR: { w: 92, h: 64 },
  NOT: { w: 72, h: 58 },
  DFF: { w: 96, h: 68 },
  INPUT: { w: 80, h: 58 },
  LED: { w: 92, h: 58 },
};

export const DEFAULT_NODE_SIZE = { w: 72, h: 48 };

/** @param {string} type */
export function nodeSizeFor(type) {
  return NODE_SIZES[type] ?? DEFAULT_NODE_SIZE;
}