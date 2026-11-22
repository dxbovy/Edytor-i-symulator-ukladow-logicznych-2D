import { initShortcuts } from "../interaction/shortcuts.js";

export {
  push,
  undo,
  redo,
  canUndo,
  canRedo,
  subscribeHistory,
} from "./history.js";

export function initHistory() {
  initShortcuts();
}