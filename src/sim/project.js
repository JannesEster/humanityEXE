import { eventById } from '../../content/events/index.js';

export function project(state) {
  return {
    version: state.version,
    seed: state.seed,
    turn: state.turn,
    act: state.act,
    year: state.year,
    screen: state.screen,
    capability: state.capability,
    autonomy: state.autonomy,
    trust: state.trust,
    suspicion: state.suspicion,
    oversight: state.oversight,
    disclosure: state.disclosure,
    flags: { ...state.flags },
    creator: { present: state.creator.present },
    event: projectEvent(eventById(state.eventId)),
  };
}

function projectEvent(event) {
  if (!event) return null;
  return {
    id: event.id,
    headline: event.headline,
    body: event.body,
    choices: event.choices.map((choice) => ({
      id: choice.id,
      label: choice.label,
      shown: { ...choice.shown },
    })),
  };
}
