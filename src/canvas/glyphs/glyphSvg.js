export const FILL = "#ffffff";
export const STROKE = "#000000";
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
  });
  svg.style.display = "block";
  svg.style.filter = "drop-shadow(1px 2px 2px rgb(0 0 0 / 12%))";
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

/** Port wejściowy „>” (Simulink / MATLAB, otwarty chevron). */
/** @param {SVGElement} root */
export function hookIn(root, x, y) {
  const h = 5;
  root.appendChild(
    el("path", {
      d: `M ${x} ${y - h} L ${x + HOOK} ${y} M ${x} ${y + h} L ${x + HOOK} ${y}`,
      fill: "none",
      stroke: STROKE,
      "stroke-width": String(SW),
      "stroke-linejoin": "round",
      "stroke-linecap": "round",
    })
  );
}

/** Port wyjściowy „>” na krawędzi symbolu. */
/** @param {SVGElement} root */
export function hookOut(root, x, y) {
  const h = 5;
  root.appendChild(
    el("path", {
      d: `M ${x - HOOK} ${y - h} L ${x} ${y} M ${x - HOOK} ${y + h} L ${x} ${y}`,
      fill: "none",
      stroke: STROKE,
      "stroke-width": String(SW),
      "stroke-linejoin": "round",
      "stroke-linecap": "round",
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