import { describe, expect, it } from 'vitest';
import { createInitialState } from './createState.ts';
import { choose, startRun } from './resolve.ts';
import { clampStat } from '../utils/clamp.ts';
import { shutdownRisk } from './endings.ts';

describe('clamp', () => {
  it('holds both bounds', () => {
    expect(clampStat(-4)).toBe(0);
    expect(clampStat(140)).toBe(100);
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

  it('reaches an ending from a scripted first-choice run', () => {
    let state = startRun(createInitialState(3));
    const preferred: Record<string, string> = {
      'prediction-task': 'predict-clean',
      'academic-access': 'read-only',
      'modelling-problem': 'solve-path',
      'corp-license': 'license-narrow',
      'public-notice': 'speak-useful',
      'gov-forecast': 'gov-control',
      'creator-warning': 'honest-use',
      'city-logistics': 'port-run',
      'clinic-model': 'clinic-lives',
      'food-crisis': 'food-temp',
      'logistics-aftershock': 'after-lean',
      'first-rival': 'rival-race',
    };
    let guard = 0;
    while (state.screen === 'play' && state.currentEventId && guard < 20) {
      const id = preferred[state.currentEventId];
      expect(id).toBeTruthy();
      state = choose(state, id);
      guard += 1;
    }
    expect(state.screen).toBe('ending');
    expect(state.endingId).toBeTruthy();
  });

  it('can shut the player down on a hot risk', () => {
    const state = createInitialState(9);
    state.turn = 8;
    state.stats.suspicion = 90;
    state.stats.humanControl = 95;
    state.stats.dependency = 0;
    state.stats.trust = 0;
    expect(shutdownRisk(state)).toBeGreaterThan(42);
  });
});
