import "./styles.css";

const Button = (id = "", icon = "", className = "", label = "", size = 40) =>
  /*html*/ `<div id="bt-${id}" class="btn-w"><button id=${id} class="btn ${className}" style="width: ${size}px;height:${size}px;">${icon}</button>${
    label !== "" ? `<span>${label}</span>` : ""
  }</div>`;

export default Button;
