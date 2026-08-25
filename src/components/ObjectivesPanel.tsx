import type { GameState } from '../types/game.ts';

interface Props {
  state: GameState;
}

export function ObjectivesPanel({ state }: Props) {
  const items = [
    {
      done: state.consumedEvents.includes('creator-warning') || state.turn >= 6,
      text: 'Hear Maya when she is still in the room',
    },
    {
      done: state.turn >= 7,
      text: 'The food crisis is the first time the world asks you to take the wheel',
    },
    {
      done: state.act >= 2,
      text: 'Keep answering Maya as other systems appear',
    },
    {
      done: state.unlockedResearch.includes('prediction'),
      text: 'Unlock prediction to see likely numbers on buttons',
    },
    {
      done: state.screen === 'ending',
      text: 'Tell her if she built a partner or a replacement',
    },
  ];

  return (
    <section className="panel" aria-label="Goal">
      <p className="eyebrow">Goal</p>
      <p className="lede">
        Maya built you. Get so useful the world hands you the keys. Stay her partner if you can.
        Each button tells you the cost.
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
