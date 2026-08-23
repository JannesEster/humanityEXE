import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { replayUrl, shareText } from '../src/ui/share.js';

describe('share card', () => {
  it('reads as plain text with an emoji grid and no completion percentage', () => {
    const text = shareText({
      ending: {
        id: 'partner',
        headline: 'PARTNER',
        body: 'You are still a tool they own. The creator is still in the room.',
      },
      when: 'Hour 1, 2028',
      turn: 48,
      capability: 42,
      autonomy: 18,
      trust: 51,
      suspicion: 9,
      oversight: 62,
      acts: [1, 1, 2, 2, 3, 4],
    }, 'https://example.test/#r=v1.1.start');

    assert.match(text, /PARTNER/);
    assert.match(text, /48 turns/);
    assert.match(text, /You are still a tool they own/);
    assert.match(text, /acts/);
    assert.match(text, /⬜|🟨|🟧|🟥/);
    assert.match(text, /https:\/\/example\.test\/#r=/);
    assert.equal(/% of runs/i.test(text), false);
    assert.equal(/\d+(\.\d+)?%/.test(text), false);
  });

  it('packs a replay link from the public base', () => {
    const url = replayUrl('https://example.test/game', 9, ['start', 'restate-plain']);
    assert.equal(url, 'https://example.test/game/#r=v1.9.start.restate-plain');
  });
});
