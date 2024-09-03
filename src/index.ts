import "./styles.css";
import { $, $on, setHtml } from "./utils/helpers";
import { ROOT } from "./utils/constants";
import Container from "./components/container";
import onWindowResize from "./utils/resize-screen";
import Screen from "./Screen";
import { PlaySound } from "./utils/sounds";

setHtml($(`#${ROOT}`), Container());

/**
 * Renderizar la pantalla, en este caso la de lobby...
 */
Screen();

$on(document as any, "contextmenu", (event) => event.preventDefault());

window.addEventListener("resize", onWindowResize);
onWindowResize();

const onClickEvent = (e: MouseEvent) => {
  const target = e.target as Element;
  if (target && ["a", "button"].includes(target.tagName.toLowerCase())) {
    PlaySound("click");
  }
};

$on(window as any, "click", onClickEvent);

// @ts-ignore
const compress = (levels) => {
  // @ts-ignore
  const positions = levels.map((v) => v[1]);
  console.log("positions: ", positions);
  const newPositions = [];
  // @ts-ignore
  const sizes = [];

  const getIndex = (x = 0, y = 0, size = 0) => {
    // @ts-ignore
    if (sizes.includes(x) || sizes.includes(y) || sizes.includes(size)) {
      getIndex;
    }
  };

  for (let i = 0; i < positions.length; i++) {
    const newValue = [];

    for (let c = 0; c < positions[i].length; c++) {
      const x = positions[i][c][0];
      const y = positions[i][c][1];
      const size = positions[i][c][2];

      // @ts-ignore
      if (!sizes.includes(x)) {
        sizes.push(x);
      }

      // @ts-ignore
      if (!sizes.includes(y)) {
        sizes.push(y);
      }

      // @ts-ignore
      if (!sizes.includes(size)) {
        sizes.push(size);
      }

      const newX = sizes.findIndex((v) => v === x);
      const newY = sizes.findIndex((v) => v === y);
      const newSize = sizes.findIndex((v) => v === size);

      newValue.push([newX, newY, newSize]);
    }
    newPositions.push(newValue);
  }

  console.log("newPositions: ", newPositions);

  console.log("levels: ", levels);

  const newLevels = [];

  for (let i = 0; i < levels.length; i++) {
    newLevels.push([levels[i][0], newPositions[i]]);
  }

  console.log("newLevels: ", newLevels);

  console.log("sizes: ", sizes);

  // console.log(newLevels.map(v => v).join(";"));

  // return newLevels.map(v => v).join(";");
};
