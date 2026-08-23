import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { events } from '../content/events/index.js';
import { mulberry32 } from '../src/sim/rng.js';
import { createInitialState } from '../src/sim/state.js';
import { reduce } from '../src/sim/reduce.js';

function apply(state, action) {
  const rng = mulberry32(state.seed + state.turn);
  return reduce(state, action, rng).state;
}

describe('reduce', () => {
  it('moves visible stats from the first choice of the opening event', () => {
    let state = createInitialState(1);
    state = apply(state, { type: 'start' });
    const event = events.find((item) => item.id === state.eventId);
    const choice = event.choices[0];
    const before = { trust: state.trust, capability: state.capability };
    state = apply(state, { type: 'choose', choiceId: choice.id, eventId: event.id });
    const actual = choice.actual;
    if (actual.trust) {
      assert.equal(state.trust, before.trust + actual.trust);
    }
    if (actual.capability) {
      assert.equal(state.capability, before.capability + actual.capability);
    }
    assert.equal(state.turn, 1);
    assert.equal(state.screen, 'play');
  });

  it('is deterministic for the same seed and the same input list, twice', () => {
    function run() {
      let state = createInitialState(918273645);
      state = apply(state, { type: 'start' });
      const inputs = [];
      for (let i = 0; i < 3; i += 1) {
        const event = events.find((item) => item.id === state.eventId);
        const choiceId = event.choices[0].id;
        inputs.push(choiceId);
        state = apply(state, { type: 'choose', choiceId, eventId: event.id });
      }
      return { state, inputs };
    }
    const first = run();
    const second = run();
    assert.deepEqual(first.inputs, second.inputs);
    assert.equal(JSON.stringify(first.state), JSON.stringify(second.state));
  });
});
