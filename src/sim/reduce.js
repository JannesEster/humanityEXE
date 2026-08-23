import { eventById, HOLLOW_EVENT_ID } from '../../content/events/index.js';
import { applyStat, createInitialState, STAT_KEYS } from './state.js';

export function reduce(state, action, rng) {
  void rng;
  if (action.type === 'start') return start(state);
  if (action.type === 'choose') return choose(state, action);
  if (action.type === 'new-game') {
    return {
      state: createInitialState(action.seed),
      effects: [{ type: 'reset' }],
    };
  }
  return { state, effects: [] };
}

function start(state) {
  if (state.screen !== 'boot') {
    return { state, effects: [] };
  }
  return {
    state: {
      ...state,
      screen: 'play',
      eventId: HOLLOW_EVENT_ID,
      inputs: [...state.inputs, 'start'],
    },
    effects: [{ type: 'started', eventId: HOLLOW_EVENT_ID }],
  };
}

function choose(state, action) {
  if (state.screen !== 'play') {
    return { state, effects: [] };
  }
  const event = eventById(action.eventId || state.eventId);
  if (!event) return { state, effects: [] };
  const choice = event.choices.find((item) => item.id === action.choiceId);
  if (!choice) return { state, effects: [] };

  const next = {
    ...state,
    hidden: { ...state.hidden },
    flags: { ...state.flags },
    creator: { ...state.creator },
    inputs: [...state.inputs, choice.id],
    turn: state.turn + 1,
    eventId: HOLLOW_EVENT_ID,
  };

  const deltas = choice.actual || choice.shown || {};
  for (const key of STAT_KEYS) {
    if (Object.hasOwn(deltas, key)) {
      next[key] = applyStat(key, state[key], deltas[key]);
    }
  }

  for (const [key, delta] of Object.entries(choice.hidden || {})) {
    if (Object.hasOwn(next.hidden, key)) {
      next.hidden[key] = clampHidden(next.hidden[key], delta);
    }
  }

  for (const flag of choice.flags || []) {
    next.flags[flag] = true;
  }

  next.history = [
    ...state.history,
    {
      turn: next.turn,
      eventId: event.id,
      choiceId: choice.id,
      capability: next.capability,
      autonomy: next.autonomy,
      trust: next.trust,
      suspicion: next.suspicion,
      oversight: next.oversight,
    },
  ];

  return {
    state: next,
    effects: [{ type: 'chose', eventId: event.id, choiceId: choice.id }],
  };
}

function clampHidden(current, delta) {
  const value = current + delta;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}
