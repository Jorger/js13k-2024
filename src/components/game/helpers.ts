import { getLevel } from '../../levels';
import { $, $on, setHtml } from '../../utils/helpers';
import { Clock } from './components';

const loadLevel = (level = 0) => {
  const data = getLevel(level);
  const clocks: string[] = (data[1] as number[][]).map(([x, y, size], i) =>
    Clock([x, y, size, Math.random(), i === (data[0] as number)])
  );

  setHtml($('.game-c'), clocks.join(''));
};

export const initComponent = (level = 0) => {
  loadLevel(level);

  $on($('.game-c') as HTMLElement, 'click', () => {
    console.log('CLICK EN EL CAVAS');
  });

  // Se debe agregar el evento click al escenario y a los botones que se requieran
};
