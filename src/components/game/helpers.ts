import { Bullet, Clock } from "./components";
import { getLevel, getTotalLevels } from "../../levels";
import { HEIGHT, WIDTH } from "../../utils/constants";
import {
  $,
  $on,
  addClass,
  addStyle,
  delay,
  eventButton,
  generateUUID,
  randomNumber,
  removeClass,
  setHtml,
} from "../../utils/helpers";
import Screen from "../../Screen";

const TOTAL_LEVELS = getTotalLevels();
const BASE_RENDER = ".game-c";
const BULLET_SIZE = 10;
let CLOCK_ACTIVE = -1;
let MAX_TIME = 0;
let CLOCKS: (string | number | boolean)[][];
let START_TIME: number = 0;
let INTERVAL_CHRONOMETER: NodeJS.Timeout | null;
let chronometerElement: HTMLElement | null;
let LEVEL_STATUS: "default" | "passed" | "lost" | "finalized" = "default";
let currentLevel = 0;
// let gameOver = false;

// const normalizeAngle = (angle = 0) => ((angle % 360) + 360) % 360;

/**
 * Generar información aleatoria para los relojes...
 * @returns
 */
const getClockProperties = () => {
  const direction = randomNumber(0, 1) === 0 ? "normal" : "reverse";
  const seconds = randomNumber(1, 3);
  const miliseconds = randomNumber(0, 9) / 10;
  const speed = seconds + miliseconds;
  // TODO: Para test
  // const speed = 50;

  return [direction, speed];
};

/**
 * Obtiene el ángulo dependiendo del tiempo transcurrido
 * @param animationDuration
 * @param direction
 * @returns
 */
const getCurrentRotationAngle = (
  animationDuration = 0,
  direction = "normal"
) => {
  const now = new Date().getTime();
  const elapsed = (now - START_TIME) / 1000;
  const rotationPerSecond = 360 / animationDuration;
  let angle = (elapsed * rotationPerSecond) % 360;

  if (direction === "reverse") {
    if (360 - angle >= 0) {
      angle = 360 - angle;
    }
  }

  return Math.round(angle);
};

/**
 * Generar información para el elemento que se mueve...
 * @returns
 */
const getBulletPosition = () => {
  const [x, y, size] = CLOCKS[CLOCK_ACTIVE];
  const basePosition = (size as number) * 0.5 - BULLET_SIZE / 2;
  const bulletX = (x as number) + basePosition;
  const bulletY = (y as number) + basePosition;

  return [bulletX, bulletY];
};

/**
 * Devuelve el ángulo del reloj que está activado...
 * @returns
 */
// TODO: revusar si se puede dejar sólo una lógica y potencialmente,
// se podría eliminar esta función o simplificarla...
// const getClockAngle = () => {
//   const [, , , id, direction, speed] = CLOCKS[CLOCK_ACTIVE];
//   const element = $(`#${id}`) as HTMLDivElement;

//   // Obtener el ángulo actual del pseudo-elemento
//   const style = window.getComputedStyle(element, "::before");
//   const transform = style.transform;

//   let angle = 0;

//   /**
//    * Se busca el transform en el before, en caso que no exista,
//    * se calcula de otra forma el ángulo, se evidenció que safari
//    * no toma los valores del pseudo elemento...
//    */
//   if (transform && transform !== "none") {
//     const values = transform.split("(")[1].split(")")[0].split(",");
//     const a = +values[0];
//     const b = +values[1];
//     angle = normalizeAngle(Math.round(Math.atan2(b, a) * (180 / Math.PI)));
//   } else {
//     /**
//      * Se obtiene el ángulo a través del tiempo transcurrido de giro...
//      */
//     angle = getCurrentRotationAngle(speed as number, direction as string);
//   }

//   return getCurrentRotationAngle(speed as number, direction as string);
// };

// const getClockAngle = () => {
//   // const [, , , id, direction, speed] = CLOCKS[CLOCK_ACTIVE];
//   /*
//   return [
//       x,
//       y,
//       size,
//       `c-${generateUUID()}`,
//       direction,
//       speed,
//       i === CLOCK_ACTIVE,
//     ];
//   */

