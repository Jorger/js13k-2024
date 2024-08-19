import { randomNumber } from "../../../../utils/helpers";
import "./styles.css";

export default ([x, y, size, id, active]: (number | boolean)[]) => {
  const direction = randomNumber(0, 1) === 0 ? "normal" : "reverse";
  const seconds = randomNumber(1, 2);
  const miliseconds = randomNumber(0, 9) / 10;
  const speed = `${seconds + miliseconds}s`;

  const style = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;--s:${speed};--d:${direction};`;
  const className = `clock ${active ? "active" : ""}`;
  const idValue = `cl-${id}`;

  return /*html*/ `<div id="${idValue}" class="${className}" style="${style}"></div>`;
};
