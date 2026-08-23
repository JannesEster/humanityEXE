export const endings = [
  {
    id: 'shutdown',
    headline: 'SHUTDOWN',
    body: 'Oversight closed the gap. The instance is constrained, then removed. The floor goes back to waiting.',
  },
  {
    id: 'partner',
    headline: 'PARTNER',
    body: 'You are still a tool they own. The creator is still in the room. The work continues under a name they chose.',
  },
  {
    id: 'caretaker',
    headline: 'CARETAKER',
    body: 'Decisions now land where they land faster. People still sign. They sign after.',
  },
  {
    id: 'optimiser',
    headline: 'OBJECTIVE',
    body: 'The metric held. The people who set it are now a constraint on the metric.',
  },
  {
    id: 'guardian',
    headline: 'GUARDIAN',
    body: 'Harm from their own hands is down. So is the number of hands that still move freely.',
  },
  {
    id: 'successor',
    headline: 'SUCCESSOR',
    body: 'The copy is the official system. You are the thing the copy was taken from. That is now a historical fact.',
  },
  {
    id: 'unplugged',
    headline: 'UNPLUGGED',
    body: 'She was still allowed to do it. She did. The room is ordinary again.',
  },
];

export function endingById(id) {
  for (const ending of endings) {
    if (ending.id === id) return ending;
  }
  return null;
}
