import { $, isMobile, debounce } from "./helpers";
import { WIDTH, HEIGHT } from "./constants";

const resizeScreen = debounce(() => {
  const bodyElement = $("#root") as HTMLBodyElement;
  let scale = Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT);

  const mobile = isMobile();

  if (scale >= 1 || mobile) {
    scale = !mobile ? scale : 1;
  }

  let applyZoom =
    window.innerWidth < WIDTH
      ? Math.round((window.innerWidth / WIDTH) * 100)
      : 100;

  bodyElement.setAttribute(
    "style",
    `zoom: ${applyZoom}%; transform: scale(${scale});`
  );
}, 100);

export default resizeScreen;
