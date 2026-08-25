import { create } from 'zustand';
import { createInitialState } from '../game/createState.ts';
import { syncAct } from '../game/progression.ts';
import { unlockBlock } from '../data/research.ts';
import { buyResearch } from '../game/research.ts';
import { choose, startRun } from '../game/resolve.ts';
import { bootState, clearSave, newSeed, writeSave } from '../utils/persistence.ts';
import type { GameState, TabId } from '../types/game.ts';

interface GameStore {
  state: GameState;
  start: () => void;
  pick: (choiceId: string) => void;
  buy: (id: string) => void;
  setTab: (tab: TabId) => void;
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
  buy: (id) =>
    set((store) => {
      const next = buyResearch(store.state, id);
      if (!next) {
        const why =
          unlockBlock(id, store.state.unlockedResearch, store.state.researchPoints) ||
          'Cannot unlock that yet.';
        return { state: persist({ ...store.state, notice: why }) };
      }
      syncAct(next);
      return { state: persist(next) };
    }),
  setTab: (tab) =>
    set((store) => {
      if (store.state.tab === tab) return store;
      const next = { ...store.state, tab };
      return { state: persist(next) };
    }),
  reset: () => {
    clearSave();
    set({ state: persist(createInitialState(newSeed())) });
  },
}));
