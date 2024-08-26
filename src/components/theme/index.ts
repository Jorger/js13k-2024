import "./styles.css";
import { COLORS } from "../../utils/constants";

export default () => /*html*/ `<div class="th jc">
  ${COLORS.map(
    (color, index) =>
      /*html*/ `<button class="bor" id="col-${index}" style="background:${color}"></button>`
  ).join("")}
</div>`;
