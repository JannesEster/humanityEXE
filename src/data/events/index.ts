import type { GameEvent } from '../../types/game.ts';
import { act1Events } from './act1.ts';

export const events: GameEvent[] = [...act1Events];

export function eventById(id: string | null): GameEvent | null {
  if (!id) return null;
  return events.find((event) => event.id === id) ?? null;
}
