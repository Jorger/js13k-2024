import "./styles.css";
import Button from "../../../button";
import Start from "../../../start";

export default () =>
  /*html*/ `<div class="game-t"><div class="t"><div class="s">${Start()}<span>Time</span></div><div class="c">00</div></div>${Button(
    "pause",
    "⏸",
    "bt"
  )}</div>`;
