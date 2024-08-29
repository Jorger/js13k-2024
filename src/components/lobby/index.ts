import "./styles.css";
import { CONTAINER } from "../../utils/constants";
import {
  $,
  clickOutside,
  eventButton,
  setHtml,
  shareLink,
} from "../../utils/helpers";
import {
  closeTooltip,
  isOpen,
  setColor,
  toogleTooltip,
} from "../theme/helpers";
import Button from "../button";
import Logo from "../logo";
import Screen, { Params, Screens } from "../../Screen";
import Theme from "../theme";

// ["sounds", "♫"],
const Lobby = () => {
  const render = /*html*/ `<div class="lb wh jc">${Logo()}<div class="lb-b"><div class="lb-s jc">${[
    ["progress", "✩"],
    ["infinite", "∞"],
  ]
    .map((v) => Button(v[0], v[1], "lb-bu", v[0], 130))
    .join(
      ""
    )}</div><div class="lb-o jc"><a href="https://bio.link/jorgerub" target="_blank" class="btn bor jc">☻</a>${[
    ["th", "⚙"],
    ["sh", "⛓"],
  ]
    .map((v) => Button(v[0], v[1], "", v[0] === "th" ? Theme() : "", 60))
    .join(
      ""
    )}</div><a href="https://js13kgames.com/" target="_blank" class="lb-l jc">Js13k 2024</a></div></div>`;

  setHtml($(`#${CONTAINER}`), render);

  const cleanup = clickOutside($("#bt-th"), () => isOpen() && closeTooltip());

  eventButton((action) => {
    // console.log({ action });
    if (["infinite", "progress"].includes(action)) {
      let screen: Screens = "Progress";
      let data: Params = {};

      if (action === "infinite") {
        screen = "Game";
        data = { f: true };
      }

      cleanup();
      Screen(screen, data);
    }

    if (action === "sh") {
      shareLink({
        title: "🕗 13 Hours",
        text: "Play 13 Hours",
        url: window.location.href,
      });
    }

    if (action === "th") {
      toogleTooltip();
    }

    if (action.includes("col-")) {
      setColor(+action.split("-")[1]);
    }
  });
};

export default Lobby;
