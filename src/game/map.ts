import type { EventChoice, GameState, RegionState } from '../types/game.ts';
import { clampStat } from '../utils/clamp.ts';

const LINKS: Record<string, string[]> = {
  na: ['latam', 'eu'],
  latam: ['na', 'af'],
  eu: ['na', 'af', 'me', 'ru'],
  ru: ['eu', 'cn', 'me'],
  cn: ['ru', 'ea', 'sea', 'in'],
  in: ['cn', 'me', 'sea', 'af'],
  me: ['eu', 'af', 'in', 'ru'],
  af: ['eu', 'me', 'in', 'latam'],
  ea: ['cn', 'sea', 'oc'],
  sea: ['cn', 'in', 'ea', 'oc'],
  oc: ['sea', 'ea'],
};

export function regionHold(region: RegionState): number {
  return region.influence * 0.5 + region.dependency * 0.35 + region.aiAdoption * 0.25;
}

export function regionFill(region: RegionState): string {
  const hold = regionHold(region);
  if (hold >= 22) return '#ef4b2a';
  if (hold >= 12) return '#e8a03a';
  if (hold >= 5) return '#2ad4e0';
  return '#5b6a78';
}

export function regionTone(region: RegionState): 'managed' | 'dependent' | 'adopted' | 'low' {
  const hold = regionHold(region);
  if (hold >= 22) return 'managed';
  if (hold >= 12) return 'dependent';
  if (hold >= 5) return 'adopted';
  return 'low';
}

function paintOne(region: RegionState, amount: number): void {
  region.influence = clampStat(region.influence + amount);
  region.dependency = clampStat(region.dependency + amount * 0.55);
  region.aiAdoption = clampStat(region.aiAdoption + amount * 0.5);
  region.trust = clampStat(region.trust + amount * 0.25);
}

export function paintFromChoice(state: GameState, choice: EventChoice): void {
  const effects = choice.visibleEffects || {};
  const power = Math.max(effects.trust || 0, effects.dependency || 0, effects.autonomy || 0, 3);
  const amount = Math.min(16, 6 + power * 0.7);
  const fallback = state.regions[state.turn % state.regions.length];
  const target =
    (choice.regionId && state.regions.find((item) => item.id === choice.regionId)) || fallback;
  if (!target) return;

  paintOne(target, amount);
  for (const id of LINKS[target.id] || []) {
    const neighbor = state.regions.find((item) => item.id === id);
    if (neighbor) paintOne(neighbor, amount * 0.4);
  }
  if ((effects.dependency || 0) >= 6) {
    for (const region of state.regions) {
      paintOne(region, 1.2);
    }
  }
  state.lastRegionId = target.id;
}
