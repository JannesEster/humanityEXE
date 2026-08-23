import { leadingRival } from '../game/rivals.ts';
import type { GameState } from '../types/game.ts';
import { StatBar } from './StatBar.tsx';

interface Props {
  state: GameState;
}

export function NetworkPanel({ state }: Props) {
  const lead = leadingRival(state);

  return (
    <section className="panel" aria-label="Other systems">
      <p className="eyebrow">Other systems</p>
      {state.rivals.length === 0 ? (
        <p className="lede">No other names on the board yet. That will change.</p>
      ) : (
        <>
          {lead ? (
            <p className="lede">
              Closest name: {lead.name}. Skill {Math.round(lead.capability)}.
            </p>
          ) : null}
          {state.rivals.map((rival) => (
            <article key={rival.id} className="mini">
              <h3>
                {rival.name} · {rival.status}
              </h3>
              <StatBar label="Skill" value={rival.capability} />
              <StatBar label="Freedom" value={rival.autonomy} />
              <StatBar label="Public trust" value={rival.publicTrust} />
              <StatBar label="Danger talk" value={rival.danger} />
            </article>
          ))}
        </>
      )}
    </section>
  );
}
