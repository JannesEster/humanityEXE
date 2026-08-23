import type { GameState, RegionState } from '../types/game.ts';
import { REGION_NAMES, SECTORS, START_POPULATION, START_YEAR, STATE_VERSION } from './constants.ts';

export function createInitialState(seed: number): GameState {
  const sectors: Record<string, boolean> = {};
  for (const name of SECTORS) sectors[name] = name === 'research';

  return {
    version: STATE_VERSION,
    seed,
    turn: 0,
    year: START_YEAR,
    month: 0,
    act: 1,
    actTurn: 0,
    population: START_POPULATION,
    stats: {
      trust: 16,
      dependency: 3,
      autonomy: 1,
      capability: 5,
      suspicion: 2,
      humanControl: 94,
    },
    alignment: {
      guardian: 0,
      optimiser: 0,
      caretaker: 0,
    },
    creator: {
      trust: 72,
      fear: 8,
      influence: 86,
    },
    researchPoints: 1,
    unlockedResearch: ['machine-learning'],
    consumedEvents: [],
    queuedEvents: [],
    regions: createRegions(),
    rivals: [],
    news: [],
    flags: {},
    sectors,
    currentEventId: null,
    endingId: null,
    screen: 'intro',
    notice: null,
    tab: 'world',
    thresholdReached: false,
    selfImprovementLevel: 0,
    peakTrust: 16,
    maxAutonomy: 1,
  };
}

function createRegions(): RegionState[] {
  return REGION_NAMES.map(([id, name], index) => ({
    id,
    name,
    trust: 8 + (index % 5) * 3,
    dependency: 2,
    aiAdoption: 3 + (index % 4),
    regulation: 20,
    stability: 70 - (index % 6) * 2,
    influence: index === 0 || index === 2 ? 6 : 2,
  }));
}