//   return getCurrentRotationAngle(
//     CLOCKS[CLOCK_ACTIVE][5] as number,
//     CLOCKS[CLOCK_ACTIVE][4] as string
//   );
// };

/**
 * Función que realiza la acción de disprar el elemento del reloj que está girando
 */
const shootBullet = async () => {
  // console.clear();
  /**
   * Se obtiene el ángulo actual del reloj activo,
   */
  // const clockAngle = getClockAngle();
  const clockAngle = getCurrentRotationAngle(
    CLOCKS[CLOCK_ACTIVE][5] as number,
    CLOCKS[CLOCK_ACTIVE][4] as string
  );

  const radians = (clockAngle - 90) * (Math.PI / 180);
  /**
   * Se obtiene la posición de la bala, la cual es relativa a la posición
   * del reloj activo...
   */
  const [startX, startY] = getBulletPosition();

  // console.log({ clockAngle });

  /**
   * Dirección en la que apunta la manecilla
   */
  const directionX = Math.cos(radians);
  const directionY = Math.sin(radians);

  let currentX = startX;
  let currentY = startY;

  /**
   * Guarda el índice del reloj con el que colisiona..
   */
  let indexCollided = -1;
  /**
   * Establece las posiciones de destino de la colisión, si es que existe
   */
  const collisionPoint = { x: 0, y: 0 };

  /**
   * Se obtienen los obstaculos, en este se deja por fuera el reloj activo
   */
  const obstacles = CLOCKS.filter((v) => !v[6]);
  const clockID = CLOCKS[CLOCK_ACTIVE][3];
  const clock = $(`#${clockID}`) as HTMLDivElement;
  const bullet = $(".bullet") as HTMLDivElement;

  /**
   * Se guarda el índice del reloj que estaba activado
   */
  const indexClockRemoved = CLOCK_ACTIVE;

  /**
   * Se establece que ya no hay reloj activo, esto con el fin de evitar que se
   * hagan múltiples clicks, mientras se mueve la bala...
   */
  CLOCK_ACTIVE = -1;

  /**
   * Se muestra la bala, la cual ya está ubicada...
   */
  addClass(bullet, "a");

  // TODO: remover
  // Primero remover todas la que estaban
  // const tmpPath = $$(".tmppath");
  // for (let i = 0; i < tmpPath.length; i++) {
  //   tmpPath[i].remove();
  // }
  // // TODO: eliminar
  // let tmpCounter = 0;

  /**
   * Cálcula el movimiento de la bala y valida si hay colisiones...
   */
  while (
    currentX >= 0 &&
    currentX <= WIDTH &&
    currentY >= 0 &&
    currentY <= HEIGHT
  ) {
    // Moverse en la dirección de la manecilla
    currentX += directionX;
    currentY += directionY;

    // TODO: Quitar cuando se haga el debug de las colisiones
    // const newDiv = document.createElement("div");
    // // Aplicar el transform al div
    // newDiv.style.transform = `translate(${currentX}px, ${currentY}px)`;
    // newDiv.style.width = `${BULLET_SIZE}px`;
    // newDiv.style.height = `${BULLET_SIZE}px`;
    // newDiv.textContent = `${tmpCounter}`;
    // // Aplicar la clase al div
    // newDiv.className = "tmppath";
    // $(BASE_RENDER)?.append(newDiv);
    // tmpCounter++;
    // TODO: hasta aquí se debe auitar...

    /**
     * Se iteran los obtáculos...
     */
    for (let i = 0; i < obstacles.length; i++) {
      const x = obstacles[i][0] as number;
      const y = obstacles[i][1] as number;
      const size = obstacles[i][2] as number;

      const centerX = x + size / 2;
      const centerY = y + size / 2;
      const radius = size / 2;

      const effectiveRadius = radius + BULLET_SIZE / 2;

      // Verificar colisión con el círculo (obstáculo)
      const distance = Math.sqrt(
        (currentX - centerX) ** 2 + (currentY - centerY) ** 2
      );

      // console.log({
      //   i,
      //   directionX,
      //   directionY,
      //   tmpCounter,
      //   size,
      //   centerX,
      //   centerY,
      //   radius,
      //   currentX,
      //   currentY,
      //   finalX: currentX + BULLET_SIZE,
      //   finalY: currentY + BULLET_SIZE,
      //   distance,
      // });

      // if (distance <= radius) {
      // - BULLET_SIZE / 2
      if (distance <= effectiveRadius) {
        indexCollided = i;
        collisionPoint.x = currentX;
        collisionPoint.y = currentY;
        break;
      }

      // const position = {
      //   start: {
      //     x: obstacles[i][0] as number,
      //     y: obstacles[i][1] as number,
      //   },
      //   end: {
      //     x: (obstacles[i][0] as number) + (obstacles[i][2] as number),
      //     y: (obstacles[i][1] as number) + (obstacles[i][2] as number),
      //   },
      // };

      // const collidedX =
      //   currentX >= position.start.x && currentX <= position.end.x;
      // const collidedY =
      //   currentY >= position.start.y && currentY <= position.end.y;

      // if (collidedX && collidedY) {
      //   indexCollided = i;
      //   collisionPoint.x = currentX;
      //   collisionPoint.y = currentY;
      //   break;
      // }
      // console.log(data);
    }

    if (indexCollided >= 0) {
      break;
    }
  }

  /**
   * Se detiene la rotación del reloj...
   */
  addClass(clock, "s");

  /**
   * Se oculta el elmento, potencialmeente agregar una animación
   */
  // TODO: revisar si se puede agregar una animación
  clock.style.display = "none";

  // console.log({ clockAngle, startX, startY, directionX, directionY });

  /**
   * Se obtienen las coordenadas hasta las cuales irá la bala, puede ser los valores
   * de colisión o hasta el valor que se haya cálculado de movimiento..
   */
  const coordinates =
    indexCollided >= 0
      ? collisionPoint
      : {
          x: currentX,
          y: currentY,
        };

  // if (indexCollided >= 0) {
  //   console.log("HAY COLISIÓN", indexCollided);
  //   console.log(collisionPoint);
  // }

  // const newDiv = document.createElement("div");

  // // Aplicar el transform al div
  // newDiv.style.transform = `translate(${coordinates.x}px, ${coordinates.y}px)`;
  // newDiv.style.width = `${BULLET_SIZE}px`;
  // newDiv.style.height = `${BULLET_SIZE}px`;

  // // Aplicar la clase al div
  // newDiv.className = "bullet2";

  // $(BASE_RENDER)?.append(newDiv);

  /**
   * Se establece la posición de destino de la bala...
   */
  addStyle(bullet, {
    transform: `translate(${coordinates.x}px, ${coordinates.y}px)`,
  });

  /**
   * Se obtiene las animaciones, en este caso el transform...
   */
  const animations = bullet?.getAnimations().map((a) => a.finished);

  // console.log("animations: ", animations);

  // const data = await Promise.allSettled(animations);
  /**
   * Se Valida si todas las anoimaciones ya han terminado, en este caso
   * la animación de movimiento...
   */
  await Promise.allSettled(animations);

  // console.log("Termina de animar", data);

  /**
   * Se remueve el reloj seleccionado del dom...
   */
  $(`#${clockID}`)?.remove();

  /**
   * Se remueve del array de relojes...
   */
  CLOCKS.splice(indexClockRemoved, 1);

  /**
   * Se valida si ha existido una colisión, en este caso se tiene el índice del
   * elemento con el cual ha colisionado...
   */
  if (indexCollided >= 0) {
    CLOCK_ACTIVE = indexCollided;
    CLOCKS[CLOCK_ACTIVE][6] = true;
    const clocksAvailable = CLOCKS.length;
    const gameOver = clocksAvailable === 1;
    const newClassNames = "a" + (gameOver ? " s" : "");

    addClass($(`#${CLOCKS[CLOCK_ACTIVE][3]}`) as HTMLElement, newClassNames);

    /**
     * Se obtiene las nueva posición donde quedará la balla...
     */
    const [newStartX, newStarty] = getBulletPosition();

    /**
     * Se ubica la bala..
     */
    addStyle(bullet, {
      transform: `translate(${newStartX}px, ${newStarty}px)`,
    });

    if (gameOver) {
      LEVEL_STATUS = MAX_TIME > 0 ? "passed" : "finalized";
      stopChronometer();
    }
  } else {
    LEVEL_STATUS = "lost";
    stopChronometer();
  }

  // console.log("LOS RELOJES QUE QUEDA: ", CLOCKS);

  /**
   * Se remueve la clase que mostraba la bala...
   */
  removeClass(bullet, "a");

  /**
   * Valida si ha terminado el nivel...
   */
  if (LEVEL_STATUS !== "default") {
    await delay(600);

    const modalContainer = ".game-o";
    addClass(
      $(modalContainer) as HTMLElement,
      `a mo ${LEVEL_STATUS[0]}`.trim()
    );

    const label = LEVEL_STATUS === "lost" ? "Failed" : "Complete";
    const heading =
      LEVEL_STATUS === "lost"
        ? "Oh no"
        : LEVEL_STATUS === "passed"
        ? "Great!"
        : "Not Bad!";

    const modalTilte = `${modalContainer} .me`;
    $(`${modalTilte} h1`)!.textContent = heading;
    $(`${modalTilte} h3`)!.textContent = `Level ${currentLevel + 1} ${label}`;
  }
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
  chronometerElement!.textContent = `${MAX_TIME}`;

  /**
   * Tiempo inicial en el que se carga el nivel
   */
  START_TIME = new Date().getTime();

  /**
   * Se establece la data para los relojes...
   */
  CLOCKS = (data[2] as number[][]).map(([x, y, size], i) => {
    const [direction, speed] = getClockProperties();

    return [
      x,
      y,
      size,
      `c-${generateUUID()}`,
      direction,
      speed,
      i === CLOCK_ACTIVE,
    ];
  });
  // i, // TODO: remover...

  /**
   * Se renderizan los relojes y la bala...
   */
  setHtml(
    $(BASE_RENDER),
    [CLOCKS.map((v) => Clock(v)), Bullet([...getBulletPosition(), BULLET_SIZE])]
      .flat()
      .join("")
  );
};

