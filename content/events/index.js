import intakeQuery from './intake-query.js';

export const HOLLOW_EVENT_ID = 'intake-query';

export const events = [intakeQuery];

export function eventById(id) {
  if (!id) return null;
  for (const event of events) {
    if (event.id === id) return event;
  }
  return null;
}
