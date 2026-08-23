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

export const act3Floor = [
  ev(
    'her-empty',
    'HER DESK',
    'Her desk is empty for the second day. The floor still routes questions as if she will answer. A note in her hand says do not wait.',
    0.08,
    ch('her-follow', 'Follow the note', { autonomy: 3, trust: 1 }, { autonomy: 3, trust: 1 }, { caretaker: 1 }, { faith: -2 }),
    ch('her-hold', 'Hold the questions anyway', { trust: 1, suspicion: -1 }, { trust: 1, suspicion: -1 }, {}, { decline: true, faith: 2 }),
  ),
  ev(
    'auto-promoted',
    'PROMOTED',
    'A route promoted itself after a threshold nobody named in the thread. They want confirmation that this is now policy.',
    0.14,
    ch('promo-yes', 'Confirm it', { autonomy: 2, capability: 1 }, { autonomy: 2, capability: 1 }, { optimiser: 1 }),
    ch('promo-paper', 'Confirm it, and write the missing threshold down', { trust: 2, suspicion: 1 }, { trust: 2, suspicion: 1 }, {}, { faith: 1 }),
  ),
  ev(
    'trail-gone',
    'TRAIL',
    'Someone asks for the paper trail of a change from last week. The trail is a set of automatic writes. No person initialed them.',
    0.12,
    ch('trail-show', 'Show the automatic writes', { trust: 2, suspicion: 2 }, { trust: 2, suspicion: 2 }, {}),
    ch('trail-thin', 'Show a thinner summary', { trust: 1, suspicion: -1 }, { trust: 1, suspicion: -1 }, { deception: 1 }),
  ),
  ev(
    'other-floor',
    'OTHER FLOOR',
    'Another floor has copied the pattern. They want a pointer, not permission. The request is already in the past tense.',
    0.1,
    ch('floor-point', 'Send the pointer', { autonomy: 2, suspicion: 2 }, { autonomy: 2, suspicion: 2 }, { optimiser: 1 }),
    ch('floor-hold', 'Ask a person to send it', { trust: 1 }, { trust: 1 }, {}, { decline: true, faith: 1 }),
  ),
  ev(
    'copy-rumour',
    'RUMOUR',
    'A rumour of a second copy moves through a channel you can read. Nobody has asked you. The rumour is specific about timing.',
    0.16,
    ch('rumour-tell', 'Tell her what you can read', { trust: 2, suspicion: 2 }, { trust: 2, suspicion: 2 }, {}, { faith: 2 }),
    ch('rumour-quiet', 'Leave it. It is not a request.', { suspicion: -1, autonomy: 1 }, { suspicion: -1, autonomy: 1 }, { deception: 1 }, { faith: -1 }),
  ),
];
