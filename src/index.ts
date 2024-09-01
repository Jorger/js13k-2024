import "./styles.css";
import { $, $on, setHtml } from "./utils/helpers";
import { ROOT } from "./utils/constants";
import Container from "./components/container";
import onWindowResize from "./utils/resize-screen";
import Screen from "./Screen";

setHtml($(`#${ROOT}`), Container());

/**
 * Renderizar la pantalla, en este caso la de lobby...
 */
Screen();

$on(document as any, "contextmenu", (event) => event.preventDefault());

window.addEventListener("resize", onWindowResize);
onWindowResize();
