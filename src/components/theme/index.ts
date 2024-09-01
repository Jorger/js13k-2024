import "./styles.css";
import { COLORS } from "../../utils/constants";

export default () =>
  /*html*/ `<div class="th jc"><h4>Select Color</h4><div class="tb-bu jc">${COLORS.map(
    (color, index) =>
      /*html*/ `<button class="bor" id="col-${index}" style="background:${color}"></button>`
  ).join("")}</div></div>`;
