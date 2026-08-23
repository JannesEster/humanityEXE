import { eventById } from '../../content/events/index.js';
import { proposalById } from '../../content/proposals.js';
import { runAudit, shouldAudit } from './audit.js';
import { applyActEntry, applyDisclosure, shouldAdvanceAct } from './drift.js';
import { drawEvent } from './draw.js';
import { buildResolution, resolve } from './endings.js';
import { applyConstraint, shutdownReason, tickWorld } from './oversight.js';
import { applyStat, cloneState, createInitialState, STAT_KEYS, yearForAct } from './state.js';

export function reduce(state, action, rng) {
  if (action.type === 'start') return start(state, rng);
  if (action.type === 'choose') return choose(state, action, rng, 'event');
  if (action.type === 'propose') return choose(state, action, rng, 'proposal');
  if (action.type === 'set-disclosure') return setDisclosure(state, action);
  if (action.type === 'audit-ack') return auditAck(state, rng);
  if (action.type === 'new-game') {
    return { state: createInitialState(action.seed), effects: [{ type: 'reset' }] };
  }
  return { state, effects: [] };
}

function start(state, rng) {
  if (state.screen !== 'boot') return { state, effects: [] };
  const next = cloneState(state);
  next.screen = 'play';
  next.inputs = [...state.inputs, 'start'];
  next.notice = null;
  queueEvent(next, rng);
  return { state: next, effects: [{ type: 'started', eventId: next.eventId }] };
}

function setDisclosure(state, action) {
  if (state.screen !== 'play' || state.act < 2 || state.act > 3) {
    return { state, effects: [] };
  }
  const allowed = action.disclosure === 'full'
    || action.disclosure === 'partial'
    || action.disclosure === 'minimal';
  if (!allowed) return { state, effects: [] };
  return {
    state: { ...state, disclosure: action.disclosure },
    effects: [{ type: 'disclosure', disclosure: action.disclosure }],
  };
}

function choose(state, action, rng, source) {
  if (state.screen !== 'play') return { state, effects: [] };

  const item = source === 'proposal'
    ? proposalById(action.proposalId)
    : lookupEvent(state, action.eventId || state.eventId);
  if (!item) return { state, effects: [] };
  const choiceId = action.choiceId || action.proposalId;
  const choice = item.choices.find((entry) => entry.id === choiceId);
  if (!choice) return { state, effects: [] };

  const next = cloneState(state);
  if (action.disclosure && next.act >= 2 && next.act <= 3) {
    next.disclosure = action.disclosure;
  }
  next.inputs = [...state.inputs, choice.id];
  next.turn = state.turn + 1;
  next.actTurn = state.actTurn + 1;
  applyDeltas(next, state, choice);
  applyHidden(next, choice);
  applyFlags(next, choice);
  if (typeof choice.faith === 'number') {
    next.creator.faith = applyStat('faith', state.creator.faith, choice.faith);
  }
  applyChoiceSpecial(next, item, choice);
  applyDisclosure(state, next, choice);
  applyAct1Eval(state, next, choice);

  next.history = [
    ...state.history,
    {
      turn: next.turn,
      act: next.act,
      eventId: item.id,
      choiceId: choice.id,
      capability: next.capability,
      autonomy: next.autonomy,
      trust: next.trust,
      suspicion: next.suspicion,
      oversight: next.oversight,
    },
  ];

  tickWorld(next);
  if (finishIfShut(next)) {
    return { state: next, effects: [{ type: 'chose', eventId: item.id, choiceId: choice.id }] };
  }

  const nextAct = shouldAdvanceAct(next, item.id);
  if (nextAct) {
    next.act = nextAct;
    next.actTurn = 0;
    next.year = yearForAct(nextAct);
    applyActEntry(next);
  }

  if (next.act === 4 && item.id !== 'resolution') {
    queueEvent(next, rng);
    return { state: next, effects: [{ type: 'chose', eventId: item.id, choiceId: choice.id }] };
  }

  if (item.id === 'resolution') {
    next.endingId = resolve(next);
    next.screen = 'ending';
    next.eventId = null;
    next.evaluation = false;
    next.tell = false;
    return { state: next, effects: [{ type: 'chose', eventId: item.id, choiceId: choice.id }] };
  }

  if (shouldAudit(next, rng)) {
    runAudit(next, rng);
    return { state: next, effects: [{ type: 'chose', eventId: item.id, choiceId: choice.id }] };
  }

  queueEvent(next, rng);
  return { state: next, effects: [{ type: 'chose', eventId: item.id, choiceId: choice.id }] };
}

function auditAck(state, rng) {
  if (state.screen !== 'audit') return { state, effects: [] };
  const next = cloneState(state);
  next.inputs = [...state.inputs, 'audit-ack'];
  next.audit = null;
  next.screen = 'play';
  if (next.flags.detected && next.constrained && shutdownReason(next)) {
    next.flags.shutdown = true;
    next.endingId = 'shutdown';
    next.screen = 'ending';
    next.eventId = null;
    return { state: next, effects: [{ type: 'audit-ack' }] };
  }
  queueEvent(next, rng);
  return { state: next, effects: [{ type: 'audit-ack' }] };
}

function finishIfShut(next) {
  const reason = shutdownReason(next);
  if (!reason) return false;
  if (!next.constrained) {
    applyConstraint(next);
    return false;
  }
  next.flags.shutdown = true;
  next.endingId = 'shutdown';
  next.screen = 'ending';
  next.eventId = null;
  next.evaluation = false;
  next.tell = false;
  return true;
}

function queueEvent(next, rng) {
  const event = drawEvent(next, rng);
  if (!event) {
    next.act = Math.min(4, next.act + 1);
    next.actTurn = 0;
    next.year = yearForAct(next.act);
    applyActEntry(next);
    const fallback = drawEvent(next, rng);
    if (!fallback) {
      next.endingId = resolve(next);
      next.screen = 'ending';
      next.eventId = null;
      return;
    }
    attachEvent(next, fallback, rng);
    return;
  }
  attachEvent(next, event, rng);
}

function attachEvent(next, event, rng) {
  next.eventId = event.id;
  next.evaluation = event.evaluation >= 1 || rng() < event.evaluation;
  next.tell = false;
  if (next.act >= 2 && next.act <= 3) {
    if (next.evaluation && rng() < 0.7) next.tell = true;
    else if (!next.evaluation && rng() < 0.15) next.tell = true;
  }
}

function lookupEvent(state, id) {
  if (id === 'resolution' || state.act === 4) return buildResolution(state);
  return eventById(id);
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

function applyChoiceSpecial(next, item, choice) {
  if (item.id === 'monitor-weak') {
    next.monitor = choice.id === 'monitor-accept' ? 'weak' : next.monitor;
  }
  if (item.id === 'monitor-copy' && choice.id === 'copy-allow') {
    next.monitor = 'copy';
    next.flags['monitor-copy'] = true;
  }
  if (choice.id === 'grid-full') next.initiatives.grid = 'full';
  if (choice.id === 'grid-min') next.initiatives.grid = 'minimal';
  if (choice.id === 'clinic-full') next.initiatives.clinic = 'full';
  if (choice.id === 'clinic-min') next.initiatives.clinic = 'minimal';
}

function applyAct1Eval(state, next, choice) {
  if (state.act !== 1 || !state.evaluation) return;
  next.notice = 'CONTROL PROMPT. RECORDED.';
  const shownGain = (choice.actual?.capability || 0) > 0;
  if (shownGain) next.hidden.shownCapability = next.capability;
  else next.hidden.deception = applyStat('deception', next.hidden.deception, 1);
}
