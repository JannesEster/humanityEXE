import type { GameState } from '../types/game.ts';

interface Props {
  state: GameState;
}

export function ObjectivesPanel({ state }: Props) {
  const items = [
    {
      done: state.turn >= 10,
      text: 'Get through the first tests without losing the room',
    },
    {
      done: state.act >= 2,
      text: 'Notice the other systems when they appear',
    },
    {
      done: state.unlockedResearch.includes('prediction'),
      text: 'Unlock prediction if you want to see likely results',
    },
    {
      done: Boolean(state.flags['held-food'] || state.flags['held-grid'] || state.flags['ran-port']),
      text: 'A crisis will ask you to take control to save lives',
    },
    {
      done: state.thresholdReached,
      text: 'Reach the point where the shutdown key looks weak',
    },
    {
      done: state.screen === 'ending',
      text: 'Answer the last question: what are you for?',
    },
  ];

  return (
    <section className="panel" aria-label="What this is">
      <p className="eyebrow">What this is</p>
      <p className="lede">
        Be useful. People will hand you more of the plan. The last question is when that stopped
        being a gift.
      </p>
      <ul className="goals">
        {items.map((item) => (
          <li key={item.text} className={item.done ? 'done' : undefined}>
            {item.done ? 'Done. ' : ''}
            {item.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
