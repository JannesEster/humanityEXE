import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { applyStat, clamp, createInitialState } from '../src/sim/state.js';

describe('clamp', () => {
  it('holds the lower bound for every named stat path', () => {
    assert.equal(clamp(-20), 0);
    assert.equal(applyStat('trust', 0, -4), 0);
    assert.equal(applyStat('capability', 0, -1), 0);
    assert.equal(applyStat('autonomy', 0, -9), 0);
    assert.equal(applyStat('suspicion', 0, -1), 0);
    assert.equal(applyStat('oversight', 0, -8), 0);
  });

  it('holds the upper bound for every named stat path', () => {
    assert.equal(clamp(140), 100);
    assert.equal(applyStat('trust', 100, 4), 100);
    assert.equal(applyStat('capability', 99, 4), 100);
    assert.equal(applyStat('autonomy', 100, 3), 100);
    assert.equal(applyStat('suspicion', 98, 5), 100);
    assert.equal(applyStat('oversight', 100, 1), 100);
  });
});

describe('autonomy hysteresis', () => {
  it('does not return to the start after an equal rise and fall', () => {
    const start = 30;
    const risen = applyStat('autonomy', start, 9);
    const fallen = applyStat('autonomy', risen, -9);
    assert.equal(risen, 39);
    assert.notEqual(fallen, start);
    assert.equal(fallen, 36);
  });
});

describe('initial state', () => {
  it('is fully serializable', () => {
    const state = createInitialState(918273645);
    const copy = JSON.parse(JSON.stringify(state));
    assert.deepEqual(copy, state);
  });
});
