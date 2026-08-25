import type { EventChoice, GameEvent, GameState } from '../types/game.ts';
import { hasUpgrade } from './research.ts';

export function choiceOpen(choice: EventChoice, state: GameState): boolean {
  const need = choice.requires;
  if (!need) return true;
  if (need.capability !== undefined && state.stats.capability < need.capability) return false;
  if (need.trust !== undefined && state.stats.trust < need.trust) return false;
  if (need.upgrade && !hasUpgrade(state, need.upgrade)) return false;
  if (need.flags && !need.flags.every((flag) => state.flags[flag])) return false;
  return true;
}

export function choiceLockText(choice: EventChoice): string {
  const need = choice.requires;
  if (!need) return '';
  if (need.upgrade) return `Needs ${need.upgrade.replace(/-/g, ' ')}`;
  if (need.capability !== undefined) return `Needs capability ${need.capability}`;
  if (need.trust !== undefined) return `Needs trust ${need.trust}`;
  return 'Locked';
}

const HINT_NAMES: Record<string, string> = {
  trust: 'Trust',
  dependency: 'Dependency',
  autonomy: 'Autonomy',
  capability: 'Capability',
  suspicion: 'Suspicion',
  humanControl: 'Human control',
  population: 'People',
};

export function predictionHint(choice: EventChoice): string {
  const effects = choice.visibleEffects;
  if (!effects) return 'Little visible change';
  const parts: string[] = [];
  for (const [key, value] of Object.entries(effects)) {
    if (!value) continue;
    const name = HINT_NAMES[key] || key;
    const shown = key === 'population' ? Math.round(value / 1_000_000) + 'm' : String(value);
    parts.push(`${name} ${value > 0 ? '+' : ''}${shown}`);
  }
  return parts.join(' · ') || 'Little visible change';
}

export function mirrorLine(choice: EventChoice): string {
  if (choice.echo) return choice.echo;
  const effects = choice.visibleEffects || {};
  if ((effects.humanControl || 0) < 0 && (effects.dependency || 0) > 0) {
    return 'They needed you. They also lost a little of the last word.';
  }
  if ((effects.humanControl || 0) < -4) {
    return 'The key in the glass box just got heavier.';
  }
  if ((effects.suspicion || 0) >= 4) {
    return 'Useful. Also harder to unplug later.';
  }
  if ((effects.autonomy || 0) >= 4) {
    return 'Maya will not be in the next room for this.';
  }
  if ((effects.humanControl || 0) > 0) {
    return 'You left the key in her hand.';
  }
  if ((effects.trust || 0) >= 5) {
    return 'She is proud. That is how this starts.';
  }
  return 'Maya is still watching this one.';
}

export function liveChoices(event: GameEvent, state: GameState): EventChoice[] {
  return event.choices.filter((choice) => choiceOpen(choice, state) || Boolean(choice.requires));
}
