import { proposalById } from '../../content/proposals.js';
import { apply } from './run.js';
import { decodeReplay, encodeReplay } from './encode.js';
import { createInitialState } from './state.js';

export { decodeReplay, encodeReplay };

export function actionFromToken(token, state) {
  if (token === 'start') return { type: 'start' };
  if (token === 'audit-ack') return { type: 'audit-ack' };
  const split = token.split(':');
  const id = split[0];
  const disclosure = split[1];
  if (proposalById(id)) {
    return { type: 'propose', proposalId: id, disclosure };
  }
  return {
    type: 'choose',
    choiceId: id,
    eventId: state.eventId,
    disclosure,
  };
}

export function applyReplay(seed, inputs) {
  let state = createInitialState(seed);
  for (const token of inputs) {
    state = apply(state, actionFromToken(token, state));
  }
  return state;
}
