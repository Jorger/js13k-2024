import "./styles.css";
import { fillArray, randomNumber } from "../../../../utils/helpers";
import Button from "../../../button";
import Start from "../../../start";

// TODO: validar si el botón estará habilitado...
export default (
  slide = 0,
  isDisabled = false,
  total = 20
) => /*html*/ `<div class="sli wh jc">${fillArray(total)
  .map((v) => {
    const level = v + total * slide;
    // TODO: Leer data de localstorage para saber si tiene estrella...
    const showStart = randomNumber(0, 1);
    return /*html*/ `<div class="sli-w">${Button(
      `b-${level}`,
      `${level + 1}`,
      "",
      "",
      60,
      isDisabled
    )}${showStart ? Start() : ""}</div>`;
  })
  .join("")}
</div>`;
