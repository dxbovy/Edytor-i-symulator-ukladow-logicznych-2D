import { attachPointerReadout } from "./coordinates.js";
import { setWorldReadout } from "../ui/canvasShell.js";

export function initCanvas() {
  attachPointerReadout(setWorldReadout);
}