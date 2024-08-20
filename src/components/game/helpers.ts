import { Bullet, Clock } from "./components";
import { getLevel } from "../../levels";
import {
  $,
  $$,
  $on,
  addClass,
  addStyle,
  generateUUID,
  randomNumber,
  removeClass,
  setHtml,
} from "../../utils/helpers";
import { HEIGHT, WIDTH } from "../../utils/constants";

const BASE_RENDER = ".game-c";
const BULLET_SIZE = 10;
let CLOCK_ACTIVE = -1;
let MAX_TIME = 0;
let CLOCKS: (string | number | boolean)[][];
let START_TIME: number = 0;
let INTERVAL_CHRONOMETER: NodeJS.Timeout | null;
let chronometerElement: HTMLElement | null;

const normalizeAngle = (angle = 0) => ((angle % 360) + 360) % 360;

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
 * Obtiene el ángulo dependiendo del tiempo transcurrido,
 * aplicable para safari...
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
const getClockAngle = () => {
  const [, , , id, direction, speed] = CLOCKS[CLOCK_ACTIVE];
  const element = $(`#${id}`) as HTMLDivElement;

  // Obtener el ángulo actual del pseudo-elemento
  const style = window.getComputedStyle(element, "::before");
  const transform = style.transform;

  let angle = 0;

  /**
   * Se busca el transform en el before, en caso que no exista,
   * se calcula de otra forma el ángulo, se evidenció que safari
   * no toma los valores del pseudo elemento...
   */
  if (transform && transform !== "none") {
    const values = transform.split("(")[1].split(")")[0].split(",");
    const a = +values[0];
    const b = +values[1];
    angle = normalizeAngle(Math.round(Math.atan2(b, a) * (180 / Math.PI)));
  } else {
    /**
     * Se obtiene el ángulo a través del tiempo transcurrido de giro...
     */
    angle = getCurrentRotationAngle(speed as number, direction as string);
  }

  angle = getCurrentRotationAngle(speed as number, direction as string);

  return angle;
};

const shootBullet = async () => {
  const clockAngle = getClockAngle();
  const radians = (clockAngle - 90) * (Math.PI / 180);
  const [startX, startY] = getBulletPosition();

  // Dirección en la que apunta la manecilla
  const directionX = Math.cos(radians);
  const directionY = Math.sin(radians);

  let currentX = startX;
  let currentY = startY;
  let indexCollided = -1;
  const collisionPoint = { x: 0, y: 0 };

  const obstacles = CLOCKS.filter((v) => !v[6]);

  // console.log({ obstacles });

  const [, , , id] = CLOCKS[CLOCK_ACTIVE];
  const clock = $(`#${id}`) as HTMLDivElement;
  const bullet = $(".bullet") as HTMLDivElement;
  const indexClockRemoved = CLOCK_ACTIVE;

  /**
   * TMP: No hay reloj activo
   */
  CLOCK_ACTIVE = -1;

  addClass(bullet, "a");

  // TODO: remover
  // Primero remover todas la que estaban
  const tmpPath = $$(".tmppath");
  for (let i = 0; i < tmpPath.length; i++) {
    tmpPath[i].remove();
  }

  while (
    currentX >= 0 &&
    currentX <= WIDTH &&
    currentY >= 0 &&
    currentY <= HEIGHT
  ) {
    // Moverse en la dirección de la manecilla
    currentX += directionX;
    currentY += directionY;

    const newDiv = document.createElement("div");

    // Aplicar el transform al div
    newDiv.style.transform = `translate(${currentX}px, ${currentY}px)`;
    newDiv.style.width = `${BULLET_SIZE}px`;
    newDiv.style.height = `${BULLET_SIZE}px`;

    // Aplicar la clase al div
    newDiv.className = "tmppath";

    $(BASE_RENDER)?.append(newDiv);

    for (let i = 0; i < obstacles.length; i++) {
      const x = obstacles[i][0] as number;
      const y = obstacles[i][1] as number;
      const size = obstacles[i][2] as number;

      const centerX = x + size / 2;
      const centerY = y + size / 2;
      const radius = size / 2;

      // Verificar colisión con el círculo (obstáculo)
      const distance = Math.sqrt(
        (currentX - centerX) ** 2 + (currentY - centerY) ** 2
      );

      if (distance <= radius) {
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

  addClass(clock, "s");
  /**
   * Se oculta el elmento, potencialmeente agregar una animación
   */
  clock.style.display = "none";

  // console.log({ clockAngle, startX, startY, directionX, directionY });

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

  addStyle(bullet, {
    transform: `translate(${coordinates.x}px, ${coordinates.y}px)`,
  });

  const animations = bullet?.getAnimations().map((a) => a.finished);

  // console.log("animations: ", animations);

  // const data = await Promise.allSettled(animations);
  await Promise.allSettled(animations);

  // console.log("Termina de animar", data);

  /**
   * Se remueve el reloj seleccionado del dom...
   */
  $(`#${id}`)?.remove();
  CLOCKS.splice(indexClockRemoved, 1);

  // console.log(CLOCKS);

  // Se debe sacar del listado de

  if (indexCollided >= 0) {
    // console.log("HA COLISIONADO");
    CLOCK_ACTIVE = indexCollided;
    CLOCKS[CLOCK_ACTIVE][6] = true;
    const clocksAvailable = CLOCKS.length;
    const gameOver = clocksAvailable === 1;
    const newClassNames = "a" + (gameOver ? " s" : "");

    // console.log({ newClassNames });

    addClass($(`#${CLOCKS[CLOCK_ACTIVE][3]}`) as HTMLElement, newClassNames);
    removeClass(bullet, "a");

    const [newStartX, newStarty] = getBulletPosition();

    if (gameOver) {
      stopChronometer();
    }

    addStyle(bullet, {
      transform: `translate(${newStartX}px, ${newStarty}px)`,
    });
  } else {
    stopChronometer();
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
  chronometerElement!.textContent = `${MAX_TIME}s`;

  /**
   * Tiempo inicial en el que se carga el nivel,
   * este tiempo se usa como fallback para buscar el ángulo (safari)
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

  chronometerElement!.textContent = `${MAX_TIME}s`;

  INTERVAL_CHRONOMETER = setInterval(() => {
    MAX_TIME--;

    if (MAX_TIME >= 0) {
      chronometerElement!.textContent = `${MAX_TIME}s`;
    } else {
      stopChronometer();
    }
  }, 1000);
};

export const initComponent = (level = 0) => {
  chronometerElement = $(".game-t .c");
  loadLevel(level);

  $on($(BASE_RENDER) as HTMLElement, "click", () => {
    if (CLOCK_ACTIVE >= 0) {
      shootBullet();

      if (!INTERVAL_CHRONOMETER && MAX_TIME > 0) {
        startChronometer();
      }
    }
  });

  // Para el toolbar
  const pauseButton = $(".game-t .bt") as HTMLElement;

  if (pauseButton) {
    $on(pauseButton, "click", () => {
      // console.log("PAUSA");
      stopChronometer();
      loadLevel(level);
    });
  }

  // console.clear();

  // const interval = setInterval(() => {
  //   if (CLOCK_ACTIVE >= 0) {
  //     shootBullet();
  //   }
  // }, 100);

  // Se debe agregar el evento click al escenario y a los botones que se requieran
};
