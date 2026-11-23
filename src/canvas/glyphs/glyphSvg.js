export const SW = 2;
export const HOOK = 7;

/** @param {string} name @param {Record<string, string>} attrs */
export function el(name, attrs = {}) {
  const n = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
}

export function createSvgRoot() {
  const svg = el("svg", {
    width: "100%",
    height: "100%",
    overflow: "visible",
    "pointer-events": "none",
    class: "gate-glyph-svg",
  });
  svg.style.display = "block";
  svg.style.overflow = "visible";
  svg.style.filter = "drop-shadow(0 2px 6px rgb(0 0 0 / 18%))";
  return svg;
}

/** @param {SVGElement} root */
export function hookIn(root, bodyEdgeX, y) {
  const h = 5;
  const x = bodyEdgeX - HOOK;
  root.appendChild(
    el("path", {
      d: `M ${x} ${y - h} L ${bodyEdgeX} ${y} M ${x} ${y + h} L ${bodyEdgeX} ${y}`,
      fill: "none",
      stroke: "var(--node-stroke)",
      "stroke-width": String(SW),
      "stroke-linejoin": "miter",
      "stroke-linecap": "round",
    })
  );
}

/** @param {SVGElement} root */
export function hookOut(root, bodyEdgeX, y) {
  const h = 5;
  const x = bodyEdgeX;
  const wing = bodyEdgeX - HOOK;
  root.appendChild(
    el("path", {
      d: `M ${wing} ${y - h} L ${x} ${y} M ${wing} ${y + h} L ${x} ${y}`,
      fill: "none",
      stroke: "var(--node-stroke)",
      "stroke-width": String(SW),
      "stroke-linejoin": "miter",
      "stroke-linecap": "round",
    })
  );
}

/** @param {string} d */
export function filledPath(d) {
  return el("path", {
    d,
    fill: "var(--node-bg)",
    stroke: "var(--node-stroke)",
    "stroke-width": String(SW),
    "stroke-linejoin": "round",
    "stroke-linecap": "round",
  });
}
