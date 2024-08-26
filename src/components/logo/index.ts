import "./styles.css";
import { Clock } from "../game/components";

export default () =>
  /*html*/ `<div class="logo"><span>13 H</span>${Clock([
    137, 10,
  ])}<span id="l2">urs</span></div>`;
