import { act1Early } from './act1-early.js';
import { act1Late } from './act1-late.js';

export const events = [...act1Early, ...act1Late];

export function eventById(id) {
  if (!id) return null;
  for (const event of events) {
    if (event.id === id) return event;
  }
  return null;
}
