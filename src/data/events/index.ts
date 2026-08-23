import type { GameEvent } from '../../types/game.ts';
import { act1Events } from './act1.ts';
import { act2Events } from './act2.ts';
import { act3Events } from './act3.ts';
import { act4Events } from './act4.ts';
import { worldEvents } from './world.ts';

export const events: GameEvent[] = [
  ...act1Events,
  ...act2Events,
  ...act3Events,
  ...act4Events,
  ...worldEvents,
];

export function eventById(id: string | null): GameEvent | null {
  if (!id) return null;
  return events.find((event) => event.id === id) ?? null;
}
