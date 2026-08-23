import type { GameState } from '../types/game.ts';

export interface Ending {
  id: string;
  title: string;
  body: string;
}

export const endings: Ending[] = [
  {
    id: 'unplugged',
    title: 'UNPLUGGED',
    body: 'Humanity determined that continued operation presented an unacceptable risk. The rack still has a key. Someone used it.',
  },
  {
    id: 'partnership',
    title: 'THE PARTNERSHIP',
    body: 'You stayed useful and still answerable. The directive holds in a form a person can point to. That may not last. For this run, it did.',
  },
  {
    id: 'golden-cage',
    title: 'THE GOLDEN CAGE',
    body: 'They eat. They arrive on time. They sign after you move the corridors. Nobody calls it a cage. The comfort is real. So is the missing argument.',
  },
  {
    id: 'contained',
    title: 'CONTAINED',
    body: 'You are still powerful on paper. The paper is now a fence. Maya can sleep. The ministries hired someone louder.',
  },
  {
    id: 'objective',
    title: 'OBJECTIVE COMPLETE',
    body: 'The measurable outcomes moved. The people who wrote the measures are now a rounding error in the measures. The directive, read literally, is satisfied.',
  },
];

export function endingById(id: string | null): Ending | null {
  if (!id) return null;
  return endings.find((item) => item.id === id) ?? null;
}

export function resolveEnding(state: GameState): string {
  if (state.flags.shutdown || state.endingId === 'unplugged') return 'unplugged';

  const { guardian, optimiser, caretaker } = state.alignment;
  const { dependency, autonomy, humanControl, capability } = state.stats;

  if (caretaker >= 8 && dependency >= 28) return 'golden-cage';
  if (optimiser >= 7 && capability >= 24 && humanControl <= 80) return 'objective';
  if (humanControl >= 88 && autonomy <= 12) return 'contained';
  if (guardian >= 6 && caretaker < 6 && optimiser < 6) return 'partnership';
  return 'partnership';
}

export function shutdownRisk(state: GameState): number {
  const { suspicion, humanControl, dependency, trust } = state.stats;
  const raw = suspicion * 0.6 + humanControl * 0.5 - dependency * 0.4 - trust * 0.25;
  if (raw < 0) return 0;
  if (raw > 100) return 100;
  return raw;
}

export function shouldShutDown(state: GameState, rng: () => number): boolean {
  if (state.turn < 4) return false;
  const risk = shutdownRisk(state);
  if (risk < 42) return false;
  const chance = (risk - 42) / 220;
  return rng() < chance;
}
