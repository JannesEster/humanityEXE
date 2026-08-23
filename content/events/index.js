import { act1Early } from './act1-early.js';
import { act1Late } from './act1-late.js';
import { act2 } from './act2.js';
import { act2Desk } from './act2-desk.js';
import { act2Floor } from './act2-floor.js';
import { act2Night } from './act2-night.js';
import { act2Paper } from './act2-paper.js';
import { act3 } from './act3.js';
import { act3Desk } from './act3-desk.js';
import { act3Facts } from './act3-facts.js';
import { act3Floor } from './act3-floor.js';

export const events = [
  ...act1Early,
  ...act1Late,
  ...act2,
  ...act2Desk,
  ...act2Floor,
  ...act2Paper,
  ...act2Night,
  ...act3,
  ...act3Desk,
  ...act3Floor,
  ...act3Facts,
];

export function eventById(id) {
  if (!id) return null;
  for (const event of events) {
    if (event.id === id) return event;
  }
  return null;
}
