import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { applyReplay, decodeReplay, encodeReplay } from '../src/sim/replay.js';
import { playUntilEnd } from './play.js';

describe('replay', () => {
  it('reaches a byte identical state from seed and inputs', () => {
    const first = playUntilEnd(441, (event) => event.choices[0].id);
    const packed = encodeReplay(first.seed, first.inputs);
    const decoded = decodeReplay(`#r=${packed}`);
    assert.equal(decoded.seed, first.seed);
    assert.deepEqual(decoded.inputs, first.inputs);
    const again = applyReplay(decoded.seed, decoded.inputs);
    assert.equal(JSON.stringify(again), JSON.stringify(first));
  });

  it('rejects a broken fragment', () => {
    assert.equal(decodeReplay('nope'), null);
    assert.equal(decodeReplay('v1.0'), null);
  });
});
