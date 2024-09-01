import { getValueFromCache, savePropierties } from "../utils/storage";
import { MIN_STARS_NEXT_LEVEL } from "../utils/constants";
import LEVELS from "./levels";

const LEVEL_PASSED: number[] = getValueFromCache<number[]>("levels", []);

export const getTotalLevels = () => LEVELS.length;

export const getLevel = (level = 0) => LEVELS[level];

/**
 * Para saber si el nivel ya se ha pasado...
 * @param level
 * @returns
 */
export const isLevelPassed = (level = 0) => LEVEL_PASSED.includes(level);

/**
 * Para guardar un nivel ya pasado (se obtuvo estrella)...
 * @param level
 */
export const saveLevelPassed = (level = 0) => {
  if (!isLevelPassed(level)) {
    LEVEL_PASSED.push(level);
    savePropierties("levels", LEVEL_PASSED);
  }
};

/**
 * Calcula y devuleve las estrellas necesarias para bloquear un nivel...
 */
export const startsRemain = (slide = 0) => {
  const totalLevelsPassed = LEVEL_PASSED.length;
  const totalRequired = slide * MIN_STARS_NEXT_LEVEL;
  const remain = totalRequired - totalLevelsPassed;
  return [totalLevelsPassed, totalRequired, remain];
};

/**
 * Valida si un nivel está bloqueado...
 * @param slide
 * @returns
 */
export const isLevelBlocked = (slide = 0) => {
  if (slide === 0) return false;
  const [totalLevelsPassed, totalRequired] = startsRemain(slide);

  return totalLevelsPassed < totalRequired;
};
