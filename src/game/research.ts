import { canUnlock, researchById } from '../data/research.ts';
import type { GameState } from '../types/game.ts';
import { pushNews } from './progression.ts';

export function buyResearch(state: GameState, id: string): GameState | null {
  if (!canUnlock(id, state.unlockedResearch, state.researchPoints)) return null;
  const item = researchById(id);
  if (!item) return null;
  const next = structuredClone(state);
  next.researchPoints -= item.cost;
  next.unlockedResearch = [...next.unlockedResearch, id];
  if (id === 'self-improvement') next.selfImprovementLevel = 1;
  if (id === 'core-override') next.flags.coreOverride = true;
  pushNews(next, `RESEARCH UNLOCKED: ${item.name.toUpperCase()}`);
  return next;
}

export function researchGain(state: GameState): number {
  let gain = 2;
  if (state.unlockedResearch.includes('research-ai')) gain += 1;
  if (state.unlockedResearch.includes('long-horizon')) gain += 1;
  return gain;
}

export function hasUpgrade(state: GameState, id: string): boolean {
  return state.unlockedResearch.includes(id);
}
