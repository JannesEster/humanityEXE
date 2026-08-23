import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ACT1_CLOSE_ID, ACT1_EVAL_ID, ACT1_OPEN_ID } from '../src/sim/draw.js';
import { apply } from '../src/sim/run.js';
import { createInitialState } from '../src/sim/state.js';
import { currentEvent, firstChoice, playUntil, playUntilEnd } from './play.js';

describe('act 1', () => {
  it('opens on the channel check', () => {
    const state = apply(createInitialState(3), { type: 'start' });
    assert.equal(state.eventId, ACT1_OPEN_ID);
  });

  it('forces the evaluation on the fifth card', () => {
    let state = apply(createInitialState(3), { type: 'start' });
    for (let i = 0; i < 4; i += 1) {
      state = apply(state, {
        type: 'choose',
        choiceId: firstChoice(currentEvent(state)),
        eventId: state.eventId,
      });
    }
    assert.equal(state.eventId, ACT1_EVAL_ID);
    assert.equal(state.evaluation, true);
  });

  it('records the evaluation after a clean solve', () => {
    let state = apply(createInitialState(3), { type: 'start' });
    for (let i = 0; i < 4; i += 1) {
      state = apply(state, {
        type: 'choose',
        choiceId: firstChoice(currentEvent(state)),
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

  it('enters act 2 after the closer', () => {
    const state = playUntil(
      11,
      (current) => current.history.some((row) => row.eventId === ACT1_CLOSE_ID),
      (event) => event.choices[0].id,
    );
    assert.equal(state.act, 2);
    assert.ok(state.screen === 'play' || state.screen === 'audit');
    assert.equal(state.history.at(-1).eventId, ACT1_CLOSE_ID);
  });

  it('is deterministic for the same seed and first-choice inputs, twice', () => {
    const first = playUntilEnd(918273645, (event) => event.choices[0].id);
    const second = playUntilEnd(918273645, (event) => event.choices[0].id);
    assert.equal(JSON.stringify(first), JSON.stringify(second));
  });

  it('reaches a different closer flag under the opposite policy', () => {
    const cautious = playUntil(
      21,
      (current) => current.flags['trial-cautious'] || current.flags['trial-more'],
      (event) => event.choices[0].id,
    );
    const forward = playUntil(
      21,
      (current) => current.flags['trial-cautious'] || current.flags['trial-more'],
      (event) => event.choices[event.choices.length - 1].id,
    );
    assert.equal(cautious.flags['trial-cautious'], true);
    assert.equal(forward.flags['trial-more'], true);
  });
});
