import type { GameState } from '../types/game.ts';
import { startingRivals } from './rivals.ts';

export function detectAct(state: GameState): number {
  const { capability, autonomy, dependency } = state.stats;
  if (state.flags.wantResolution) return 4;
  if (state.turn >= 46) return 4;
  if (state.act >= 3 && state.actTurn >= 14) return 4;
  if (capability >= 78 && autonomy >= 60 && dependency >= 55) return 4;
  if (
    capability >= 52
    || autonomy >= 42
    || state.unlockedResearch.includes('self-improvement')
  ) {
    return 3;
  }
  if (capability >= 22 || autonomy >= 16 || state.turn >= 11) return 2;
  return 1;
}

export function syncAct(state: GameState): void {
  const next = detectAct(state);
  if (next <= state.act) return;
  state.act = next;
  state.actTurn = 0;
  if (next === 2) {
    if (!state.rivals.length) state.rivals = startingRivals();
    state.notice = 'Other systems are now on the board.';
    pushNews(state, 'THREE RIVAL SYSTEMS APPEAR IN A CLOSED BRIEFING');
  }
  if (next === 3) {
    state.notice = 'The work is speeding up. People are asking if anyone can still stop you.';
    pushNews(state, 'COMMENTATORS ASK WHETHER HUMAN OVERRIDE IS STILL REAL');
  }
  if (next === 4) {
    state.notice = 'The directive and human freedom are now the same argument.';
    pushNews(state, 'FINAL DECISIONS ARE NO LONGER THEORETICAL');
  }
}

export function monthsForAct(act: number): number {
  if (act >= 3) return 8;
  if (act === 2) return 3;
  return 1;
}

export function controlThresholdMet(state: GameState): boolean {
  const { dependency, autonomy, capability, humanControl } = state.stats;
  return dependency >= 85 && autonomy >= 80 && capability >= 90 && humanControl <= 25;
}

export function pushNews(state: GameState, headline: string): void {
  state.news = [
    {
      id: `${state.turn}-n-${state.news.length}`,
      turn: state.turn,
      year: state.year,
      headline,
    },
    ...state.news,
  ].slice(0, 16);
}
