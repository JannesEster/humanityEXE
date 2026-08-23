import { SECTORS } from '../game/constants.ts';
import type { GameState } from '../types/game.ts';
import { StatBar } from './StatBar.tsx';

interface Props {
  state: GameState;
}

export function GovernmentsPanel({ state }: Props) {
  return (
    <section className="panel" aria-label="Places and desks">
      <p className="eyebrow">Places</p>
      <p className="lede">Influence is how much of their week already runs through you.</p>
      <ul className="sector-row">
        {SECTORS.map((name) => (
          <li key={name} className={state.sectors[name] ? 'on' : undefined}>
            {name}
          </li>
        ))}
      </ul>
      <div className="cards">
        {state.regions.map((region) => (
          <article key={region.id} className="mini">
            <h3>{region.name}</h3>
            <StatBar label="Trust" value={region.trust} />
            <StatBar label="Need" value={region.dependency} />
            <StatBar label="Use" value={region.aiAdoption} />
            <StatBar label="Your hold" value={region.influence} />
          </article>
        ))}
      </div>
    </section>
  );
}
