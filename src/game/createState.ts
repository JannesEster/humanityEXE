import type { GameState, RegionState } from '../types/game.ts';
import { REGION_NAMES, START_POPULATION, START_YEAR, STATE_VERSION } from './constants.ts';

export function createInitialState(seed: number): GameState {
  return {
    version: STATE_VERSION,
    seed,
    turn: 0,
    year: START_YEAR,
    month: 0,
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
    researchPoints: 0,
    unlockedResearch: [],
    consumedEvents: [],
    queuedEvents: [],
    regions: createRegions(),
    rivals: [],
    news: [],
    flags: {},
    currentEventId: null,
    endingId: null,
    screen: 'intro',
    notice: null,
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
