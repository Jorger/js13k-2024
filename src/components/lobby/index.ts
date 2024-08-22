import "./styles.css";
import { $, eventButton, setHtml } from "../../utils/helpers";
import { CONTAINER } from "../../utils/constants";
import Button from "../button";
import Screen from "../../Screen";

const Lobby = () => {
  const render = /*html*/ `<div class="lobby wh">
    <div class="lobby-b">
      ${[
        ["progress", "❯❯"],
        ["infinite", "∞"],
      ]
        .map((v) => Button(v[0], v[1], "lobby-bu", v[0], 100))
        .join("")} 
    </div>
  </div>`;

  setHtml($(`#${CONTAINER}`), render);

  eventButton((action) => {
    if (action === "infinite") {
      Screen("Game", { f: true });
    }

    if (action === "progress") {
      Screen("Progress");
    }
  });
};

export default Lobby;
