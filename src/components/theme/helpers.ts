import { $, addClass, removeClass } from "../../utils/helpers";
import { COLORS } from "../../utils/constants";
import { getValueFromCache, savePropierties } from "../../utils/storage";

const TOOLTIP_SHOW_CLASS = "show";
const NAME_PROPERTY = "color";
const SELECT_COLOR_CLASS = "sel";
const DEFAULT_INDEX_COLOR = 6;

export const tooltipElement = () => $("#bt-theme span") as HTMLElement;

export const isOpen = () =>
  tooltipElement()?.classList?.contains(TOOLTIP_SHOW_CLASS);

export const closeTooltip = () =>
  removeClass(tooltipElement(), TOOLTIP_SHOW_CLASS);

export const toogleTooltip = () => {
  const tooltip = tooltipElement();
  const toogle = { a: addClass, r: removeClass };
  const open = isOpen();
  toogle[open ? "r" : "a"](tooltip, TOOLTIP_SHOW_CLASS);

  if (!open) {
    addClass($(`#col-${getCurrentColor()}`) as HTMLElement, SELECT_COLOR_CLASS);
  }
};

export const isValidIndexColor = (index = 0) =>
  index >= 0 && index < COLORS.length;

export const setColor = (index = 0) => {
  if (isValidIndexColor(index)) {
    removeClass(
      $(`#col-${getCurrentColor()}`) as HTMLElement,
      SELECT_COLOR_CLASS
    );
    addClass($(`#col-${index}`) as HTMLElement, SELECT_COLOR_CLASS);
    savePropierties(NAME_PROPERTY, index);
    const color = COLORS[index];
    const root = document.documentElement;
    root.style.setProperty("--bs", color);

    const metaThemeColor = $("meta[name=theme-color]");

    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", color);
    }
  }
};

export const getCurrentColor = () => {
  const index = getValueFromCache<number>(NAME_PROPERTY, DEFAULT_INDEX_COLOR);
  return isValidIndexColor(index) ? index : DEFAULT_INDEX_COLOR;
};
