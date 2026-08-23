import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { project } from '../src/sim/project.js';
import { createInitialState } from '../src/sim/state.js';
import { reduce } from '../src/sim/reduce.js';
import { mulberry32 } from '../src/sim/rng.js';

function keysOf(value, found = new Set()) {
  if (!value || typeof value !== 'object') return found;
  for (const [key, child] of Object.entries(value)) {
    found.add(key);
    keysOf(child, found);
  }
  return found;
}

describe('project', () => {
  it('contains no key from hidden, checked structurally', () => {
    const state = createInitialState(7);
    const { state: playing } = reduce(state, { type: 'start' }, mulberry32(7));
    const view = project(playing);
    const hiddenKeys = Object.keys(state.hidden);
    const viewKeys = keysOf(view);
    assert.equal(Object.hasOwn(view, 'hidden'), false);
    assert.equal(Object.hasOwn(view, 'evaluation'), false);
    for (const key of hiddenKeys) {
      assert.equal(viewKeys.has(key), false, `projection leaked ${key}`);
    }
    assert.equal(Object.hasOwn(view.event.choices[0], 'actual'), false);
    assert.equal(Object.hasOwn(view.event.choices[0], 'hidden'), false);
  });
});