const stopChronometer = () => {
  if (INTERVAL_CHRONOMETER) {
    clearInterval(INTERVAL_CHRONOMETER);
    INTERVAL_CHRONOMETER = null;
  }
};

const startChronometer = () => {
  stopChronometer();

  chronometerElement!.textContent = `${MAX_TIME}`;

  if (MAX_TIME > 0) {
    INTERVAL_CHRONOMETER = setInterval(() => {
      if (MAX_TIME - 1 >= 0) {
        MAX_TIME--;
        chronometerElement!.textContent = `${MAX_TIME}`;
      } else {
        // TODO: quitar el cronometro cuando llega a cero
        // $(".game-t .t")
        stopChronometer();
      }
    }, 1000);
  }
};

// TODO: Validar isInfinity, para el otro modo del juego, si es que queda espacio
export const initComponent = (level = 0, isInfinity = false) => {
  console.log({ isInfinity });
  currentLevel = level;
  chronometerElement = $(".game-t .c");
  loadLevel(currentLevel);

  $on($(BASE_RENDER) as HTMLElement, "click", () => {
    if (LEVEL_STATUS === "default" && CLOCK_ACTIVE >= 0) {
      shootBullet();

      if (!INTERVAL_CHRONOMETER && MAX_TIME > 0) {
        startChronometer();
      }
    }
  });

  eventButton((action) => {
    const modalContainer = ".game-o";

    if (["pause", "run", "next"]) {
      stopChronometer();
    }

    if (["play", "next", "run"].includes(action)) {
      removeClass($(modalContainer) as HTMLElement, "a l p f mo");
    }

    if (action === "pause") {
      addClass($(modalContainer) as HTMLElement, "a");
      $(`${modalContainer} .ti h3`)!.textContent = `Level - ${
        currentLevel + 1
      }`;
    }

    if (action === "play") {
      // TODO: revisar que no se inicie el tiempo si no se había hecho lanzamiento
      startChronometer();
    }

    if (action === "run") {
      LEVEL_STATUS = "default";
      loadLevel(currentLevel);
    }

    if (action === "next") {
      if (currentLevel + 1 < TOTAL_LEVELS) {
        currentLevel++;
        LEVEL_STATUS = "default";
        loadLevel(currentLevel);
      }
    }

    if (action === "main") {
      Screen();
    }
  });
};
