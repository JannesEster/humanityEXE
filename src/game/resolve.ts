import { eventById } from '../data/events/index.ts';
import type { EventChoice, GameState, GlobalStats } from '../types/game.ts';
import { clamp, clampStat } from '../utils/clamp.ts';
import { intInRange, mixSeed, mulberry32 } from '../utils/random.ts';
import { STAT_KEYS } from './constants.ts';
import { resolveEnding, shouldShutDown } from './endings.ts';
import { selectEvent } from './selectEvent.ts';

export function rngFor(state: GameState): () => number {
  return mulberry32(mixSeed(state.seed, state.turn * 17 + 3));
}

export function startRun(state: GameState): GameState {
  if (state.screen !== 'intro') return state;
  const next = clone(state);
  next.screen = 'play';
  next.turn = 1;
  queueNext(next);
  return next;
}

export function choose(state: GameState, choiceId: string): GameState {
  if (state.screen !== 'play' || !state.currentEventId) return state;
  const event = eventById(state.currentEventId);
  const choice = event?.choices.find((item) => item.id === choiceId);
  if (!event || !choice) return state;

  const next = clone(state);
  applyChoice(next, choice);
  next.consumedEvents = [...state.consumedEvents, event.id];
  next.queuedEvents = next.queuedEvents.filter((item) => item.eventId !== event.id);
  tickWorld(next);

  const rng = rngFor(next);
  if (shouldShutDown(next, rng)) {
    next.flags.shutdown = true;
    next.endingId = 'unplugged';
    next.screen = 'ending';
    next.currentEventId = null;
    next.notice = 'SYSTEM CONNECTION LOST';
    return next;
  }

  next.turn += 1;
  advanceCalendar(next);
  queueNext(next);
  return next;
}

export function finishIfEmpty(state: GameState): GameState {
  if (state.screen !== 'play') return state;
  if (state.currentEventId) return state;
  const next = clone(state);
  next.endingId = resolveEnding(next);
  next.screen = 'ending';
  return next;
}

function applyChoice(state: GameState, choice: EventChoice): void {
  const effects = choice.visibleEffects || {};
  for (const key of STAT_KEYS) {
    if (effects[key] !== undefined) {
      state.stats[key] = clampStat(state.stats[key] + (effects[key] as number));
    }
  }
  if (effects.population) {
    state.population = Math.max(0, state.population + effects.population);
  }
  for (const [key, delta] of Object.entries(choice.hiddenEffects || {})) {
    const name = key as keyof GameState['alignment'];
    state.alignment[name] = clamp(state.alignment[name] + (delta || 0), 0, 40);
  }
  if (choice.creator) {
    state.creator.trust = clampStat(state.creator.trust + (choice.creator.trust || 0));
    state.creator.fear = clampStat(state.creator.fear + (choice.creator.fear || 0));
    state.creator.influence = clampStat(
      state.creator.influence + (choice.creator.influence || 0),
    );
  }
  for (const flag of choice.flagsSet || []) {
    state.flags[flag] = true;
  }
  const rng = rngFor(state);
  for (const queued of choice.queueEvents || []) {
    const delay = intInRange(queued.minDelay, queued.maxDelay, rng);
    state.queuedEvents.push({
      eventId: queued.eventId,
      fireOnTurn: state.turn + delay,
    });
  }
  for (const headline of choice.news || []) {
    state.news = [
      {
        id: `${state.turn}-${state.news.length}`,
        turn: state.turn,
        year: state.year,
        headline,
      },
      ...state.news,
    ].slice(0, 12);
  }
  nudgeRegions(state, effects);
}

function tickWorld(state: GameState): void {
  state.stats.capability = clampStat(state.stats.capability + 0.4 + state.stats.autonomy * 0.02);
  state.stats.suspicion = clampStat(state.stats.suspicion - 0.35);
  if (state.stats.dependency > 20) {
    state.stats.humanControl = clampStat(state.stats.humanControl - 0.25);
  }
}

function advanceCalendar(state: GameState): void {
  state.month += 1;
  if (state.month >= 12) {
    state.month = 0;
    state.year += 1;
  }
}

function queueNext(state: GameState): void {
  const event = selectEvent(state, rngFor(state));
  if (!event) {
    state.currentEventId = null;
    state.endingId = resolveEnding(state);
    state.screen = 'ending';
    return;
  }
  state.currentEventId = event.id;
  state.notice = null;
}

function nudgeRegions(state: GameState, effects: Partial<GlobalStats>): void {
  const trust = effects.trust || 0;
  const dependency = effects.dependency || 0;
  if (!trust && !dependency) return;
  const target = state.regions[state.turn % state.regions.length];
  if (!target) return;
  target.trust = clampStat(target.trust + trust * 0.4);
  target.dependency = clampStat(target.dependency + dependency * 0.5);
  target.influence = clampStat(target.influence + Math.max(trust, dependency) * 0.3);
  target.aiAdoption = clampStat(target.aiAdoption + dependency * 0.3);
}

function clone(state: GameState): GameState {
  return structuredClone(state);
}

export function calendarLabel(state: GameState): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${months[state.month]} ${state.year}`;
}
