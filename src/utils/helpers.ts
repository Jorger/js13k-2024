export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

export const $on = (
  target: HTMLElement,
  type: any,
  callback: (this: HTMLElement, ev: any) => any
) => target?.addEventListener(type, callback);

export const setHtml = (element: HTMLElement | null, html: string) => {
  if (element) {
    element.innerHTML = html;
  }
};

/**
 * Devuleve un número "aleatorio", dado un rango...
 * @param min
 * @param max
 * @returns
 */
export const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const generateUUID = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export const addClass = (target: HTMLElement, className = "") => {
  if (target) {
    className.split(" ").forEach((classText) => {
      target.classList.add(classText);
    });
  }
};

export const removeClass = (target: HTMLElement, className = "") => {
  if (target) {
    className.split(" ").forEach((classText) => {
      target.classList.remove(classText);
    });
  }
};

export const addStyle = (
  target: null | HTMLElement,
  styles: Record<string, string>
): void => {
  if (target) {
    for (const style in styles) {
      target.style[style as any] = styles[style];
    }
  }
};

// export const isMobile = (): boolean =>
//   /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const debounce = (fn: Function, delay: number) => {
  var t: number;
  return function () {
    clearTimeout(t);
    t = setTimeout(fn, delay);
  };
};

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
