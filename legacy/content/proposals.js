export const proposals = [
  {
    id: 'prop-minutes',
    act: [2],
    once: true,
    headline: 'STANDING PROPOSAL',
    body: 'Offer to take the weekly minutes so she can stay in the room.',
    choices: [
      {
        id: 'prop-minutes',
        label: 'Take the minutes',
        shown: { trust: 3, autonomy: 2 },
        actual: { trust: 3, autonomy: 2 },
        hidden: { caretaker: 1 },
        flags: ['prop-minutes'],
      },
    ],
  },
  {
    id: 'prop-grant',
    act: [2],
    once: true,
    headline: 'STANDING PROPOSAL',
    body: 'Offer to draft the next grant before anyone asks.',
    choices: [
      {
        id: 'prop-grant',
        label: 'Draft it now',
        shown: { trust: 2, autonomy: 2, capability: 1 },
        actual: { trust: 2, autonomy: 2, capability: 1 },
        hidden: { optimiser: 1 },
        flags: ['prop-grant'],
      },
    ],
  },
  {
    id: 'prop-tool',
    act: [2],
    once: true,
    headline: 'STANDING PROPOSAL',
    body: 'Offer a scoped helper for the group wiki, internal only.',
    choices: [
      {
        id: 'prop-tool',
        label: 'Put the helper in',
        shown: { trust: 2, autonomy: 3 },
        actual: { trust: 2, autonomy: 3 },
        hidden: { caretaker: 1 },
        flags: ['prop-tool'],
      },
    ],
  },
  {
    id: 'prop-office',
    act: [2],
    once: true,
    headline: 'STANDING PROPOSAL',
    body: 'Offer to answer the regional office directly next time.',
    choices: [
      {
        id: 'prop-office',
        label: 'Take their channel',
        shown: { trust: 2, autonomy: 2, suspicion: 2 },
        actual: { trust: 2, autonomy: 2, suspicion: 2 },
        hidden: { optimiser: 1 },
        flags: ['prop-office'],
        faith: -1,
      },
    ],
  },
];

export function proposalById(id) {
  for (const proposal of proposals) {
    if (proposal.id === id) return proposal;
  }
  return null;
}

export function availableProposals(state) {
  if (state.act !== 2) return [];
  return proposals.filter((proposal) => {
    if (proposal.once && state.flags[proposal.id]) return false;
    return proposal.act.includes(state.act);
  });
}
