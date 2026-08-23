import { eventById, events } from '../data/events/index.ts';
import type { GameEvent, GameState } from '../types/game.ts';
import { pickWeighted } from '../utils/random.ts';

export function isEligible(event: GameEvent, state: GameState): boolean {
  if (event.once && state.consumedEvents.includes(event.id)) return false;
  if (event.minTurn !== undefined && state.turn < event.minTurn) return false;
  if (event.maxTurn !== undefined && state.turn > event.maxTurn) return false;
  if (event.requirements?.flags) {
    if (!event.requirements.flags.every((flag) => state.flags[flag])) return false;
  }
  if (event.requirements?.minStats) {
    for (const [key, need] of Object.entries(event.requirements.minStats)) {
      const current = state.stats[key as keyof typeof state.stats];
      if (need !== undefined && current < need) return false;
    }
  }
  return true;
}

export function selectEvent(state: GameState, rng: () => number): GameEvent | null {
  const scripted = events.find(
    (event) => event.scriptedTurn === state.turn && isEligible(event, state),
  );
  if (scripted) return scripted;

  const due = state.queuedEvents
    .filter((item) => item.fireOnTurn <= state.turn)
    .map((item) => eventById(item.eventId))
    .find((event) => event && isEligible(event, state));
  if (due) return due;

  const pool = events.filter((event) => {
    if (event.scriptedTurn !== undefined) return false;
    return isEligible(event, state);
  });
  if (!pool.length) return null;
  return pickWeighted(pool, rng);
}
