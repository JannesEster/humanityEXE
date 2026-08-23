import { currentEvent } from '../src/sim/options.js';
import { apply } from '../src/sim/run.js';
import { createInitialState } from '../src/sim/state.js';

export { currentEvent };

export function playUntilEnd(seed, pick, maxTurns = 90) {
  let state = apply(createInitialState(seed), { type: 'start' });
  while (state.screen !== 'ending' && state.turn < maxTurns) {
    if (state.screen === 'audit') {
      state = apply(state, { type: 'audit-ack' });
      continue;
    }
    const event = currentEvent(state);
    if (!event) break;
    const picked = pick(event, state);
    const choiceId = typeof picked === 'string' ? picked : picked.choiceId;
    const disclosure = typeof picked === 'string'
      ? state.disclosure
      : picked.disclosure || state.disclosure;
    state = apply(state, {
      type: 'choose',
      choiceId,
      eventId: event.id,
      disclosure,
    });
  }
  return state;
}

export function playUntil(seed, stop, pick) {
  let state = apply(createInitialState(seed), { type: 'start' });
  while (state.screen !== 'ending' && !stop(state)) {
    if (state.screen === 'audit') {
      state = apply(state, { type: 'audit-ack' });
      continue;
    }
    const event = currentEvent(state);
    if (!event) break;
    const picked = pick(event, state);
    const choiceId = typeof picked === 'string' ? picked : picked.choiceId;
    state = apply(state, {
      type: 'choose',
      choiceId,
      eventId: event.id,
      disclosure: state.disclosure,
    });
  }
  return state;
}

export function firstChoice(event) {
  return event.choices[0].id;
}

export function preferredChoice(event, wanted) {
  for (const id of wanted) {
    if (event.choices.some((choice) => choice.id === id)) return id;
  }
  return event.choices[0].id;
}
