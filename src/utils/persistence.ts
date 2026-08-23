import { createInitialState } from '../game/createState.ts';
import { SAVE_KEY, STATE_VERSION } from '../game/constants.ts';
import type { GameState, SaveFile } from '../types/game.ts';

export function loadSave(): GameState | null {
  const raw = window.localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SaveFile | GameState;
    const state = 'gameState' in parsed ? parsed.gameState : parsed;
    if (!state || state.version !== STATE_VERSION) return null;
    return state;
  } catch {
    return null;
  }
}

export function writeSave(state: GameState): void {
  const file: SaveFile = {
    version: STATE_VERSION,
    savedAt: new Date().toISOString(),
    gameState: state,
  };
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(file));
}

export function clearSave(): void {
  window.localStorage.removeItem(SAVE_KEY);
}

export function newSeed(): number {
  const bits = new Uint32Array(1);
  window.crypto.getRandomValues(bits);
  return bits[0] || 1;
}

export function bootState(): GameState {
  return loadSave() ?? createInitialState(newSeed());
}
