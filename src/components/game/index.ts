import "./styles.css";
import { $, setHtml } from "../../utils/helpers";
import { CONTAINER } from "../../utils/constants";
import { initComponent } from "./helpers";
import { Toolbar } from "./components";

const Game = ({ level = 0 }: { level: number }) => {
  const render = /*html*/ `<div class="game wh">${Toolbar()}<div class="game-c wh"></div></div>`;

  setHtml($(`#${CONTAINER}`), render);

  initComponent(level);
};

export default Game;
