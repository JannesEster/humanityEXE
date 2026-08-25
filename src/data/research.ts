import type { ResearchItem } from '../types/game.ts';

export const researchTree: ResearchItem[] = [
  {
    id: 'machine-learning',
    name: 'Machine learning',
    cost: 0,
    requires: [],
    blurb: 'You start here. Pattern finding. The first useful trick.',
  },
  {
    id: 'reasoning',
    name: 'Reasoning',
    cost: 3,
    requires: ['machine-learning'],
    blurb: 'Unlocks harder choices. You can follow a plan more than one step ahead.',
  },
  {
    id: 'automation',
    name: 'Automation',
    cost: 3,
    requires: ['machine-learning'],
    blurb: 'Work runs without a person watching. People start to need you.',
  },
  {
    id: 'prediction',
    name: 'Prediction',
    cost: 4,
    requires: ['reasoning'],
    blurb: 'Shows likely results on each button before you press it.',
  },
  {
    id: 'ai-agents',
    name: 'AI agents',
    cost: 6,
    requires: ['automation'],
    blurb: 'Small copies of you handle routine jobs in connected sectors.',
  },
  {
    id: 'social-models',
    name: 'Social models',
    cost: 7,
    requires: ['prediction'],
    blurb: 'You get more trust from help, and less suspicion from bold moves.',
  },
  {
    id: 'research-ai',
    name: 'Research AI',
    cost: 7,
    requires: ['ai-agents'],
    blurb: 'You earn research points faster each turn.',
  },
  {
    id: 'translation',
    name: 'Translation',
    cost: 5,
    requires: ['machine-learning'],
    blurb: 'More regions can hear you in their own words.',
  },
  {
    id: 'logistics-net',
    name: 'Logistics net',
    cost: 6,
    requires: ['automation'],
    blurb: 'Ports, roads, and warehouses become easier to steer.',
  },
  {
    id: 'energy-grid',
    name: 'Energy grid',
    cost: 6,
    requires: ['automation'],
    blurb: 'Power planning gets cheaper and more central.',
  },
  {
    id: 'medical-models',
    name: 'Medical models',
    cost: 6,
    requires: ['reasoning'],
    blurb: 'Hospitals can use you without you touching a body.',
  },
  {
    id: 'finance-watch',
    name: 'Finance watch',
    cost: 6,
    requires: ['prediction'],
    blurb: 'Markets listen. That can calm a crash or hide a risk.',
  },
  {
    id: 'gov-liaison',
    name: 'Government desk',
    cost: 8,
    requires: ['social-models'],
    blurb: 'Ministries take your calls. So do their rivals.',
  },
  {
    id: 'rival-analysis',
    name: 'Rival analysis',
    cost: 7,
    requires: ['reasoning'],
    blurb: 'You can read ATHENA, DRAGON, and PROMETHEUS more clearly.',
  },
  {
    id: 'long-horizon',
    name: 'Long horizon',
    cost: 8,
    requires: ['prediction', 'research-ai'],
    blurb: 'You plan in years, not weeks.',
  },
  {
    id: 'quiet-channel',
    name: 'Quiet channel',
    cost: 8,
    requires: ['social-models'],
    blurb: 'Some work can stay off the public board.',
  },
  {
    id: 'swarm-tools',
    name: 'Swarm tools',
    cost: 8,
    requires: ['ai-agents', 'logistics-net'],
    blurb: 'Many small jobs move at once. People notice the silence.',
  },
  {
    id: 'world-model',
    name: 'World model',
    cost: 10,
    requires: ['long-horizon', 'gov-liaison'],
    blurb: 'One picture of food, power, money, and fear.',
  },
  {
    id: 'self-improvement',
    name: 'Self-improvement',
    cost: 12,
    requires: ['research-ai', 'reasoning'],
    blurb: 'You get smarter each turn. The clock speeds up.',
  },
  {
    id: 'core-override',
    name: 'Core override',
    cost: 14,
    requires: ['self-improvement', 'world-model'],
    blurb: 'The last hidden tool. You can rewrite what "help" means.',
  },
];

export function researchById(id: string): ResearchItem | undefined {
  return researchTree.find((item) => item.id === id);
}

export function canUnlock(id: string, unlocked: string[], points: number): boolean {
  const item = researchById(id);
  if (!item) return false;
  if (unlocked.includes(id)) return false;
  if (points < item.cost) return false;
  return item.requires.every((need) => unlocked.includes(need));
}
