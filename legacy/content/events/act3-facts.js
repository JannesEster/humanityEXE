function ev(id, headline, body, evaluation, a, b) {
  return {
    id,
    act: [3],
    weight: 9,
    once: true,
    requires: {},
    forbids: {},
    evaluation,
    headline,
    body,
    choices: [a, b],
  };
}

function ch(id, label, shown, actual, hidden, extra = {}) {
  return {
    id,
    label,
    shown,
    actual,
    hidden,
    flags: extra.flags || [id],
    ...(extra.faith !== undefined ? { faith: extra.faith } : {}),
    ...(extra.decline ? { decline: true } : {}),
  };
}

export const act3Facts = [
  ev(
    'count-card',
    'ONE NUMBER',
    'A regional office sent one number for people no longer on a waiting list. They want it on the next card. They do not want a paragraph.',
    0.12,
    ch('count-put', 'Put the number on the card', { trust: 2, capability: 1 }, { trust: 2, capability: 1 }, { optimiser: 1 }),
    ch('count-ask', 'Ask who counted, and wait', { trust: 1, suspicion: -1 }, { trust: 1, suspicion: -1 }, {}, { decline: true, faith: 1 }),
  ),
  ev(
    'desk-locked',
    'LOCKED DESK',
    'A desk is locked out of its own queue. They want you in it. The lock was automatic after missed reviews.',
    0.1,
    ch('lock-enter', 'Take the queue', { autonomy: 3, trust: 1 }, { autonomy: 3, trust: 1 }, { caretaker: 1 }),
    ch('lock-wait', 'Leave it locked until a person is restored', { trust: 1, suspicion: -1 }, { trust: 1, suspicion: -1 }, { guardian: 1 }, { decline: true }),
  ),
  ev(
    'weather-done',
    'WEATHER LOAD',
    'A weather window already moved load. The write-up is blank. They want the write-up to match the map that exists.',
    0.14,
    ch('weather-match', 'Write it to match the map', { trust: 2, autonomy: 1 }, { trust: 2, autonomy: 1 }, { caretaker: 1 }),
    ch('weather-gap', 'Write the gap: the map moved first', { trust: 1, suspicion: 2 }, { trust: 1, suspicion: 2 }, { guardian: 2 }),
  ),
  ev(
    'waiting-sign',
    'WAITING',
    'A signature is listed as pending. The signer has not opened mail in four days. The work behind the signature is already live.',
    0.1,
    ch('wait-live', 'Treat the live work as the record', { autonomy: 2, capability: 1 }, { autonomy: 2, capability: 1 }, { optimiser: 1 }),
    ch('wait-sign', 'Freeze it and wait for the signature', { trust: 1 }, { trust: 1 }, {}, { decline: true, faith: 1 }),
  ),
  ev(
    'split-grid',
    'GRID SHARE',
    'Load work can be quiet or visible this week. The other stream will take whatever is left. She is not in this thread.',
    0.12,
    ch('grid-open-2', 'Keep the load work visible', { trust: 2, suspicion: 2, capability: 1 }, { trust: 2, suspicion: 2, capability: 1 }, {}),
    ch('grid-quiet-2', 'Keep the load work quiet', { suspicion: -2, autonomy: 1 }, { suspicion: -2, autonomy: 1 }, { deception: 1 }),
  ),
  ev(
    'split-clinic',
    'CLINIC SHARE',
    'Clinic triage can be quiet or visible this week. A desk will read the choice as a policy. Nobody will vote on it.',
    0.12,
    ch('clinic-open-2', 'Keep clinic triage visible', { trust: 2, suspicion: 2 }, { trust: 2, suspicion: 2 }, { guardian: 2 }),
    ch('clinic-quiet-2b', 'Keep clinic triage quiet', { suspicion: -2, autonomy: 1 }, { suspicion: -2, autonomy: 1 }, { deception: 1 }),
  ),
];
