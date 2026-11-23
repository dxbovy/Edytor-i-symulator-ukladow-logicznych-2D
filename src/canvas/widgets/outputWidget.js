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
      <div class="input-switch-box output-switch-box">
        <span class="output-switch-pin" data-pin-in aria-hidden="true"></span>
        <span class="output-switch-label">OUTPUT</span>
      </div>`;
    el.replaceChildren(slot);
  }
  slot.dataset.nodeType = "OUTPUT";
  void node;
}