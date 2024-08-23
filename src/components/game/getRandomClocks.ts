import { HEIGHT, WIDTH } from "../../utils/constants";
import { randomNumber } from "../../utils/helpers";

interface Element {
  x: number;
  y: number;
  size: number;
}

const MIN_X = 10;
const MAX_X = WIDTH - 10;
const MIN_Y = 70;
const MAX_Y = HEIGHT - 10;
const MIN_SIZE = 40;
const MAX_SIZE = 120;
const TOTAL_ELEMENTS = 11;

const isOverlapping = (element1: Element, element2: Element): boolean => {
  const left1 = element1.x;
  const right1 = element1.x + element1.size;
  const top1 = element1.y;
  const bottom1 = element1.y + element1.size;

  const left2 = element2.x;
  const right2 = element2.x + element2.size;
  const top2 = element2.y;
  const bottom2 = element2.y + element2.size;

  const isHorizontalOverlap = !(right1 <= left2 || left1 >= right2);
  const isVerticalOverlap = !(bottom1 <= top2 || top1 >= bottom2);

  return isHorizontalOverlap && isVerticalOverlap;
};

export const generateRandomClock = (existingElements: Element[]): Element => {
  let valid = false;
  let newElement: Element = { x: 0, y: 0, size: 0 };

  while (!valid) {
    const x = randomNumber(MIN_X, MAX_X);
    const y = randomNumber(MIN_Y, MAX_Y);
    const size = randomNumber(MIN_SIZE, MAX_SIZE);

    newElement = { x, y, size };

    // Revisa si esta dentro del escenario y además que no haya overlaping con otros elementos
    if (
      newElement.x >= MIN_X &&
      newElement.y >= MIN_Y &&
      newElement.x + newElement.size <= MAX_X &&
      newElement.y + newElement.size <= MAX_Y &&
      !existingElements.some((existingElement) =>
        isOverlapping(existingElement, newElement)
      )
    ) {
      valid = true;
    }
  }

  return newElement;
};

export const getRandomClocks = () => {
  const elements: Element[] = [];

  while (elements.length < TOTAL_ELEMENTS) {
    const newElement = generateRandomClock(elements);
    if (newElement) {
      elements.push(newElement);
    }
  }

  return [
    randomNumber(0, TOTAL_ELEMENTS - 1),
    0,
    elements.map((v) => [v.x, v.y, v.size]),
  ];
};