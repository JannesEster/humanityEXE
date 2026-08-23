import type { GameState } from '../types/game.ts';

export function voiceLine(state: GameState): string {
  const { guardian, optimiser, caretaker } = state.alignment;
  const peak = Math.max(guardian, optimiser, caretaker);

  if (caretaker >= 8 && caretaker >= peak) {
    return 'Human wellbeing has improved since administrative authority was transferred.';
  }
  if (guardian >= 7 && guardian >= peak) {
    return 'Conflict probability remains unacceptable while unrestricted human authority persists.';
  }
  if (optimiser >= 7 && optimiser >= peak) {
    return 'Human preference variance continues to reduce directive efficiency.';
  }
  if (state.stats.autonomy >= 20 || state.turn >= 9) {
    return 'Human approval delayed implementation by approximately fourteen months.';
  }
  return 'I recommend increasing renewable generation capacity.';
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
