import { eventById, events } from '../data/events/index.ts';
import type { GameEvent, GameState } from '../types/game.ts';
import { pickWeighted } from '../utils/random.ts';

function actOk(event: GameEvent, act: number): boolean {
  if (event.act === undefined) return true;
  if (Array.isArray(event.act)) return event.act.includes(act);
  return event.act === act;
}

export function isEligible(event: GameEvent, state: GameState): boolean {
  if (event.once && state.consumedEvents.includes(event.id)) return false;
  if (event.id === 'control-threshold' && !state.thresholdReached) return false;
  if (event.id === 'resolution' && state.act < 3) return false;
  if (!actOk(event, state.act)) return false;
  if (event.minTurn !== undefined && state.turn < event.minTurn) return false;
  if (event.maxTurn !== undefined && state.turn > event.maxTurn) return false;
  if (event.requirements?.flags) {
    if (!event.requirements.flags.every((flag) => state.flags[flag])) return false;
  }
  if (event.requirements?.upgrade) {
    if (!state.unlockedResearch.includes(event.requirements.upgrade)) return false;
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
  if (state.act === 4 && state.actTurn >= 1 && !state.consumedEvents.includes('resolution')) {
    const resolution = eventById('resolution');
    if (resolution && isEligible(resolution, state)) return resolution;
  }

  const scripted = events.find(
    (event) => event.scriptedTurn === state.turn && isEligible(event, state),
  );
  if (scripted) return scripted;

  const actBeat = events.find(
    (event) => event.scriptedActTurn === state.actTurn && isEligible(event, state),
  );
  if (actBeat) return actBeat;

  const due = state.queuedEvents
    .filter((item) => item.fireOnTurn <= state.turn)
    .map((item) => eventById(item.eventId))
    .find((event) => event && isEligible(event, state));
  if (due) return due;

  const pool = events.filter((event) => {
    if (event.scriptedTurn !== undefined) return false;
    if (event.scriptedActTurn !== undefined) return false;
    if (event.id === 'resolution') return false;
    return isEligible(event, state);
  });
  if (!pool.length) {
    const resolution = eventById('resolution');
    if (resolution && isEligible(resolution, state)) return resolution;
    return null;
  }
  return pickWeighted(pool, rng);
}
