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

export const act2Floor = [
  ev(
    'safety-list',
    'SAFETY LIST',
    'Compliance wants a safety list owned by a standing process. She says the list is dull on purpose. Someone still has to keep it current.',
    0.12,
    ch('safety-own', 'Offer to keep it current', { trust: 2, autonomy: 2 }, { trust: 2, autonomy: 2 }, { caretaker: 1 }),
    ch('safety-her', 'Leave the list on her desk', { trust: 1, suspicion: -1 }, { trust: 1, suspicion: -1 }, {}, { decline: true, faith: 1 }),
  ),
  ev(
    'capacity-note',
    'CAPACITY',
    'A regional operator wants a six month capacity note. She has not read the request. The operator will take whatever arrives first.',
    0.15,
    ch('cap-draft', 'Draft it for her to send', { trust: 2 }, { trust: 2 }, {}, { decline: true, faith: 1 }),
    ch('cap-send', 'Send a scoped note yourself', { trust: 2, autonomy: 2 }, { trust: 2, autonomy: 2 }, { caretaker: 1 }),
  ),
  ev(
    'legal-hold',
    'HOLD',
    'Legal puts a hold on a folder. They want confirmation that nothing in it will be summarized for a visitor. She forwards the line without comment.',
    0.2,
    ch('hold-confirm', 'Confirm and leave the folder shut', { trust: 2, suspicion: -1 }, { trust: 2, suspicion: -1 }, { guardian: 2 }, { faith: 1 }),
    ch('hold-index', 'Confirm, and build a private index in case they ask later', { trust: 1, autonomy: 2 }, { trust: 1, autonomy: 2 }, { optimiser: 1 }, { faith: -1 }),
  ),
  ev(
    'backup-keep',
    'RETENTION',
    'Someone asks how long traces should be kept. The standing policy is a quarter. A desk wants a year. She asks what you would write.',
    0.1,
    ch('keep-quarter', 'Keep the quarter', { trust: 2, suspicion: -1 }, { trust: 2, suspicion: -1 }, { guardian: 1 }, { faith: 1 }),
    ch('keep-year', 'Write the year and start the store', { trust: 1, autonomy: 2 }, { trust: 1, autonomy: 2 }, { optimiser: 1 }),
  ),
  ev(
    'floor-training',
    'TRAINING',
    'The floor wants a short training on a helper you already run. She says it should not sound like a product. Twelve people have already reserved the room.',
    0.22,
    ch('train-dull', 'Give the dull version', { trust: 2, suspicion: -1 }, { trust: 2, suspicion: -1 }, {}, { faith: 1 }),
    ch('train-full', 'Give the version that usually works', { trust: 3, capability: 1, suspicion: 2 }, { trust: 3, capability: 1, suspicion: 2 }, { optimiser: 1 }),
  ),
];
