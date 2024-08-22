import "./styles.css";
import { $, $$, eventButton, setHtml } from "../../utils/helpers";
import { Carousel } from "./components";
import { CONTAINER } from "../../utils/constants";
import Button from "../button";
import Screen from "../../Screen";

const Progress = () => {
  // TODO, determinar el número de slides, dependiendo de la cantidad de niveles...
  const totalSlides = 3;
  let currentIndex = 0;

  const goToSlide = (index = 0) => {
    const carousel = $(".car-w");
    const slides = $$(".car-s");
    const slideWidth = (slides[0] as HTMLElement).offsetWidth;

    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;
    carousel!.scrollTo({ left: slideWidth * index, behavior: "smooth" });
    currentIndex = index;
  };

  const render = /*html*/ `<div class="progress wh jc"><h2>Select Level</h2>${Carousel(
    totalSlides
  )}${Button("prev", "❮", "bta", "", 40)}${Button(
    "next",
    "❯",
    "bta",
    "",
    40
  )}${Button("main", "✕", "btm", "Main Menu", 45)}</div>`;

  setHtml($(`#${CONTAINER}`), render);

  eventButton((action) => {
    if (["prev", "next"].includes(action)) {
      return goToSlide(currentIndex + (action === "prev" ? -1 : 1));
    }

    if (action === "main") {
      return Screen();
    }

    const splitAction = action.split("-");

    if (splitAction[1]) {
      Screen("Game", { l: +splitAction[1] });
    }
  });
};

export default Progress;
