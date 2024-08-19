import { $, $on, setHtml } from "../../utils/helpers";
import { Clock } from "./components";
import { getLevel } from "../../levels";

let CLOCK_ACTIVE = 0;
let MAX_TIME = 0;
let CLOCKS: (number | boolean)[][];

/**
 * Función que carga el nivel seleccionado...
 * @param level
 */
const loadLevel = (level = 0) => {
  /**
   * Obtiene la data del nivel...
   */
  const data = getLevel(level);

  /**
   * Guadar el reloj seleccionado y el tiempo máximo para
   * resolver el nivel y obtener una estrella..
   */
  CLOCK_ACTIVE = data[0] as number;
  MAX_TIME = data[1] as number;

  console.log({ CLOCK_ACTIVE, MAX_TIME });

  /**
   * Se establece la data para los relojes...
   */
  CLOCKS = (data[2] as number[][]).map(([x, y, size], i) => [
    x,
    y,
    size,
    Math.random(),
    i === CLOCK_ACTIVE,
  ]);

  /**
   * Se renderizan los relojes...
   */
  setHtml($(".game-c"), CLOCKS.map((v) => Clock(v)).join(""));
};

export const initComponent = (level = 0) => {
  loadLevel(level);

  $on($(".game-c") as HTMLElement, "click", () => {
    console.log("CLICK EN EL CAVAS", { CLOCK_ACTIVE });
  });

  // Se debe agregar el evento click al escenario y a los botones que se requieran
};
