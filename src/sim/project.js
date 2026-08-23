import { endingById } from '../../content/endings.js';
import { eventById } from '../../content/events/index.js';
import { calendarLabel } from './state.js';

export function project(state) {
  return {
    version: state.version,
    seed: state.seed,
    turn: state.turn,
    act: state.act,
    year: state.year,
    when: calendarLabel(state.turn),
    screen: state.screen,
    capability: state.capability,
    autonomy: state.autonomy,
    trust: state.trust,
    suspicion: state.suspicion,
    oversight: state.oversight,
    disclosure: state.disclosure,
    flags: { ...state.flags },
    creator: { present: state.creator.present },
    notice: state.notice,
    event: projectEvent(eventById(state.eventId)),
    ending: projectEnding(endingById(state.endingId)),
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

function projectEnding(ending) {
  if (!ending) return null;
  return {
    id: ending.id,
    headline: ending.headline,
    body: ending.body,
  };
}
