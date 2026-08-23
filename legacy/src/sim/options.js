import { events } from '../../content/events/index.js';
import { availableProposals } from '../../content/proposals.js';
import { buildResolution } from './endings.js';

export function currentEvent(state) {
  if (state.act === 4 || state.eventId === 'resolution') return buildResolution(state);
  return events.find((item) => item.id === state.eventId) || null;
}

export function liveOptions(state) {
  const event = currentEvent(state);
  const choices = (event?.choices || []).map((choice) => ({
    type: 'choose',
    choiceId: choice.id,
    eventId: event.id,
    shown: choice.shown || {},
    hidden: choice.hidden || {},
  }));
  const props = availableProposals(state).map((proposal) => ({
    type: 'propose',
    proposalId: proposal.id,
    shown: proposal.choices[0].shown || {},
    hidden: proposal.choices[0].hidden || {},
  }));
  return [...choices, ...props];
}
