/** @type {Record<string, { w: number, h: number }>} */
export const NODE_SIZES = {
  AND: { w: 80, h: 50 },
  NOT: { w: 60, h: 40 },
  INPUT: { w: 48, h: 32 },
};

export const DEFAULT_NODE_SIZE = { w: 60, h: 40 };

/** @param {string} type */
export function nodeSizeFor(type) {
  return NODE_SIZES[type] ?? DEFAULT_NODE_SIZE;
}