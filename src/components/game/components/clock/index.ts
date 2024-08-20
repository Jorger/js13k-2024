import "./styles.css";
import { randomNumber } from "../../../../utils/helpers";

const getProperties = () => {
  const direction = randomNumber(0, 1) === 0 ? "normal" : "reverse";
  const seconds = randomNumber(1, 2);
  const miliseconds = randomNumber(0, 9) / 10;
  const speed = `${seconds + miliseconds}s`;
  // TODO: Para test
  // const speed = "50s";

  return [direction, speed];
};

export default ([x, y, size, id, active]: (string | number | boolean)[]) => {
  const [direction, speed] = getProperties();
  const style = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;--s:${speed};--d:${direction};`;
  const className = `clock ${active ? "a" : ""}`;

  return /*html*/ `<div id="${id}" class="${className}" style="${style}"></div>`;
};
