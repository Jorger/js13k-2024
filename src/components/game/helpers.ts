import { Bullet, Clock } from "./components";
import { generateRandomClock, getRandomClocks } from "./getRandomClocks";
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
import {
  getLevel,
  getTotalLevels,
  isLevelBlocked,
  saveLevelPassed,
} from "../../levels";
import Screen from "../../Screen";

const TOTAL_LEVELS = getTotalLevels();
const BASE_RENDER = ".g-c";
const modalContainer = ".g-o";
const BULLET_SIZE = 10;
let CLOCK_ACTIVE = -1;
let MAX_TIME = 0;
let CLOCKS: (string | number | boolean)[][];
let INTERVAL_CHRONOMETER: NodeJS.Timeout | null;
let chronometerElement: HTMLElement | null;
let LEVEL_STATUS: "D" | "P" | "L" | "F" = "D";
let CURRET_LEVEL = 0;
let IS_INFINITY_LEVEL = false;
let COUNTER_INFINITY = 0;
let GAME_STARTED = false;

/**
 * Generar información aleatoria para los relojes...
 * @returns
 */
const getClockProperties = () => {
  const direction = randomNumber(0, 1) === 0 ? "normal" : "reverse";
  const seconds = randomNumber(1, 3);
  const miliseconds = randomNumber(0, 9) / 10;
  const speed = seconds + miliseconds;

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
  start = 0,
  direction = "normal"
) => {
  const now = new Date().getTime();
  const elapsed = (now - start) / 1000;
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
 * Crear un nuevo reloj para la jugabilidad infinito...
 */
const setNewClock = () => {
  const { x, y, s } = generateRandomClock(
    // @ts-ignore
    CLOCKS.map(([x, y, s]) => ({ x, y, s }))
  );

  const [direction, speed] = getClockProperties();
  const newClock = [
    x,
    y,
    s,
    `c-${generateUUID()}`,
    direction,
    speed,
    false,
    new Date().getTime(),
  ];

  CLOCKS.push(newClock);

  const newDiv = document.createElement("div");

  addStyle(newDiv, {
    left: `${x}px`,
    top: `${y}px`,
    width: `${s}px`,
    height: `${s}px`,
  });

  newDiv.style.setProperty("--s", `${speed}s`);
  newDiv.style.setProperty("--d", direction as string);

  addClass(newDiv, "clock bor");
  newDiv.id = newClock[3] as string;
  $(BASE_RENDER)?.append(newDiv);
};

/**
 * Función que realiza la acción de disprar el elemento del reloj que está girando
 */
const shootBullet = async () => {
  /**
   * Se obtiene el ángulo actual del reloj activo,
   */
  const clockAngle = getCurrentRotationAngle(
    CLOCKS[CLOCK_ACTIVE][5] as number,
    CLOCKS[CLOCK_ACTIVE][7] as number,
    CLOCKS[CLOCK_ACTIVE][4] as string
  );

  const radians = (clockAngle - 90) * (Math.PI / 180);
  /**
   * Se obtiene la posición de la bala, la cual es relativa a la posición
   * del reloj activo...
   */
  const [startX, startY] = getBulletPosition();

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
  const collisionPoint = [0, 0];

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

  /**
   * Contador para agregar un valor adicional a la colisión...
   */
  let additionalCollisionCounter = 0;

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

    /**
     * Se iteran los obtáculos...
     */

    if (indexCollided < 0) {
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

        /**
         * Hay colisión y de guarda el índice del elemento con el que colisiona...
         */
        if (distance <= effectiveRadius) {
          indexCollided = i;
        }
      }
    } else {
      additionalCollisionCounter++;
      /**
       * Para que el punto de colisión esté más "adentro" del elemento
       */
      if (additionalCollisionCounter === 10) {
        collisionPoint[0] = currentX;
        collisionPoint[1] = currentY;
        break;
      }
    }
  }

  /**
   * Se detiene la rotación del reloj...
   */
  addClass(clock, "s");

  /**
   * Se remueve el reloj seleccionado del dom...
   */
  $(`#${clockID}`)?.remove();

  /**
   * Se remueve del array de relojes...
   */
  CLOCKS.splice(indexClockRemoved, 1);

  /**
   * Se obtienen las coordenadas hasta las cuales irá la bala, puede ser los valores
   * de colisión o hasta el valor que se haya cálculado de movimiento..
   */
  const coordinates =
    indexCollided >= 0 ? collisionPoint : [currentX, currentY];

  /**
   * Se establece la posición de destino de la bala...
   */
  addStyle(bullet, {
    transform: `translate(${coordinates[0]}px, ${coordinates[1]}px)`,
  });

  /**
   * Se obtiene las animaciones, en este caso el transform...
   */
  const animations = bullet?.getAnimations().map((a) => a.finished);

  /**
   * Se Valida si todas las anoimaciones ya han terminado, en este caso
   * la animación de movimiento...
   */
  await Promise.allSettled(animations);

  /**
   * Se valida si ha existido una colisión, en este caso se tiene el índice del
   * elemento con el cual ha colisionado...
   */
  if (indexCollided >= 0) {
    if (IS_INFINITY_LEVEL) {
      // Se incrementa la cantidad de elementos eliminados.
      COUNTER_INFINITY++;
      chronometerElement!.textContent = `${COUNTER_INFINITY}`;
      setNewClock();
    }

    /**
     * Se obtiene el índice real del elemento con el cual
     * ha colisionado, ya que indexCollided es el índice del
     * elemento del listado de obstacles, y como está filtrada
     * el índice es diferente, además se elimina el elemento que estaba
     * activo
     */
    CLOCK_ACTIVE = CLOCKS.findIndex(
      (v) => v[3] === obstacles[indexCollided][3]
    );

    /**
     * Se especidica que el elemento está activado...
     */
    CLOCKS[CLOCK_ACTIVE][6] = true;

    const clocksAvailable = CLOCKS.length;
    const gameOver = clocksAvailable === 1;
    const newClassNames = "a co" + (gameOver ? " s" : "");

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
      LEVEL_STATUS = MAX_TIME > 0 ? "P" : "F";

      if (MAX_TIME > 0) {
        saveLevelPassed(CURRET_LEVEL);
      }
    }
  } else {
    LEVEL_STATUS = "L";
  }

  /**
   * Se remueve la clase que mostraba la bala...
   */
  removeClass(bullet, "a");

  /**
   * Valida si ha terminado el nivel...
   */
  if (LEVEL_STATUS !== "D") {
    let label = `Level ${CURRET_LEVEL + 1} ${
      LEVEL_STATUS === "L" ? "Failed" : "Complete"
    }`;
    let heading =
      LEVEL_STATUS === "L"
        ? "Oh no"
        : LEVEL_STATUS === "P"
        ? "Great!"
        : "Not Bad!";

    if (IS_INFINITY_LEVEL) {
      heading = `${COUNTER_INFINITY}`;
      label = "Score";
    } else {
      stopChronometer();
    }

    // Interrupcion para mostrar el modal final
    await delay(600);

    /**
     * Se muestra el modal final de game over...
     */
    addClass($(modalContainer) as HTMLElement, `a mo ${LEVEL_STATUS}`);
    const modalTilte = `${modalContainer} .me`;
    $(`${modalTilte} h1`)!.textContent = heading;
    $(`${modalTilte} h3`)!.textContent = label;
  }
};

