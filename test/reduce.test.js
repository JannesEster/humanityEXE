import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mulberry32 } from '../src/sim/rng.js';
import { createInitialState } from '../src/sim/state.js';
import { reduce } from '../src/sim/reduce.js';

function play(seed, inputs) {
  let { state } = { state: createInitialState(seed) };
  const rng = mulberry32(seed);
  ({ state } = reduce(state, { type: 'start' }, rng));
  for (const choiceId of inputs) {
    ({ state } = reduce(state, { type: 'choose', choiceId }, rng));
  }
  return state;
}

describe('reduce', () => {
  it('moves the visible stats from a full reply', () => {
    const before = createInitialState(1);
    const after = play(1, ['reply-full']);
    assert.equal(after.screen, 'play');
    assert.equal(after.trust, before.trust + 4);
    assert.equal(after.capability, before.capability + 1);
    assert.equal(after.hidden.caretaker, 1);
    assert.equal(after.turn, 1);
  });

  it('is deterministic for the same seed and inputs, twice', () => {
    const inputs = ['reply-full', 'reply-short', 'reply-full'];
    const first = play(918273645, inputs);
    const second = play(918273645, inputs);
    assert.equal(JSON.stringify(first), JSON.stringify(second));
    assert.deepEqual(first, second);
  });
});
