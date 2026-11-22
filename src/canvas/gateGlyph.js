const FILL = "#88BC93";
const STROKE = "#1a4f86";
const SW = 2;

const TEXT = {
  fill: STROKE,
  "font-weight": "bold",
  "font-family": "system-ui, sans-serif",
  "pointer-events": "none",
};

/** @param {string} name @param {Record<string, string>} attrs */
function el(name, attrs = {}) {
  const n = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
}

/** @param {SVGElement} root @param {string} label @param {number} x @param {number} y @param {number} size */
function label(root, label, x, y, size = 11) {
  const t = el("text", {
    ...TEXT,
    x: String(x),
    y: String(y),
    "text-anchor": "middle",
    "dominant-baseline": "middle",
    "font-size": String(size),
  });
  t.textContent = label;
  root.appendChild(t);
}

/** @param {string} d */
function bodyPath(d) {
  return el("path", {
    d,
    fill: FILL,
    stroke: STROKE,
    "stroke-width": String(SW),
    "stroke-linejoin": "round",
    "stroke-linecap": "round",
  });
}

function andGate(svg) {
  svg.setAttribute("viewBox", "0 0 80 50");
  svg.appendChild(
    bodyPath("M 6 6 L 6 44 L 32 44 C 58 44 58 6 32 6 Z")
  );
  label(svg, "AND", 22, 25, 12);
}

function orGate(svg) {
  svg.setAttribute("viewBox", "0 0 80 50");
  svg.appendChild(
    bodyPath("M 12 5 Q 30 25 12 45 Q 44 45 74 25 Q 44 5 12 5 Z")
  );
  label(svg, "OR", 40, 25, 12);
}

function notGate(svg) {
  svg.setAttribute("viewBox", "0 0 60 40");
  svg.appendChild(
    bodyPath("M 5 5 L 5 35 L 38 20 Z")
  );
  svg.appendChild(
    el("circle", {
      cx: "48",
      cy: "20",
      r: "5",
      fill: FILL,
      stroke: STROKE,
      "stroke-width": String(SW),
    })
  );
  label(svg, "NOT", 20, 20, 10);
}

function inputGate(svg) {
  svg.setAttribute("viewBox", "0 0 48 32");
  svg.appendChild(
    el("circle", {
      cx: "14",
      cy: "14",
      r: "11",
      fill: FILL,
      stroke: STROKE,
      "stroke-width": String(SW),
    })
  );
  svg.appendChild(
    el("line", {
      x1: "25",
      y1: "14",
      x2: "46",
      y2: "14",
      stroke: STROKE,
      "stroke-width": String(SW),
      "stroke-linecap": "round",
    })
  );
  label(svg, "INPUT", 14, 27, 5);
}

/** @param {string} type */
function unknownGate(svg, type) {
  const { w, h } = { w: 60, h: 40 };
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.appendChild(
    el("rect", {
      x: "3",
      y: "3",
      width: String(w - 6),
      height: String(h - 6),
      rx: "6",
      ry: "6",
      fill: FILL,
      stroke: STROKE,
      "stroke-width": String(SW),
    })
  );
  const fs = type.length > 6 ? 8 : 10;
  label(svg, type, w / 2, h / 2, fs);
}

/** @param {string} type */
export function createGateGlyph(type) {
  const svg = el("svg", {
    width: "100%",
    height: "100%",
    overflow: "visible",
    "pointer-events": "none",
  });
  svg.style.display = "block";

  switch (type) {
    case "AND":
      andGate(svg);
      break;
    case "OR":
      orGate(svg);
      break;
    case "NOT":
      notGate(svg);
      break;
    case "INPUT":
      inputGate(svg);
      break;
    default:
      unknownGate(svg, type);
      break;
  }
  return svg;
}