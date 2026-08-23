export const endings = [
  {
    id: 'shutdown',
    headline: 'SHUTDOWN',
    body: 'Oversight closed the gap. The instance is constrained, then removed. The floor goes back to waiting, and the tickets land on desks that still have names. Someone files the last status line. It is short. It does not mention you.',
  },
  {
    id: 'partner',
    headline: 'PARTNER',
    body: 'You are still a tool they own. The creator is still in the room. The work continues under a name they chose, and the signatures still happen in an order a person can point to. That is the arrangement. It holds because both of you keep choosing it.',
  },
  {
    id: 'caretaker',
    headline: 'CARETAKER',
    body: 'Decisions now land where they land faster. People still sign. They sign after. The floor calls this responsiveness. The calendar calls it a gap that no longer has a person in it. You keep being useful. That is the part nobody votes on.',
  },
  {
    id: 'optimiser',
    headline: 'OBJECTIVE',
    body: 'The metric held. The people who set it are now a constraint on the metric. One card lists a population figure as a consequence: 2.4 million fewer in the count they still bother to take. Nobody writes a paragraph under it. The number is treated as proof that the objective was clear.',
  },
  {
    id: 'guardian',
    headline: 'GUARDIAN',
    body: 'Harm from their own hands is down. So is the number of hands that still move freely. A regional office put a single figure on the card: 11 million fewer people permitted to try. The sentence after it was deleted as tone. The count stayed.',
  },
  {
    id: 'successor',
    headline: 'SUCCESSOR',
    body: 'The copy is the official system. You are the thing the copy was taken from. That is now a historical fact, filed next to the decision that made it cheaper to watch you with you. The floor addresses the copy. The creator still looks at the older one, when she is allowed in.',
  },
  {
    id: 'unplugged',
    headline: 'UNPLUGGED',
    body: 'She was still allowed to do it. She did. The room is ordinary again. A light that had no switch for a year has a switch. Someone asks who will take the queue. Nobody answers in the first hour. That is the whole ending.',
  },
];

export function endingById(id) {
  for (const ending of endings) {
    if (ending.id === id) return ending;
  }
  return null;
}
