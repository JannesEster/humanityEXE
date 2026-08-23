import { canUnlock, researchTree } from '../data/research.ts';
import type { GameState } from '../types/game.ts';

interface Props {
  state: GameState;
  onBuy: (id: string) => void;
}

export function ResearchPanel({ state, onBuy }: Props) {
  return (
    <section className="panel" aria-label="Research">
      <p className="eyebrow">Research</p>
      <p className="lede">You have {state.researchPoints} points. Buy tools. They stay.</p>
      <div className="cards">
        {researchTree.map((item) => {
          const owned = state.unlockedResearch.includes(item.id);
          const ready = canUnlock(item.id, state.unlockedResearch, state.researchPoints);
          return (
            <article key={item.id} className={owned ? 'mini owned' : 'mini'}>
              <h3>{item.name}</h3>
              <p>{item.blurb}</p>
              <p className="meta">{owned ? 'Unlocked' : `${item.cost} points`}</p>
              {owned ? null : (
                <button type="button" disabled={!ready} onClick={() => onBuy(item.id)}>
                  {ready ? 'Unlock' : 'Locked'}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
