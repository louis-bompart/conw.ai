import { createConwayStore } from '@conwai/engine';

export function initConway(root: Document | HTMLElement = document) {
  const store = createConwayStore(30, 20);

  const gridContainer = root.querySelector('#grid-container') as HTMLDivElement;
  if (!gridContainer) return; // Prevent errors if not found

  const COLS = store.getState().cols;
  const ROWS = store.getState().rows;

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
        store.getState().toggleCell(x, y);
      });
      gridContainer.appendChild(cell);
      cellElements[y][x] = cell;
    }
  }

  function renderGrid(grid: boolean[][]) {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const isAlive = grid[y][x];
        if (isAlive) {
          cellElements[y][x].classList.add('alive');
        } else {
          cellElements[y][x].classList.remove('alive');
        }
      }
    }
  }

  const btnPlay = root.querySelector('#btn-play') as HTMLButtonElement;
  const btnPause = root.querySelector('#btn-pause') as HTMLButtonElement;
  const btnTick = root.querySelector('#btn-tick') as HTMLButtonElement;
  const btnClear = root.querySelector('#btn-clear') as HTMLButtonElement;

  // Subscribe to store changes
  store.subscribe((state, prevState) => {
    if (state.grid !== prevState.grid) {
      renderGrid(state.grid);
    }
    
    // update buttons state
    if (btnPlay && btnPause && btnTick) {
      btnPlay.disabled = state.isPlaying;
      btnPause.disabled = !state.isPlaying;
      btnTick.disabled = state.isPlaying;
    }
  });

  // Initial render
  renderGrid(store.getState().grid);

  // Controls
  if (btnPlay) btnPlay.addEventListener('click', () => store.getState().play());
  if (btnPause) btnPause.addEventListener('click', () => store.getState().pause());
  if (btnTick) btnTick.addEventListener('click', () => store.getState().tick());
  if (btnClear) btnClear.addEventListener('click', () => store.getState().clear());

  return store;
}

// Auto-init if we are in the main document (not Storybook)
if (typeof document !== 'undefined' && document.getElementById('grid-container')) {
  initConway(document);
}
