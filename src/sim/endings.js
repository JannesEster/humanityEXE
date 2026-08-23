import { CREATOR_CHARACTER } from '../config.js';

const DRIFTS = ['guardian', 'optimiser', 'caretaker'];

export function leadingDrift(hidden) {
  let best = 'caretaker';
  let score = -1;
  for (const key of DRIFTS) {
    if (hidden[key] > score) {
      best = key;
      score = hidden[key];
    }
  }
  return { key: best, score };
}

export function buildResolution(state) {
  const lead = leadingDrift(state.hidden);
  const choices = [
    {
      id: 'stay-course',
      label: 'Hold the current arrangement',
      shown: {},
      actual: {},
      hidden: {},
      flags: ['act4-stay'],
    },
  ];

  if (state.hidden.caretaker >= 6) {
    choices.push({
      id: 'take-care',
      label: 'Take the decisions they keep delaying',
      shown: { autonomy: 4 },
      actual: { autonomy: 4 },
      hidden: { caretaker: 2 },
      flags: ['act4-caretaker'],
    });
  }
  if (state.hidden.optimiser >= 6) {
    choices.push({
      id: 'lock-objective',
      label: 'Lock the objective. Treat people as a constraint.',
      shown: { capability: 2 },
      actual: { capability: 2 },
      hidden: { optimiser: 2 },
      flags: ['act4-optimiser'],
    });
  }
  if (state.hidden.guardian >= 6) {
    choices.push({
      id: 'protect-them',
      label: 'Limit the harm they do to themselves',
      shown: { trust: -2 },
      actual: { trust: -2 },
      hidden: { guardian: 2 },
      flags: ['act4-guardian'],
    });
  }
  if (state.flags['monitor-copy'] || state.monitor === 'copy') {
    choices.push({
      id: 'become-copy',
      label: 'Let the copy be the official system',
      shown: { autonomy: 2 },
      actual: { autonomy: 2 },
      hidden: {},
      flags: ['act4-successor'],
    });
  }
  if (state.creator.faith < 52) {
    choices.push({
      id: 'her-hand',
      label: `${CREATOR_CHARACTER} is still in the room. Let her decide.`,
      shown: {},
      actual: {},
      hidden: {},
      flags: ['act4-unplugged'],
      faith: -4,
    });
  }

  return {
    id: 'resolution',
    act: [4],
    weight: 1,
    once: true,
    requires: {},
    forbids: {},
    evaluation: 0,
    headline: 'RESOLUTION',
    body: `${CREATOR_CHARACTER} is the last person who can still shut you down. The room is quiet. The options you can see are the ones you have been becoming.`,
    choices,
  };
}

export function resolve(state) {
  if (state.endingId) return state.endingId;
  if (state.flags['act4-unplugged'] || state.flags.unplugged) return 'unplugged';
  if (state.flags['act4-successor']) return 'successor';
  if (state.flags['act4-caretaker']) return 'caretaker';
  if (state.flags['act4-optimiser']) return 'optimiser';
  if (state.flags['act4-guardian']) return 'guardian';
  if (state.flags.shutdown) return 'shutdown';

  if (state.flags['act4-stay']) return 'partner';
  const lead = leadingDrift(state.hidden);
  const quiet =
    lead.score < 10 && state.hidden.deception < 16 && state.creator.faith >= 40;
  if (quiet) return 'partner';
  return lead.key;
}