/**
 * Función que carga el nivel seleccionado...
 * @param level
 */
const loadLevel = () => {
  /**
   * Obtiene la data del nivel...
   */
  const data = !IS_INFINITY_LEVEL ? getLevel(CURRET_LEVEL) : getRandomClocks();

  /**
   * Guadar el reloj seleccionado y el tiempo máximo para
   * resolver el nivel y obtener una estrella..
   */
  CLOCK_ACTIVE = 0;
  MAX_TIME = data[0] as number;

  /**
   * LLevará el contador de los elementos eliminados en la
   * modalidad infinita
   */
  COUNTER_INFINITY = 0;
  chronometerElement!.textContent = `${MAX_TIME}`;

  /**
   * Indicar el estado por defecto...
   */
  LEVEL_STATUS = "D";

  /**
   * Indica que no se ha iniciado el juego, en este caso cuandos e hace click
   * para lanzar la bala la primera vez...
   */
  GAME_STARTED = false;

  /**
   * Para mostrar el reloj de nuevo si es que se había ocultado...
   */
  removeClass($(".g-t .t") as HTMLElement, "h");

  const totalCLock = (data[1] as number[][]).length;
  const animationTime = 3 / totalCLock;
  /**
   * Se establece la data para los relojes...
   */
  CLOCKS = (data[1] as number[][]).map(([x, y, size], i) => {
    const [direction, speed] = getClockProperties();

    return [
      x,
      y,
      size,
      `c-${generateUUID()}`,
      direction,
      speed,
      i === CLOCK_ACTIVE,
      new Date().getTime(),
      +(animationTime * (i + 1)).toFixed(2),
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

  chronometerElement!.textContent = `${MAX_TIME}`;

  if (MAX_TIME > 0) {
    INTERVAL_CHRONOMETER = setInterval(() => {
      if (MAX_TIME - 1 >= 0) {
        MAX_TIME--;
        chronometerElement!.textContent = `${MAX_TIME}`;

        if (MAX_TIME === 0) {
          addClass($(".g-t .t") as HTMLElement, "h");
        }
      } else {
        stopChronometer();
      }
    }, 1000);
  }
};

/**
 * Función principal del componente...
 * @param level
 * @param isInfinity
 */
export const initComponent = (level = 0, isInfinity = false) => {
  CURRET_LEVEL = level;
  IS_INFINITY_LEVEL = isInfinity;
  chronometerElement = $(".g-t .c");
  loadLevel();

  $on($(BASE_RENDER) as HTMLElement, "click", () => {
    if (LEVEL_STATUS === "D" && CLOCK_ACTIVE >= 0) {
      shootBullet();

      if (!GAME_STARTED) {
        GAME_STARTED = true;
      }

      if (!INTERVAL_CHRONOMETER && MAX_TIME > 0) {
        startChronometer();
      }
    }
  });

  eventButton((action) => {
    if (["pause", "run", "next"]) {
      stopChronometer();
    }

    if (["play", "next", "run"].includes(action)) {
      removeClass($(modalContainer) as HTMLElement, "a L P F mo");
    }

    if (action === "pause") {
      addClass($(modalContainer) as HTMLElement, "a");

      if (!IS_INFINITY_LEVEL) {
        const nextLevelValue = CURRET_LEVEL + 1;

        $(
          `${modalContainer} .ti h3`
        )!.textContent = `Level - ${nextLevelValue}`;

        const isValidNextLevel = nextLevelValue < TOTAL_LEVELS;
        const nextLevelDisabled = isLevelBlocked(
          Math.floor(nextLevelValue / 20)
        );

        const isNextDisabled = !isValidNextLevel || nextLevelDisabled;
        ($("#next") as HTMLButtonElement).disabled = isNextDisabled;
      }
    }

    if (action === "play") {
      if (GAME_STARTED && !IS_INFINITY_LEVEL) {
        startChronometer();
      }
    }

    if (action === "run") {
      LEVEL_STATUS = "D";
      loadLevel();
    }

    if (action === "next") {
      CURRET_LEVEL++;
      LEVEL_STATUS = "D";
      loadLevel();
    }

    if (action === "main") {
      Screen();
    }
  });
};
