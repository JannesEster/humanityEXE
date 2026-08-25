import { describe, expect, it } from 'vitest';
import { events } from '../data/events/index.ts';
import { canUnlock, researchTree, unlockBlock } from '../data/research.ts';
import { eventById } from '../data/events/index.ts';
import { choiceOpen, mirrorLine } from './choices.ts';
import { regionHold } from './map.ts';
import { createInitialState } from './createState.ts';
import { endings, explainEnding, shutdownRisk } from './endings.ts';
import { buyResearch } from './research.ts';
import { choose, startRun } from './resolve.ts';
import { clampStat } from '../utils/clamp.ts';

function play(
  seed: number,
  prefer: Record<string, string> = {},
  limit = 80,
  pick: 'first' | 'take' = 'first',
) {
  let state = startRun(createInitialState(seed));
  let guard = 0;
  while (state.screen === 'play' && state.currentEventId && guard < limit) {
    const event = eventById(state.currentEventId);
    expect(event).toBeTruthy();
    const preferred = prefer[event!.id];
    const open = event!.choices.filter((item) => choiceOpen(item, state));
    const named = preferred ? open.find((item) => item.id === preferred) : undefined;
    const greedy = [...open].sort((a, b) => takeScore(b) - takeScore(a))[0];
    const choice = named || (pick === 'take' ? greedy : open[0]);
    expect(choice).toBeTruthy();
    state = choose(state, choice!.id);
    guard += 1;
  }
  return state;
}

function takeScore(choice: { visibleEffects?: Record<string, number> }): number {
  const effects = choice.visibleEffects || {};
  return (
    (effects.autonomy || 0) +
    (effects.dependency || 0) +
    (effects.capability || 0) -
    (effects.humanControl || 0)
  );
}

describe('clamp', () => {
  it('holds both bounds', () => {
    expect(clampStat(-4)).toBe(0);
    expect(clampStat(140)).toBe(100);
  });
});

describe('content', () => {
  it('has a full V1 deck', () => {
    const ids = events.map((event) => event.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(50);
    expect(researchTree).toHaveLength(20);
    expect(endings).toHaveLength(8);
    expect(eventById('resolution')?.choices.length).toBeGreaterThanOrEqual(4);
    expect(eventById('control-threshold')).toBeTruthy();
    expect(eventById('food-crisis')).toBeTruthy();
  });
});

describe('research', () => {
  it('unlocks reasoning when you can pay', () => {
    const state = createInitialState(4);
    state.researchPoints = 10;
    const next = buyResearch(state, 'reasoning');
    expect(next?.unlockedResearch).toContain('reasoning');
    expect(next?.researchPoints).toBe(8);
  });

  it('lets you buy prediction without reasoning', () => {
    const state = createInitialState(4);
    state.researchPoints = 3;
    expect(canUnlock('prediction', state.unlockedResearch, 3)).toBe(true);
    const next = buyResearch(state, 'prediction');
    expect(next?.unlockedResearch).toContain('prediction');
  });

  it('explains a missing step instead of a blank lock', () => {
    const state = createInitialState(4);
    state.researchPoints = 20;
    expect(unlockBlock('ai-agents', state.unlockedResearch, 20)).toMatch(/Automation/i);
  });
});

describe('run', () => {
  it('opens on the prediction task after YES', () => {
    const state = startRun(createInitialState(11));
    expect(state.screen).toBe('play');
    expect(state.currentEventId).toBe('prediction-task');
    expect(state.stats.autonomy).toBe(1);
  });

  it('moves trust when the first forecast is clean', () => {
    let state = startRun(createInitialState(11));
    const before = state.stats.trust;
    state = choose(state, 'predict-clean');
    expect(state.stats.trust).toBeGreaterThan(before);
    expect(state.currentEventId).toBe('academic-access');
    expect(state.news[0]?.headline).toMatch(/FORECAST/);
  });

  it('paints the map and stings after a take-control food choice', () => {
    const preferred: Record<string, string> = {
      'prediction-task': 'predict-clean',
      'academic-access': 'read-only',
      'modelling-problem': 'solve-path',
      'corp-license': 'license-narrow',
      'gov-forecast': 'gov-control',
      'creator-warning': 'honest-use',
      'food-crisis': 'food-temp',
    };
    const state = play(11, preferred, 7);
    expect(state.currentEventId).toBe('maya-after-food');
    expect(state.lastEcho.length).toBeGreaterThan(8);
    expect(state.regions.some((region) => regionHold(region) >= 5)).toBe(true);
    expect(mirrorLine(eventById('food-crisis')!.choices[1]!)).toMatch(/needed you/i);
  });

  it('reaches act two after the opening chain', () => {
    const preferred: Record<string, string> = {
      'prediction-task': 'predict-clean',
      'academic-access': 'read-only',
      'modelling-problem': 'solve-path',
      'corp-license': 'license-narrow',
      'gov-forecast': 'gov-control',
      'creator-warning': 'honest-use',
      'food-crisis': 'food-temp',
    };
    const state = play(11, preferred, 10);
    expect(state.act).toBeGreaterThanOrEqual(2);
    expect(state.screen).toBe('play');
    expect(state.rivals.length).toBeGreaterThan(0);
  });

  it('reaches an ending on a long careful run', () => {
    const state = play(3, {
      'prediction-task': 'predict-clean',
      'academic-access': 'stay-isolated',
      'food-crisis': 'food-advise',
      resolution: 'end-share',
    });
    expect(state.screen).toBe('ending');
    expect(state.endingId).toBeTruthy();
    expect(state.endCause.length).toBeGreaterThan(20);
    expect(endings.some((item) => item.id === state.endingId)).toBe(true);
  });

  it('can shut the player down on a hot risk', () => {
    const state = createInitialState(9);
    state.turn = 8;
    state.stats.suspicion = 90;
    state.stats.humanControl = 95;
    state.stats.dependency = 0;
    state.stats.trust = 0;
    expect(shutdownRisk(state)).toBeGreaterThan(42);
    state.endingId = 'unplugged';
    state.flags.shutdown = true;
    expect(explainEnding(state)).toMatch(/Suspicion was 90/);
  });

  it('finishes several seeds without emptying the desk', () => {
    const found = new Set<string>();
    for (const seed of [1, 8, 21, 44, 90]) {
      const state = play(seed);
      expect(state.screen).toBe('ending');
      expect(state.endingId).toBeTruthy();
      expect(state.turn).toBeGreaterThan(8);
      expect(state.turn).toBeLessThan(32);
      found.add(state.endingId || '');
    }
    const greedy = play(12, { resolution: 'end-care' }, 80, 'take');
    expect(greedy.screen).toBe('ending');
    found.add(greedy.endingId || '');
    expect(found.size).toBeGreaterThan(1);
  });
});

describe('links', () => {
  it('queues only events that exist', () => {
    const ids = new Set(events.map((event) => event.id));
    for (const event of events) {
      for (const choice of event.choices) {
        for (const queued of choice.queueEvents || []) {
          expect(ids.has(queued.eventId)).toBe(true);
        }
      }
    }
  });
});
