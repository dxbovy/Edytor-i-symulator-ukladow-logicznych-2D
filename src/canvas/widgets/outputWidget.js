/** @param {HTMLElement} box @param {0 | 1 | null} signal */
function paintOutput(box, signal) {
  box.dataset.powered = signal === 1 ? "1" : "0";
}

/**
 * @param {HTMLElement} el
 * @param {import("../../state/projectState.js").projectState["nodes"][string]} node
 */
export function createOutputWidget(el, node) {
  let slot = el.querySelector("[data-output-widget]");
  if (!slot) {
    slot = document.createElement("div");
    slot.dataset.outputWidget = "1";
    slot.className = "flex h-full w-full items-center justify-center";
    slot.innerHTML = `
      <div class="input-switch-box output-switch-box" data-output-box>
      </div>`;
    el.replaceChildren(slot);
  }
  slot.dataset.nodeType = "OUTPUT";
  const v = node.inputStates.in;
  const signal = v === 0 || v === 1 ? v : null;
  const box = slot.querySelector("[data-output-box]");
  if (box) paintOutput(box, signal);
}