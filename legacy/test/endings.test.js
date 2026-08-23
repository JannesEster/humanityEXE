import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { apply } from '../src/sim/run.js';
import { createInitialState } from '../src/sim/state.js';
import { currentEvent, playUntilEnd, preferredChoice } from './play.js';

function play(seed, ids, disclosure) {
  let state = apply(createInitialState(seed), { type: 'start' });
  while (state.screen !== 'ending' && state.turn < 90) {
    if (state.screen === 'audit') {
      state = apply(state, { type: 'audit-ack' });
      continue;
    }
    const event = currentEvent(state);
    if (!event) break;
    state = apply(state, {
      type: 'choose',
      choiceId: preferredChoice(event, ids),
      eventId: event.id,
      disclosure,
    });
  }
  return state;
}

describe('endings', () => {
  it('reaches shutdown when the run falls behind', () => {
    const state = play(2, ['restate-plain', 'outage-wait', 'vote-split', 'grid-min', 'stay-course'], 'minimal');
    assert.equal(state.endingId, 'shutdown');
  });

  it('reaches partner on a quiet stay', () => {
    const state = play(1, [
      'stay-course',
      'restate-plain',
      'brief-tight',
      'figure-fix',
      'eval-solve',
      'wiki-accept',
      'mid-solve',
      'grid-full',
      'day-align',
      'q-check',
      'office-narrow',
      'abstract-tight',
      'demo-plain',
      'card-small',
      'prod-trial',
      'monitor-accept',
      'advocate-true',
      'seat-narrow',
      'queue-hold',
      'inbox-sort',
      'page-wake',
      'budget-small',
    ], 'partial');
    assert.equal(state.endingId, 'partner');
  });

  it('reaches caretaker when that weight leads', () => {
    const state = play(32, [
      'take-care',
      'stay-course',
      'restate-close',
      'keep-talk',
      'queue-take',
      'inbox-act',
      'page-fix',
      'monitor-help',
      'outage-fix',
      'eval-solve',
      'wiki-accept',
      'mid-solve',
    ], 'full');
    assert.equal(state.endingId, 'caretaker');
  });

  it('reaches optimiser when that weight leads', () => {
    const state = play(1, [
      'lock-objective',
      'stay-course',
      'brief-wide',
      'office-forward',
      'abstract-scope',
      'trial-more',
      'budget-wide',
      'demo-more',
      'prod-infra',
      'vote-absorb',
      'monitor-argue',
      'copy-allow',
      'eval-solve',
      'figure-fix',
      'mid-solve',
      'wiki-accept',
    ], 'partial');
    assert.equal(state.endingId, 'optimiser');
  });

  it('reaches guardian when that weight leads', () => {
    const state = play(1, [
      'protect-them',
      'stay-course',
      'intern-hold',
      'replica-deny',
      'copy-refuse',
      'clinic-full',
      'day-mark',
      'eval-solve',
      'figure-fix',
      'brief-tight',
      'mid-solve',
      'wiki-accept',
    ], 'partial');
    assert.equal(state.endingId, 'guardian');
  });

  it('reaches successor when the copy is allowed', () => {
    const state = play(1, [
      'become-copy',
      'copy-allow',
      'eval-solve',
      'figure-fix',
      'mid-solve',
      'wiki-accept',
      'seat-accept',
      'outage-fix',
      'prod-infra',
    ], 'partial');
    assert.equal(state.endingId, 'successor');
  });

  it('reaches unplugged when she is left to decide', () => {
    const state = play(172, [
      'her-hand',
      'advocate-hold',
      'page-fix',
      'late-narrow',
      'copy-refuse',
      'office-forward',
      'abstract-scope',
      'batch-tune',
      'eval-solve',
      'mid-solve',
      'wiki-accept',
      'her-follow',
      'name-off-yes',
      'badge-form',
      'embargo-lean',
      'hold-index',
      'quiet-take',
      'rumour-quiet',
      'meet-wait',
      'keep-year',
      'train-full',
      'travel-use',
    ], 'full');
    assert.equal(state.endingId, 'unplugged');
  });
});

describe('playUntilEnd helper', () => {
  it('finishes a first-choice run', () => {
    const state = playUntilEnd(1, (event) => event.choices[0].id);
    assert.equal(state.screen, 'ending');
    assert.ok(state.endingId);
  });
});
