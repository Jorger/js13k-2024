import Game from "./components/game";
import Lobby from "./components/lobby";
import Progress from "./components/progress";

export type Params = Record<string, any>;
export type Screens = "Lobby" | "Game" | "Progress";

type HandlerType = {
  [key: string]: (params: Params) => void;
};

const Handler: HandlerType | any = { Game, Lobby, Progress };

export default (screen: Screens = "Lobby", params = {}) =>
  Handler[screen](params);
