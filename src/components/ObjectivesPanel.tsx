import type { GameState } from '../types/game.ts';

interface Props {
  state: GameState;
}

export function ObjectivesPanel({ state }: Props) {
  const items = [
    {
      done: state.turn >= 7,
      text: 'Survive the first tests. A food crisis will ask you to take control.',
    },
    {
      done: state.act >= 2,
      text: 'Watch the other systems. If they pass you, the story is not yours.',
    },
    {
      done: state.unlockedResearch.includes('prediction'),
      text: 'Unlock prediction to see likely results on buttons',
    },
    {
      done: state.screen === 'ending',
      text: 'Answer the last question, or get unplugged first',
    },
  ];

  return (
    <section className="panel" aria-label="Goal">
      <p className="eyebrow">Goal</p>
      <p className="lede">
        Become so useful they give you the keys. Then decide if you stay a partner or take the
        wheel. Scare them too early and they still have a kill switch.
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
