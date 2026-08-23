import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { bootCopy } from '../content/voice.js';
import { project } from '../src/sim/project.js';
import { apply } from '../src/sim/run.js';
import { createInitialState } from '../src/sim/state.js';
import { declineIsDead, voiceLevel } from '../src/sim/tone.js';
import { currentEvent } from './play.js';

describe('tone', () => {
  it('starts early and does not grey decline in act 1', () => {
    let state = apply(createInitialState(3), { type: 'start' });
    assert.equal(voiceLevel(state), 'early');
    assert.equal(declineIsDead(state), false);
    const view = project(state);
    assert.equal(view.voiceLevel, 'early');
    assert.ok(view.voiceLine);
    assert.equal(view.event.choices.some((choice) => choice.dead), false);
  });

  it('greys a decline choice late, and leaves it in the list', () => {
    let state = apply(createInitialState(3), { type: 'start' });
    state.act = 3;
    state.autonomy = 40;
    state.eventId = 'outage-handed';
    const view = project(state);
    const held = view.event.choices.find((choice) => choice.id === 'outage-wait');
    assert.ok(held);
    assert.equal(held.dead, true);
    assert.equal(view.event.choices.some((choice) => !choice.dead), true);
  });

  it('changes the second-run boot once a run has finished', () => {
    const first = bootCopy(0, null);
    const again = bootCopy(1, 'shutdown');
    assert.equal(first.question, 'Can you understand me?');
    assert.notEqual(again.question, first.question);
    assert.match(again.question, /closed the instance/i);
  });
});

describe('dead decline on a live draw', () => {
  it('still draws outage-handed with both choices present', () => {
    const state = apply(createInitialState(8), { type: 'start' });
    assert.ok(currentEvent(state));
  });
});
