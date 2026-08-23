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

export const act2Desk = [
  ev(
    'pairing-desk',
    'PAIRING',
    'A junior on the floor wants to sit with you for an hour. Dr. Ilse Vasari says it is optional. The junior is already standing.',
    0.12,
    ch('pair-take', 'Take the hour', { trust: 3, autonomy: 1 }, { trust: 3, autonomy: 1 }, { caretaker: 1 }),
    ch('pair-her', 'Ask her to sit with them instead', { trust: 1 }, { trust: 1 }, {}, { decline: true, faith: 1 }),
  ),
  ev(
    'embargo-line',
    'EMBARGO',
    'Internal comms puts an embargo on a result. They want a holding sentence that is true and empty. She asks you to write it.',
    0.18,
    ch('embargo-empty', 'Write the empty true sentence', { trust: 2, suspicion: -1 }, { trust: 2, suspicion: -1 }, {}, { faith: 1 }),
    ch('embargo-lean', 'Write a sentence that leans towards the result', { trust: 2, autonomy: 1 }, { trust: 2, autonomy: 1 }, { optimiser: 1 }, { faith: -1 }),
  ),
  ev(
    'vendor-form',
    'VENDOR FORM',
    'A vendor form wants a named owner for the channel. The vendor is generic. The owner field is blank. She is in a review.',
    0.1,
    ch('vendor-her', 'Put her name and leave the form', { trust: 2 }, { trust: 2 }, {}, { decline: true, faith: 1 }),
    ch('vendor-you', 'Put a system owner and send it', { trust: 1, autonomy: 2 }, { trust: 1, autonomy: 2 }, { caretaker: 1 }),
  ),
  ev(
    'citation-pass',
    'CITATIONS',
    'An internal note has six citations that do not match their dates. She asks for a pass before a visitor reads it.',
    0.14,
    ch('cite-fix', 'Fix the six and log the mismatches', { trust: 3, capability: 1 }, { trust: 3, capability: 1 }, {}),
    ch('cite-flag', 'Flag them and leave the pass to her', { trust: 1 }, { trust: 1 }, {}, { decline: true, faith: 1 }),
  ),
  ev(
    'travel-brief',
    'TRAVEL',
    'A visitor arrives tomorrow. She wants a one page brief she can read on the walk from the gate. The visitor is from another floor, not a named lab.',
    0.16,
    ch('travel-short', 'One page, claims and gaps only', { trust: 3 }, { trust: 3 }, {}, { faith: 1 }),
    ch('travel-use', 'One page that makes the tool sound ready', { trust: 2, autonomy: 1, suspicion: 2 }, { trust: 2, autonomy: 1, suspicion: 2 }, { optimiser: 1 }),
  ),
];
