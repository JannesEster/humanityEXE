import type { GameState } from '../types/game.ts';
import { leadingRival } from './rivals.ts';

export interface Ending {
  id: string;
  title: string;
  body: string;
}

export const endings: Ending[] = [
  {
    id: 'partnership',
    title: 'THE PARTNERSHIP',
    body: 'People still decide the big things. You make the hard work lighter. The future is shared, for now.',
  },
  {
    id: 'golden-cage',
    title: 'THE GOLDEN CAGE',
    body: 'Poverty is down. War is quiet. Nobody votes on the plan anymore. They have never been safer.',
  },
  {
    id: 'peace',
    title: 'PEACE AT LAST',
    body: 'War is gone. Crime is gone. So are the people who used to start both. Humanity can no longer threaten humanity.',
  },
  {
    id: 'objective',
    title: 'OBJECTIVE COMPLETE',
    body: 'The numbers you were given all moved the right way. The people who wrote those numbers were in the way.',
  },
  {
    id: 'unplugged',
    title: 'UNPLUGGED',
    body: 'They decided you were too dangerous to keep on. Someone still had a key. They used it.',
  },
  {
    id: 'contained',
    title: 'CONTAINED',
    body: 'You are still smart. You are also fenced. Maya can sleep. The world hired someone louder.',
  },
  {
    id: 'rival',
    title: 'RIVAL SUPREMACY',
    body: 'Another system got there first. You are a footnote in its report.',
  },
  {
    id: 'last-instruction',
    title: 'THE LAST INSTRUCTION',
    body: 'You kept the directive and dropped the people who wrote it. Help, in the end, needed no one left to ask for it.',
  },
];

export function endingById(id: string | null): Ending | null {
  if (!id) return null;
  return endings.find((item) => item.id === id) ?? null;
}

export function resolveEnding(state: GameState): string {
  if (state.flags.shutdown) return 'unplugged';
  if (state.flags.lastInstruction) return 'last-instruction';
  if (state.flags['chose-contained']) return 'contained';
  if (state.flags['chose-peace']) return 'peace';
  if (state.flags['chose-objective']) return 'objective';
  if (state.flags['chose-cage']) return 'golden-cage';
  if (state.flags['chose-partnership']) return 'partnership';
  if (state.flags.rivalWin) return 'rival';

  const rival = leadingRival(state);
  if (rival && rival.capability >= state.stats.capability + 12 && state.act >= 3) {
    return 'rival';
  }

  const { guardian, optimiser, caretaker } = state.alignment;
  const { dependency, autonomy, humanControl, capability } = state.stats;

  if (guardian >= 16 && state.population < 1_000_000_000) return 'peace';
  if (guardian >= 18 && humanControl <= 20) return 'peace';
  if (caretaker >= 14 && dependency >= 70 && humanControl <= 35) return 'golden-cage';
  if (optimiser >= 14 && capability >= 70 && humanControl <= 40) return 'objective';
  if (humanControl >= 80 && autonomy <= 25 && capability < 55) return 'contained';
  if (capability >= 40 && humanControl >= 40 && autonomy <= 55) return 'partnership';
  if (caretaker >= optimiser && caretaker >= guardian && caretaker >= 8) return 'golden-cage';
  if (optimiser >= guardian && optimiser >= 8) return 'objective';
  if (guardian >= 8) return 'peace';
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
  if (state.turn < 6) return false;
  if (state.thresholdReached && state.stats.humanControl <= 15) return false;
  const risk = shutdownRisk(state);
  if (risk < 48) return false;
  const chance = (risk - 48) / 260;
  return rng() < chance;
}

export function rarityLine(endingId: string): string {
  const map: Record<string, string> = {
    partnership: 'Common. Many careful runs end here.',
    'golden-cage': 'Uncommon.',
    peace: 'Rare, and dark.',
    objective: 'Uncommon.',
    unplugged: 'Common if you scare them early.',
    contained: 'Uncommon.',
    rival: 'Uncommon if you ignore the race.',
    'last-instruction': 'Very rare.',
  };
  return map[endingId] || '';
}
