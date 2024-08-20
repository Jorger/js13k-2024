import "./styles.css";

export default ([x, y, size, active = 0]: number[]) => {
  const style = `width:${size}px;height:${size}px;transform:translate(${x}px, ${y}px);`;
  const className = `bullet ${active ? "a" : ""}`;

  return /*html*/ `<div class="${className}" style="${style}"></div>`;
};
