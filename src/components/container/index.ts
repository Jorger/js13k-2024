import "./styles.css";
import { CONTAINER, HEIGHT, WIDTH } from "../../utils/constants";
import { getCurrentColor, setColor } from "../theme/helpers";

const Container = () => {
  setColor(getCurrentColor());
  return /*html*/ `<div id="${CONTAINER}" style="overflow: hidden;width:${WIDTH}px;height:${HEIGHT}px"></div>`;
};

export default Container;
