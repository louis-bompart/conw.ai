import { GameOfLife } from './game';

const COLS = 30;
const ROWS = 20;

const game = new GameOfLife(COLS, ROWS);
const gridContainer = document.getElementById('grid-container') as HTMLDivElement;

// Set up grid CSS columns
gridContainer.style.gridTemplateColumns = `repeat(${COLS}, 1fr)`;

// Create DOM cells
const cellElements: HTMLDivElement[][] = [];

for (let y = 0; y < ROWS; y++) {
  cellElements[y] = [];
  for (let x = 0; x < COLS; x++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.addEventListener('click', () => {
      game.toggleCell(x, y);
      render();
    });
    gridContainer.appendChild(cell);
    cellElements[y][x] = cell;
  }
}

function render() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const isAlive = game.getCell(x, y);
      if (isAlive) {
        cellElements[y][x].classList.add('alive');
      } else {
        cellElements[y][x].classList.remove('alive');
      }
    }
  }
}

// Initial render
render();

// Controls
const btnPlay = document.getElementById('btn-play') as HTMLButtonElement;
const btnPause = document.getElementById('btn-pause') as HTMLButtonElement;
const btnTick = document.getElementById('btn-tick') as HTMLButtonElement;
const btnClear = document.getElementById('btn-clear') as HTMLButtonElement;

let intervalId: number | null = null;

function play() {
  if (intervalId !== null) return;
  intervalId = window.setInterval(() => {
    game.tick();
    render();
  }, 200);
  btnPlay.disabled = true;
  btnPause.disabled = false;
  btnTick.disabled = true;
}

function pause() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  btnPlay.disabled = false;
  btnPause.disabled = true;
  btnTick.disabled = false;
}

btnPlay.addEventListener('click', play);
btnPause.addEventListener('click', pause);
btnTick.addEventListener('click', () => {
  game.tick();
  render();
});
btnClear.addEventListener('click', () => {
  game.clear();
  render();
  pause();
});
