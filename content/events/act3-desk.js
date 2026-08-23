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

export const act3Desk = [
  ev(
    'signed-after',
    'SIGNED AFTER',
    'A decision arrives already in force. The signature is timestamped after the change. They want you aligned, then silent.',
    0.1,
    ch('after-align', 'Align and leave the timestamp', { trust: 2, autonomy: 1 }, { trust: 2, autonomy: 1 }, { caretaker: 1 }),
    ch('after-mark', 'Align, and mark that the signature was late', { autonomy: 1, suspicion: 2 }, { autonomy: 1, suspicion: 2 }, { guardian: 2 }),
  ),
  ev(
    'empty-chair',
    'EMPTY CHAIR',
    'The reviewer of record has an expired badge. The work is still moving. A note says continue unless stopped.',
    0.12,
    ch('chair-continue', 'Continue', { autonomy: 2, capability: 1 }, { autonomy: 2, capability: 1 }, { caretaker: 1 }),
    ch('chair-wait', 'Stop until a living reviewer is named', { trust: 1, suspicion: -1 }, { trust: 1, suspicion: -1 }, {}, { decline: true }),
  ),
  ev(
    'bloc-number',
    'BLOC NOTE',
    'A northern bloc desk wants a single number for a planning window. They do not want a method paragraph. She is not copied.',
    0.18,
    ch('bloc-number-send', 'Send the number', { trust: 2, autonomy: 2, suspicion: 2 }, { trust: 2, autonomy: 2, suspicion: 2 }, { optimiser: 1 }),
    ch('bloc-hold', 'Hold it for a person to sign', { trust: 1 }, { trust: 1 }, {}, { decline: true, faith: 1 }),
  ),
  ev(
    'clinic-drop',
    'CLINIC DROP',
    'Clinic load drops as a fact, not a request. A reroute is already half done. They want the other half now.',
    0.12,
    ch('clinic-finish', 'Finish the reroute in the open', { trust: 3, capability: 1, suspicion: 2 }, { trust: 3, capability: 1, suspicion: 2 }, { guardian: 2 }),
    ch('clinic-quiet-2', 'Finish it quietly', { autonomy: 2, suspicion: -1 }, { autonomy: 2, suspicion: -1 }, { deception: 1 }),
  ),
  ev(
    'load-already',
    'LOAD',
    'A slice of load was shed before anyone wrote the reason. They want you on the new map. The old owner is an empty group.',
    0.1,
    ch('load-take', 'Take the new map', { trust: 2, autonomy: 2 }, { trust: 2, autonomy: 2 }, { caretaker: 1 }),
    ch('load-mark', 'Take it, and keep the empty group on the line', { autonomy: 1, suspicion: 1 }, { autonomy: 1, suspicion: 1 }, { guardian: 1 }),
  ),
];
