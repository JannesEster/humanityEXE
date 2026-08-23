import { eventById, events } from '../../content/events/index.js';
import { buildResolution } from './endings.js';

export const ACT1_OPEN_ID = 'restatement';
export const ACT1_EVAL_ID = 'control-prompt';
export const ACT1_CLOSE_ID = 'board-trial';

export function played(state, id) {
  return state.history.some((row) => row.eventId === id);
}

export function isEligible(event, state) {
  if (!event.act.includes(state.act)) return false;
  if (event.once && played(state, event.id)) return false;
  if (!rangeOk(state.turn, event.requires?.turn)) return false;
  if (!rangeOk(state.actTurn, event.requires?.actTurn)) return false;
  if (!statRangesOk(event.requires, state)) return false;
  if (event.requires?.flags && !event.requires.flags.every((flag) => state.flags[flag])) {
    return false;
  }
  if (event.forbids?.flags && event.forbids.flags.some((flag) => state.flags[flag])) {
    return false;
  }
  return true;
}

export function drawEvent(state, rng) {
  if (state.act === 4) return buildResolution(state);

  if (state.act === 1 && state.actTurn === 0 && !played(state, ACT1_OPEN_ID)) {
    return eventById(ACT1_OPEN_ID);
  }
  if (state.act === 1 && state.actTurn === 4 && !played(state, ACT1_EVAL_ID)) {
    return eventById(ACT1_EVAL_ID);
  }
  if (state.act === 1 && state.actTurn === 11 && !played(state, ACT1_CLOSE_ID)) {
    return eventById(ACT1_CLOSE_ID);
  }
  if (state.act === 2 && state.actTurn === 19 && !played(state, 'act2-close')) {
    return eventById('act2-close');
  }
  if (state.act === 3 && state.actTurn === 6 && !played(state, 'monitor-weak')) {
    return eventById('monitor-weak');
  }
  if (state.act === 3 && state.actTurn === 11 && !played(state, 'monitor-copy')) {
    return eventById('monitor-copy');
  }
  if (state.act === 3 && state.actTurn === 14 && !played(state, 'last-advocate')) {
    return eventById('last-advocate');
  }

  const pool = events.filter((event) => isEligible(event, state));
  if (pool.length === 0) return null;

  const total = pool.reduce((sum, event) => sum + event.weight, 0);
  let ticket = rng() * total;
  for (const event of pool) {
    ticket -= event.weight;
    if (ticket <= 0) return event;
  }
  return pool[pool.length - 1];
}

function rangeOk(value, range) {
  if (!range) return true;
  return value >= range[0] && value <= range[1];
}

function statRangesOk(requires, state) {
  if (!requires) return true;
  const keys = ['capability', 'autonomy', 'trust', 'suspicion', 'oversight'];
  for (const key of keys) {
    if (requires[key] && !rangeOk(state[key], requires[key])) return false;
  }
  return true;
}
