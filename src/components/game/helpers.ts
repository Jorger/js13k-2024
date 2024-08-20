import { $, $on, generateUUID, setHtml } from "../../utils/helpers";
import { Bullet, Clock } from "./components";
import { getLevel } from "../../levels";

const BASE_RENDER = ".game-c";
let CLOCK_ACTIVE = -1;
let MAX_TIME = 0;
let CLOCKS: (string | number | boolean)[][];

const normalizeAngle = (angle = 0) => ((angle % 360) + 360) % 360;

const getBulletData = () => {
  const [x, y, size] = CLOCKS[CLOCK_ACTIVE];
  const bulletSize = (size as number) * 0.22;
  const basePosition = (size as number) * 0.391;
  const bulletX = (x as number) + basePosition;
  const bulletY = (y as number) + basePosition;

  return [bulletX, bulletY, bulletSize];
};

const getClockAngle = (element: HTMLDivElement) => {
  // const rect = element.getBoundingClientRect();

  // Pausar la animación del pseudo-elemento
  // clock.style.setProperty('animation-play-state', 'paused');
  // clock.classList.add("stop");

  // Obtener el ángulo actual del pseudo-elemento
  const style = window.getComputedStyle(element, "::before");
  const transform = style.transform;

  let angle = 0;

  if (transform !== "none") {
    const values = transform.split("(")[1].split(")")[0].split(",");
    const a = +values[0];
    const b = +values[1];
    angle = normalizeAngle(Math.round(Math.atan2(b, a) * (180 / Math.PI)));
  }

  const radians = (angle - 90) * (Math.PI / 180);

  const [startX, startY] = getBulletData();

  const directionX = Math.cos(radians);
  const directionY = Math.sin(radians);

  const obstacles = CLOCKS.filter((v) => !v[4]);

  console.log({
    angle,
    directionX,
    directionY,
    startX,
    startY,
    obstacles: obstacles.length,
  });

  // let currentX = startX;
  // let currentY = startY;
  // const collisionPoint = { collided: false, x: 0, y: 0 };

  // console.log(obstacles);

  //   while (currentX >= 0 && currentX <= WIDTH && currentY >= 0 && currentY <= HEIGHT) {
  //     // Moverse en la dirección de la manecilla
  //     currentX += directionX;
  //     currentY += directionY;

  //     // Verificar colisiones con obstáculos
  //     const obstacles = document.querySelectorAll('.obstacle');
  //     obstacles.forEach(obstacle => {
  //         const obsRect = obstacle.getBoundingClientRect();
  //         const centerX = obsRect.left + obsRect.width / 2;
  //         const centerY = obsRect.top + obsRect.height / 2;
  //         const radius = obsRect.width / 2;

  //         // Verificar colisión con el círculo (obstáculo)
  //         const distance = Math.sqrt((currentX - centerX) ** 2 + (currentY - centerY) ** 2);
  //         if (distance <= radius) {
  //             collided = true;
  //             collisionPoint = { x: currentX, y: currentY };
  //         }
  //     });

  //     if (collided) break;
  // }

  // collided = true;
  // collisionPoint = { x: currentX, y: currentY };
};

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
    `c-${generateUUID()}`,
    i === CLOCK_ACTIVE,
  ]);

  /**
   * Se renderizan los relojes y la bala...
   */
  setHtml(
    $(BASE_RENDER),
    [CLOCKS.map((v) => Clock(v)), Bullet(getBulletData())].flat().join("")
  );
};

export const initComponent = (level = 0) => {
  loadLevel(level);

  // setHtml($(BASE_RENDER), Bullet([40, 40, 20, 1]));

  $on($(BASE_RENDER) as HTMLElement, "click", () => {
    if (CLOCK_ACTIVE >= 0) {
      getClockAngle($(`#${CLOCKS[CLOCK_ACTIVE][3]}`) as HTMLDivElement);

      // La informción de la posición de la bala...
      // console.log(getBulletData());
    }
  });

  // setInterval(() => {
  //   if (CLOCK_ACTIVE >= 0) {
  //     getClockAngle($(`#${CLOCKS[CLOCK_ACTIVE][3]}`) as HTMLDivElement);
  //   }
  // }, 100);

  // Se debe agregar el evento click al escenario y a los botones que se requieran
};
