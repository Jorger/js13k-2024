import { isValidJson } from "./helpers";

const CACHE_KEY = "THIRTEEN_HOURS";

/**
 * Guarda la información en caché (session o localstorage)...
 * @param data
 * @param storageType
 */
export const saveCache = <T>(data: T) => {
  const finalData = JSON.stringify(data);
  localStorage.setItem(CACHE_KEY, finalData);
};

/**
 * Obtener la data que está guardarda en localStorage/sessionStorage
 * @param storageType
 * @returns
 */
export const getDataCache = () => {
  const data = localStorage.getItem(CACHE_KEY) || "";
  return data !== "" && isValidJson(data) ? JSON.parse(data) : {};
};

/**
 * Guarda valores de una propiedad en localstorage
 * @param property
 * @param value
 * @param storageType
 */
export const savePropierties = <T>(property: string, value: T) => {
  const localCache = getDataCache();
  localCache[property] = value;
  saveCache(localCache);
};

/**
 * Dada una propiedad, devuelve la información de la misma
 * @param key
 * @param initial
 * @param storageType
 * @returns
 */
export const getValueFromCache = <T>(key: string = "", initial: T): T => {
  const localCache = getDataCache();
  return localCache[key] ?? initial;
};
