import LEVELS from './levels';

export const totalLevels = () => LEVELS.length;

export const getLevel = (level = 0) => LEVELS[level];
