import { $, debounce } from "./helpers";
import { WIDTH, HEIGHT } from "./constants";

const resizeScreen = debounce(() => {
  const bodyElement = $("#root") as HTMLBodyElement;
  const scale = Math.min(
    window.innerWidth / WIDTH,
    window.innerHeight / HEIGHT
  );

  bodyElement.setAttribute("style", `transform: scale(${scale});`);
}, 100);

export default resizeScreen;
