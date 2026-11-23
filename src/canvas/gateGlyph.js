import { createSvgRoot } from "./glyphs/glyphSvg.js";
import { drawAnd } from "./glyphs/andGlyph.js";
import { drawOr } from "./glyphs/orGlyph.js";
import { drawNot } from "./glyphs/notGlyph.js";
import { drawXor } from "./glyphs/xorGlyph.js";
import { drawDff } from "./glyphs/dffGlyph.js";
import { drawLed } from "./glyphs/ledGlyph.js";
import { drawUnknown } from "./glyphs/unknownGlyph.js";

const DRAW = {
  AND: drawAnd,
  OR: drawOr,
  NOT: drawNot,
  XOR: drawXor,
  DFF: drawDff,
  LED: drawLed,
};

/** @param {string} type */
export function createGateGlyph(type) {
  const svg = createSvgRoot();
  const draw = DRAW[type];
  if (draw) draw(svg);
  else drawUnknown(svg, type);
  return svg;
}