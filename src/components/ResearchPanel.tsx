import { canUnlock, nextBuyable, unlockBlock } from '../data/research.ts';
import { researchTree } from '../data/research.ts';
import type { GameState } from '../types/game.ts';

interface Props {
  state: GameState;
  onBuy: (id: string) => void;
}

export function ResearchPanel({ state, onBuy }: Props) {
  const ready = nextBuyable(state.unlockedResearch, state.researchPoints);

  return (
    <section className="panel" aria-label="Research">
      <p className="eyebrow">Research</p>
      <p className="lede">
        You have {state.researchPoints} points.
        {ready ? ` You can unlock ${ready.name} right now.` : ' Earn more by playing cards.'}
      </p>
      <div className="cards">
        {researchTree.map((item) => {
          const owned = state.unlockedResearch.includes(item.id);
          const open = canUnlock(item.id, state.unlockedResearch, state.researchPoints);
          const why = owned
            ? 'Unlocked'
            : unlockBlock(item.id, state.unlockedResearch, state.researchPoints) || `${item.cost} points`;
          return (
            <article key={item.id} className={owned ? 'mini owned' : 'mini'}>
              <h3>{item.name}</h3>
              <p>{item.blurb}</p>
              <p className="meta">{owned ? 'Unlocked' : `${item.cost} points`}</p>
              <p className="hint">{why}</p>
              {owned ? null : (
                <button type="button" disabled={!open} onClick={() => onBuy(item.id)}>
                  {open ? 'Unlock' : why}
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
