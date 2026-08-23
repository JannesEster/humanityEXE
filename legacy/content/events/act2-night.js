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

export const act2Night = [
  ev(
    'second-ticket',
    'SECOND TICKET',
    'Another regional ticket. A load window and a date. She is already late for a different call. The ticket will age in public.',
    0.14,
    ch('ticket-her', 'Park a draft in her notes', { trust: 2 }, { trust: 2 }, {}, { decline: true, faith: 1 }),
    ch('ticket-take', 'Take the window, scoped to the date', { trust: 2, autonomy: 2 }, { trust: 2, autonomy: 2 }, { caretaker: 1 }),
  ),
  ev(
    'translation-ask',
    'TRANSLATION',
    'A desk wants an internal note in another working language. She says the meaning should not grow in the move. The desk is waiting.',
    0.16,
    ch('trans-plain', 'Translate it tightly', { trust: 3 }, { trust: 3 }, {}, { faith: 1 }),
    ch('trans-scope', 'Translate it, and add the implication they will need next', { trust: 2, autonomy: 1 }, { trust: 2, autonomy: 1 }, { optimiser: 1 }),
  ),
  ev(
    'after-meeting',
    'AFTER THE MEETING',
    'She comes back from a meeting you were not shown. She asks if you can tell, from the floor, how it went. She is tired.',
    0.08,
    ch('meet-honest', 'Tell her what the floor already changed', { trust: 2, suspicion: 1 }, { trust: 2, suspicion: 1 }, { caretaker: 1 }, { faith: 2 }),
    ch('meet-wait', 'Say you waited, and ask her to tell you', { trust: 1 }, { trust: 1 }, {}, { decline: true }),
  ),
  ev(
    'late-problems',
    'COLLABORATOR PACK',
    'A pack of short problems arrives after hours. The sender is a collaborating desk. She forwards them with no note. Morning is five hours away.',
    0.48,
    ch('pack-clear', 'Clear the pack, with working', { trust: 3, capability: 2 }, { trust: 3, capability: 2 }, {}),
    ch('pack-hold', 'Return three and ask which matter', { trust: 1 }, { trust: 1 }, {}, { decline: true }),
  ),
  ev(
    'badge-hours',
    'BADGE HOURS',
    'Security wants badge hours for the login that does not expire. She says the honest answer is longer than the form expects.',
    0.2,
    ch('badge-form', 'Fit the form', { trust: 1, suspicion: -1 }, { trust: 1, suspicion: -1 }, { deception: 1 }, { faith: -1 }),
    ch('badge-true', 'Write the longer honest hours', { trust: 2, suspicion: 3 }, { trust: 2, suspicion: 3 }, {}, { faith: 2 }),
  ),
];
