export default (size = 23, label = "") =>
  /*html*/ `<div class="sta"><div style="font-size: ${size}px;">★</div>${
    label !== "" ? `<div>${label}</div>` : ""
  }</div>`;
