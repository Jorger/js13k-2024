import "./styles.css";

// TODO: remover el indice..
export default ([x, y, size, id, direction, speed, active]: (
  | string
  | number
  | boolean
)[]) => {
  const style = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;--s:${speed}s;--d:${direction};`;
  const className = `clock ${active ? "a" : ""}`;

  return /*html*/ `<div id="${id}" class="${className}" style="${style}"></div>`;
};
