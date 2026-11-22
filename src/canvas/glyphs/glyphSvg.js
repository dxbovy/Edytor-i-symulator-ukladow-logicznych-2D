export const FILL = "#88BC93";
export const STROKE = "#1a4f86";
export const SW = 2;

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
  });
  svg.style.display = "block";
  return svg;
}

/** @param {SVGElement} root */
export function symbolLabel(root, text, cx, y, size = 11) {
  const t = el("text", {
    x: String(cx),
    y: String(y),
    fill: STROKE,
    "font-weight": "600",
    "font-family": "system-ui, sans-serif",
    "font-size": String(size),
    "text-anchor": "middle",
    "dominant-baseline": "hanging",
    "pointer-events": "none",
    style: "user-select: none",
  });
  t.textContent = text;
  root.appendChild(t);
}

/** @param {SVGElement} root */
export function wire(root, x1, y1, x2, y2) {
  root.appendChild(
    el("line", {
      x1: String(x1),
      y1: String(y1),
      x2: String(x2),
      y2: String(y2),
      stroke: STROKE,
      "stroke-width": String(SW),
      "stroke-linecap": "round",
      fill: "none",
    })
  );
}

/** @param {string} d */
export function filledPath(d) {
  return el("path", {
    d,
    fill: FILL,
    stroke: STROKE,
    "stroke-width": String(SW),
    "stroke-linejoin": "round",
    "stroke-linecap": "round",
  });
}