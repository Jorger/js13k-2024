import "./styles.css";

const Button = (
  id = "",
  icon = "",
  className = "",
  label = "",
  size = 45,
  disabled = false
) =>
  /*html*/ `<div id="bt-${id}" class="btn-w"><button id=${id} class="btn bor ${className}" style="width: ${size}px;height:${size}px;" ${
    disabled ? "disabled" : ""
  }>${icon}</button>${label !== "" ? `<span>${label}</span>` : ""}</div>`;

export default Button;
