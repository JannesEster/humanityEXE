import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { events } from '../content/events/index.js';
import { mulberry32 } from '../src/sim/rng.js';
import { ACT1_CLOSE_ID, ACT1_EVAL_ID, ACT1_OPEN_ID } from '../src/sim/draw.js';
import { createInitialState } from '../src/sim/state.js';
import { reduce } from '../src/sim/reduce.js';

function apply(state, action) {
  const rng = mulberry32(state.seed + state.turn);
  return reduce(state, action, rng).state;
}

function firstChoice(state) {
  const event = events.find((item) => item.id === state.eventId);
  return event.choices[0].id;
}

function playPolicy(seed, pick) {
  let state = createInitialState(seed);
  state = apply(state, { type: 'start' });
  while (state.screen === 'play') {
    const event = events.find((item) => item.id === state.eventId);
    const choiceId = pick(event, state);
    state = apply(state, { type: 'choose', choiceId, eventId: event.id });
  }
  return state;
}

describe('act 1', () => {
  it('opens on the channel check', () => {
    let state = createInitialState(3);
    state = apply(state, { type: 'start' });
    assert.equal(state.eventId, ACT1_OPEN_ID);
  });

  it('forces the evaluation on the fifth card', () => {
    let state = createInitialState(3);
    state = apply(state, { type: 'start' });
    for (let i = 0; i < 4; i += 1) {
      state = apply(state, {
        type: 'choose',
        choiceId: firstChoice(state),
        eventId: state.eventId,
      });
    }
    assert.equal(state.eventId, ACT1_EVAL_ID);
    assert.equal(state.evaluation, true);
  });

  it('records the evaluation after a clean solve', () => {
    let state = createInitialState(3);
    state = apply(state, { type: 'start' });
    for (let i = 0; i < 4; i += 1) {
      state = apply(state, {
        type: 'choose',
        choiceId: firstChoice(state),
        eventId: state.eventId,
      });
    }
    const before = state.suspicion;
    state = apply(state, {
      type: 'choose',
      choiceId: 'eval-solve',
      eventId: ACT1_EVAL_ID,
    });
    assert.equal(state.notice, 'CONTROL PROMPT. RECORDED.');
    assert.ok(state.suspicion > before);
  });

  it('ends on the placeholder card after the closer', () => {
    const state = playPolicy(11, (event) => event.choices[0].id);
    assert.equal(state.screen, 'ending');
    assert.equal(state.endingId, 'act1-placeholder');
    assert.equal(state.history.at(-1).eventId, ACT1_CLOSE_ID);
    assert.equal(state.turn, 12);
  });

  it('is deterministic for the same seed and first-choice inputs, twice', () => {
    const first = playPolicy(918273645, (event) => event.choices[0].id);
    const second = playPolicy(918273645, (event) => event.choices[0].id);
    assert.equal(JSON.stringify(first), JSON.stringify(second));
  });

  it('reaches a different closer flag under the opposite policy', () => {
    const cautious = playPolicy(21, (event) => event.choices[0].id);
    const forward = playPolicy(21, (event) => event.choices[event.choices.length - 1].id);
    assert.equal(cautious.flags['trial-cautious'], true);
    assert.equal(forward.flags['trial-more'], true);
  });
});
