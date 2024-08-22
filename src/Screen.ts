import Game from "./components/game";
import Lobby from "./components/lobby";
import Progress from "./components/progress";

type Params = Record<string, any>;
type Screens = "Lobby" | "Game" | "Progress";

type HandlerType = {
  [key: string]: (params: Params) => void;
};

const Handler: HandlerType | any = { Game, Lobby, Progress };

export default (screen: Screens = "Lobby", params = {}) =>
  Handler[screen](params);
