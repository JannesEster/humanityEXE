import { create } from 'zustand';
import { createInitialState } from '../game/createState.ts';
import { choose, startRun } from '../game/resolve.ts';
import { bootState, clearSave, newSeed, writeSave } from '../utils/persistence.ts';
import type { GameState } from '../types/game.ts';

interface GameStore {
  state: GameState;
  start: () => void;
  pick: (choiceId: string) => void;
  reset: () => void;
}

function persist(state: GameState): GameState {
  writeSave(state);
  return state;
}

export const useGameStore = create<GameStore>((set) => ({
  state: bootState(),
  start: () => set((store) => ({ state: persist(startRun(store.state)) })),
  pick: (choiceId) => set((store) => ({ state: persist(choose(store.state, choiceId)) })),
  reset: () => {
    clearSave();
    set({ state: persist(createInitialState(newSeed())) });
  },
}));
