import "./styles.css";
import { fillArray } from "../../../../utils/helpers";
import { isLevelBlocked, startsRemain } from "../../../../levels";
import { Slide } from "..";

export default (slides = 1) =>
  /*html*/ `<div class="car"><div class="car-w">${fillArray(slides)
    .map((i) => {
      const isDisabled = isLevelBlocked(i);

      return /*html*/ `<div id="${`s-${i}`}" class="car-s wh">${
        isDisabled
          ? `<div class="car-m wh jc"><span>${
              startsRemain(i)[2]
            } More Starts to unlock</span></div>`
          : ""
      } ${Slide(i, isDisabled)}</div>`;
    })
    .join("")}</div></div>`;
