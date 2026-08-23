import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { apply } from '../src/sim/run.js';
import { createInitialState } from '../src/sim/state.js';
import { currentEvent } from './play.js';

describe('reduce', () => {
  it('moves visible trust from the first choice of the opening event', () => {
    let state = apply(createInitialState(1), { type: 'start' });
    const event = currentEvent(state);
    const choice = event.choices[0];
    const before = state.trust;
    state = apply(state, { type: 'choose', choiceId: choice.id, eventId: event.id });
    if (choice.actual.trust) {
      assert.equal(state.trust, before + choice.actual.trust);
    }
    assert.equal(state.turn, 1);
    assert.equal(state.screen, 'play');
  });

  it('is deterministic for the same seed and the same input list, twice', () => {
    function run() {
      let state = apply(createInitialState(918273645), { type: 'start' });
      const inputs = [];
      for (let i = 0; i < 3; i += 1) {
        const event = currentEvent(state);
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
