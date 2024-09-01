import "./styles.css";
import Button from "../../../button";
import Start from "../../../start";

export default () =>
  /*html*/ `<div class="g-o wh jc"><div class="ti jc"><h1>Game Paused</h1><h3></h3></div>${Button(
    "play",
    "➜",
    "",
    "Tap to Resume",
    140
  )}${Start(
    90,
    "With Start"
  )}<div class="me jc"><h1></h1><h3></h3></div><div class="t jc">${Button(
    "main",
    "✕",
    "",
    "Main Menu",
    80
  )}${Button("run", "↺", "", "Run Again", 80)}${Button(
    "next",
    "❯",
    "",
    "Next Level",
    80
  )}</div></div>`;
