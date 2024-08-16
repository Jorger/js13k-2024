import './styles.css';

export default ([x, y, size, id, active]: (number | boolean)[]) => {
  const style = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  const className = `clock ${active ? 'active' : ''}`;
  const idValue = `cl-${id}`;

  return /*html*/ `<div id="${idValue}" class="${className}" style="${style}"></div>`;
};
