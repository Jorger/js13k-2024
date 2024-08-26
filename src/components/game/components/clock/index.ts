import "./styles.css";

// TODO: remover el indice..
export default ([
  x = 0,
  y = 0,
  size = 50,
  id = "clo",
  direction = "normal",
  speed = "5",
  active = true,
]: (string | number | boolean)[]) => {
  const style = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;--s:${speed}s;--d:${direction};`;
  const className = `clock bor ${active ? "a" : ""}`;

  return /*html*/ `<div id="${id}" class="${className}" style="${style}"></div>`;
};
