import "./styles.css";
import { $, $on, setHtml } from "./utils/helpers";
import { ROOT } from "./utils/constants";
import Container from "./components/container";
import Game from "./components/game";
import onWindowResize from "./utils/resize-screen";
// import { PlaySound } from './utils/sounds';
// import Screen from './screens/index';

setHtml($(`#${ROOT}`), Container());

Game({ l: 0 });

$on(document as any, "contextmenu", (event) => event.preventDefault());

window.addEventListener("resize", onWindowResize);
onWindowResize();

// const onClickEvent = (e: MouseEvent) => {
//   const target = e.target as Element;
//   if (target && ['a', 'button'].includes(target.tagName.toLowerCase())) {
//     PlaySound('click');
//   }
// };

// $on(window as any, 'click', onClickEvent);
// Screen('Lobby');

// console.log(
//   '%cGame developed by Jorge Rubiano.',
//   'color:red; font-size:20px; font-weight: bold; -webkit-text-stroke: 1px black; border-radius:10px; padding: 20px; background-color: black;'
// );
