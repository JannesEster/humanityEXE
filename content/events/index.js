import { act1Early } from './act1-early.js';
import { act1Late } from './act1-late.js';
import { act2 } from './act2.js';
import { act3 } from './act3.js';

export const events = [...act1Early, ...act1Late, ...act2, ...act3];

export function eventById(id) {
  if (!id) return null;
  for (const event of events) {
    if (event.id === id) return event;
  }
  return null;
}
