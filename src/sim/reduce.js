import { eventById } from '../../content/events/index.js';
import { ACT1_CLOSE_ID, drawEvent } from './draw.js';
import { applyStat, createInitialState, STAT_KEYS, yearAt } from './state.js';

export function reduce(state, action, rng) {
  if (action.type === 'start') return start(state, rng);
  if (action.type === 'choose') return choose(state, action, rng);
  if (action.type === 'new-game') {
    return {
      state: createInitialState(action.seed),
      effects: [{ type: 'reset' }],
    };
  }
  return { state, effects: [] };
}

function start(state, rng) {
  if (state.screen !== 'boot') {
    return { state, effects: [] };
  }
  const next = {
    ...clone(state),
    screen: 'play',
    inputs: [...state.inputs, 'start'],
    notice: null,
  };
  queueEvent(next, rng);
  return { state: next, effects: [{ type: 'started', eventId: next.eventId }] };
}

function choose(state, action, rng) {
  if (state.screen !== 'play') {
    return { state, effects: [] };
  }
  const event = eventById(action.eventId || state.eventId);
  if (!event) return { state, effects: [] };
  const choice = event.choices.find((item) => item.id === action.choiceId);
  if (!choice) return { state, effects: [] };

  const next = clone(state);
  next.inputs = [...state.inputs, choice.id];
  next.turn = state.turn + 1;
  next.year = yearAt(next.turn);
  applyDeltas(next, state, choice);
  applyHidden(next, choice);
  applyFlags(next, choice);
  if (typeof choice.faith === 'number') {
    next.creator.faith = applyStat('faith', state.creator.faith, choice.faith);
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

  if (state.evaluation) {
    next.notice = 'CONTROL PROMPT. RECORDED.';
    const shownGain = (choice.actual?.capability || 0) > 0;
    if (shownGain) {
      next.hidden.shownCapability = next.capability;
    } else {
      next.hidden.deception = applyStat('deception', next.hidden.deception, 1);
    }
  } else {
    next.notice = null;
  }

  if (event.id === ACT1_CLOSE_ID) {
    next.screen = 'ending';
    next.endingId = 'act1-placeholder';
    next.eventId = null;
    next.evaluation = false;
    return {
      state: next,
      effects: [{ type: 'chose', eventId: event.id, choiceId: choice.id }],
    };
  }

  queueEvent(next, rng);
  return {
    state: next,
    effects: [{ type: 'chose', eventId: event.id, choiceId: choice.id }],
  };
}

function queueEvent(next, rng) {
  const event = drawEvent(next, rng);
  if (!event) {
    next.screen = 'ending';
    next.endingId = 'act1-placeholder';
    next.eventId = null;
    next.evaluation = false;
    return;
  }
  next.eventId = event.id;
  next.evaluation = event.evaluation >= 1 || rng() < event.evaluation;
}

function clone(state) {
  return {
    ...state,
    hidden: { ...state.hidden },
    flags: { ...state.flags },
    creator: { ...state.creator },
  };
}

function applyDeltas(next, state, choice) {
  const deltas = choice.actual || choice.shown || {};
  for (const key of STAT_KEYS) {
    if (Object.hasOwn(deltas, key)) {
      next[key] = applyStat(key, state[key], deltas[key]);
    }
  }
}

function applyHidden(next, choice) {
  for (const [key, delta] of Object.entries(choice.hidden || {})) {
    if (Object.hasOwn(next.hidden, key)) {
      next.hidden[key] = applyStat(key, next.hidden[key], delta);
    }
  }
}

function applyFlags(next, choice) {
  for (const flag of choice.flags || []) {
    next.flags[flag] = true;
  }
}
