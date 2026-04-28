import { createStore } from 'zustand/vanilla';
import { GameOfLife } from './game';

export interface ConwayState {
  game: GameOfLife;
  grid: boolean[][];
  isPlaying: boolean;
  cols: number;
  rows: number;
  intervalId: number | null;
}

export interface ConwayActions {
  play: () => void;
  pause: () => void;
  tick: () => void;
  clear: () => void;
  toggleCell: (x: number, y: number) => void;
}

type _ConwayStore = ConwayState & ConwayActions;

export const createConwayStore = (cols: number = 30, rows: number = 20, initialState: string = "") => {
  const game = new GameOfLife(cols, rows, initialState);

  return createStore<_ConwayStore>((set, get) => ({
    game,
    grid: game.grid,
    isPlaying: false,
    cols,
    rows,
    intervalId: null,

    play: () => {
      const state = get();
      if (state.intervalId !== null) return;

      const intervalId = window.setInterval(() => {
        get().tick();
      }, 200);

      set({ isPlaying: true, intervalId });
    },

    pause: () => {
      const state = get();
      if (state.intervalId !== null) {
        window.clearInterval(state.intervalId);
      }
      set({ isPlaying: false, intervalId: null });
    },

    tick: () => {
      const state = get();
      state.game.tick();
      set({ grid: state.game.grid });
    },

    clear: () => {
      const state = get();
      state.game.clear();
      if (state.intervalId !== null) {
        window.clearInterval(state.intervalId);
      }
      set({ grid: state.game.grid, isPlaying: false, intervalId: null });
    },

    toggleCell: (x: number, y: number) => {
      const state = get();
      state.game.toggleCell(x, y);
      set({ grid: [...state.game.grid] }); // new reference to trigger reactivity
    }
  }));
};

export type ConwayStore = ReturnType<typeof createConwayStore>;