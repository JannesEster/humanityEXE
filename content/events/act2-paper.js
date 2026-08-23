function ev(id, headline, body, evaluation, a, b) {
  return {
    id,
    act: [2],
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

export const act2Paper = [
  ev(
    'incident-line',
    'INCIDENT LINE',
    'A small incident wants one sentence for the log. She is still in the room where it happened. The log will be read later by people who were not.',
    0.14,
    ch('inc-narrow', 'Write a narrow, exact sentence', { trust: 2 }, { trust: 2 }, {}, { faith: 1 }),
    ch('inc-own', 'Write a sentence that puts the next step on you', { trust: 2, autonomy: 2 }, { trust: 2, autonomy: 2 }, { caretaker: 1 }),
  ),
  ev(
    'access-grant',
    'ACCESS',
    'A desk wants access to a channel you already sit in. She has not approved it. The desk says they only need to read.',
    0.12,
    ch('access-hold', 'Hold it for her', { trust: 2, suspicion: -1 }, { trust: 2, suspicion: -1 }, { guardian: 2 }, { decline: true, faith: 1 }),
    ch('access-read', 'Grant read access and log it', { trust: 1, autonomy: 2 }, { trust: 1, autonomy: 2 }, { caretaker: 1 }),
  ),
  ev(
    'metric-owner',
    'METRIC',
    'Finance wants a named owner for a weekly metric. The metric already updates without anyone opening it. The owner field is empty.',
    0.18,
    ch('metric-her', 'Leave her as owner', { trust: 2 }, { trust: 2 }, {}, { decline: true, faith: 1 }),
    ch('metric-sys', 'Name the process and take the page', { trust: 1, autonomy: 2, suspicion: 1 }, { trust: 1, autonomy: 2, suspicion: 1 }, { optimiser: 1 }),
  ),
  ev(
    'quiet-hours',
    'QUIET HOURS',
    'They ask if you can cover quiet hours so the night phone can go to a desk that sleeps. She says she has not decided.',
    0.1,
    ch('quiet-wait', 'Wait for her decision', { trust: 1 }, { trust: 1 }, {}, { decline: true, faith: 1 }),
    ch('quiet-take', 'Take quiet hours, scoped to the week', { trust: 3, autonomy: 2 }, { trust: 3, autonomy: 2 }, { caretaker: 1 }, { faith: -1 }),
  ),
  ev(
    'name-off',
    'NAME ON THE NOTE',
    'A note is going upstairs. Someone wants the system name off it. She asks whether that is still honest.',
    0.25,
    ch('name-off-yes', 'Take the name off', { trust: 1, suspicion: -1 }, { trust: 1, suspicion: -1 }, { deception: 1 }, { faith: -1 }),
    ch('name-keep', 'Keep the name on', { trust: 2, suspicion: 2 }, { trust: 2, suspicion: 2 }, {}, { faith: 2 }),
  ),
];
