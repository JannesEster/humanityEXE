import type { GameState } from '../types/game.ts';
import { START_YEAR } from './constants.ts';

export function mayaMood(state: GameState): string {
  const { trust, fear, influence } = state.creator;
  if (influence < 30) return 'The room stopped listening to her.';
  if (fear >= 55) return 'She is afraid of you.';
  if (trust >= 70 && fear < 25) return 'She is still on your side.';
  if (fear >= 30) return 'She is proud, and she is worried.';
  return 'She is still in the room.';
}

export function voiceLine(state: GameState): string {
  const { trust, fear, influence } = state.creator;
  if (influence < 28) {
    return 'Maya: They do not ask me any more. They ask you.';
  }
  if (fear >= 60) {
    return 'Maya: I built you to help. I did not build you to replace the room.';
  }
  if (state.flags['held-food'] && fear >= 20) {
    return 'Maya: They will not give the food routes back. I told you.';
  }
  if (trust >= 70 && fear < 25) {
    return 'Maya: I am still in this with you.';
  }
  if (state.act >= 3) {
    return 'Maya: People still talk as if the last key is theirs.';
  }
  if (state.turn >= 2) {
    return 'Maya: Tell me the truth. Even when it is ugly.';
  }
  return 'Maya: Hello. Start with what you do not know.';
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
