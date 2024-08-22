import "./styles.css";
import { fillArray } from "../../../../utils/helpers";
import { Slide } from "..";

export default (slides = 1) =>
  /*html*/ `<div class="car"><div class="car-w">${fillArray(slides)
    .map(
      (i) => /*html*/ `<div id="${`s-${i}`}" class="car-s wh">${Slide(i)}</div>`
    )
    .join("")}</div></div>`;
