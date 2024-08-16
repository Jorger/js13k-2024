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

// export const addStyle = (
//   target: null | HTMLElement,
//   styles: Record<string, string>
// ): void => {
//   if (target) {
//     for (const style in styles) {
//       target.style[style as any] = styles[style];
//     }
//   }
// };
