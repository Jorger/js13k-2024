import "./styles.css";
import { $, setHtml } from "../../utils/helpers";
import { CONTAINER } from "../../utils/constants";
import { initComponent } from "./helpers";
import { Options, Toolbar } from "./components";

interface GameProps {
  l: number;
  f?: boolean;
}

const Game = ({ l = 0, f = false }: GameProps) => {
  const render = /*html*/ `<div class="game wh ${f ? "in" : ""}">${Options()}${Toolbar()}<div class="game-c wh"></div></div>`;

  setHtml($(`#${CONTAINER}`), render);

  initComponent(l, f);
};

export default Game;
