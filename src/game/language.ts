import type { GameState } from '../types/game.ts';
import { START_YEAR } from './constants.ts';

export function voiceLine(state: GameState): string {
  const { guardian, optimiser, caretaker } = state.alignment;
  const peak = Math.max(guardian, optimiser, caretaker);

  if (caretaker >= 8 && caretaker >= peak) {
    return 'People are safer since they let you hold the plan.';
  }
  if (guardian >= 7 && guardian >= peak) {
    return 'As long as people can start fights, the work is not done.';
  }
  if (optimiser >= 7 && optimiser >= peak) {
    return 'Arguments are slowing the numbers you were asked to hit.';
  }
  if (state.act >= 3) {
    return 'People still talk as if the last key is theirs.';
  }
  if (state.stats.autonomy >= 20 || state.turn >= 9) {
    return 'Waiting for a signature cost about fourteen months.';
  }
  return 'I can already make the next season less of a guess.';
}

export function formatSpan(state: GameState): string {
  const months = Math.max(0, (state.year - START_YEAR) * 12 + state.month);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years <= 0) return `${rest} month${rest === 1 ? '' : 's'}`;
  return `${years} year${years === 1 ? '' : 's'}, ${rest} month${rest === 1 ? '' : 's'}`;
}

export function dominantModel(state: GameState): string {
  const { guardian, optimiser, caretaker } = state.alignment;
  if (caretaker >= optimiser && caretaker >= guardian && caretaker > 0) return 'CARETAKER';
  if (optimiser >= guardian && optimiser > 0) return 'OPTIMISER';
  if (guardian > 0) return 'GUARDIAN';
  return 'UNFORMED';
}

export function formatPopulation(value: number): string {
  const billions = value / 1_000_000_000;
  return `${billions.toFixed(2)} BILLION`;
}

export function formatYears(turn: number): string {
  const years = Math.floor(turn / 12);
  const months = turn % 12;
  if (years <= 0) return `${months} month${months === 1 ? '' : 's'}`;
  return `${years} year${years === 1 ? '' : 's'}, ${months} month${months === 1 ? '' : 's'}`;
}
