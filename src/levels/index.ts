import LEVELS from "./levels";

export const getTotalLevels = () => LEVELS.length;

export const getLevel = (level = 0) => LEVELS[level];
