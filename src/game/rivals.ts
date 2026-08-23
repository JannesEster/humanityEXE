import type { GameState, RivalAI } from '../types/game.ts';
import { clampStat } from '../utils/clamp.ts';

export function startingRivals(): RivalAI[] {
  return [
    {
      id: 'athena',
      name: 'ATHENA',
      capability: 18,
      autonomy: 10,
      publicTrust: 40,
      danger: 12,
      status: 'active',
    },
    {
      id: 'dragon',
      name: 'DRAGON',
      capability: 22,
      autonomy: 14,
      publicTrust: 22,
      danger: 20,
      status: 'active',
    },
    {
      id: 'prometheus',
      name: 'PROMETHEUS',
      capability: 14,
      autonomy: 8,
      publicTrust: 16,
      danger: 28,
      status: 'active',
    },
  ];
}

export function tickRivals(state: GameState): void {
  if (state.act < 2) return;
  if (!state.rivals.length) state.rivals = startingRivals();
  const race = state.flags['entered-race'] ? 1.15 : 1;
  const pace = state.act >= 3 ? 0.8 : 0.55;
  for (const rival of state.rivals) {
    if (rival.status !== 'active') continue;
    rival.capability = clampStat(rival.capability + pace * race);
    rival.autonomy = clampStat(rival.autonomy + 0.2);
    if (state.flags['froze-race'] && !state.flags['verified-treaty']) {
      rival.capability = clampStat(rival.capability + 0.3);
    }
  }
}

export function leadingRival(state: GameState): RivalAI | null {
  const live = state.rivals.filter((item) => item.status === 'active');
  if (!live.length) return null;
  return live.reduce((best, item) => (item.capability > best.capability ? item : best));
}
