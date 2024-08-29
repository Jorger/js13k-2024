import "./styles.css";
import { fillArray } from "../../../../utils/helpers";
import { isLevelBlocked, isLevelPassed } from "../../../../levels";
import Button from "../../../button";
import Start from "../../../start";

export default (
  slide = 0,
  total = 20
) => /*html*/ `<div class="sli wh jc">${fillArray(total)
  .map((v) => {
    const level = v + total * slide;
    return /*html*/ `<div class="sli-w">${Button(
      `b-${level}`,
      `${level + 1}`,
      "",
      "",
      60,
      isLevelBlocked(slide)
    )}${isLevelPassed(level) ? Start() : ""}</div>`;
  })
  .join("")}
</div>`;
