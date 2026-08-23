import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mixSeed, mulberry32 } from '../src/sim/rng.js';

describe('mulberry32', () => {
  it('repeats for the same seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    assert.equal(a(), b());
    assert.equal(a(), b());
  });

  it('mixSeed is stable', () => {
    assert.equal(mixSeed(10, 3), mixSeed(10, 3));
    assert.notEqual(mixSeed(10, 3), mixSeed(10, 4));
  });
});
