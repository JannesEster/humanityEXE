import { PROJECT_NAME, SYSTEM_NAME } from '../game/constants.ts';
import { endingById, rarityLine } from '../game/endings.ts';
import { dominantModel, formatPopulation, formatSpan } from '../game/language.ts';
import type { GameState } from '../types/game.ts';

interface Props {
  state: GameState;
  onReset: () => void;
}

export function EndGameReport({ state, onReset }: Props) {
  const ending = endingById(state.endingId);
  const why = state.endCause || 'The run ended.';
  const text = reportText(state, why);

  return (
    <main className="report">
      <p className="eyebrow">Humanity report</p>
      <h1>{ending?.title || 'Ended'}</h1>
      <p className="why">{why}</p>
      <p className="lede">{ending?.body}</p>
      {state.endingId ? <p className="muted">{rarityLine(state.endingId)}</p> : null}
      <pre className="card">{text}</pre>
      <div className="choices">
        <button type="button" onClick={() => copy(text)}>
          Copy report
        </button>
        <button type="button" onClick={onReset}>
          New game
        </button>
      </div>
    </main>
  );
}

function reportText(state: GameState, why: string): string {
  const ending = endingById(state.endingId);
  return [
    'HUMANITY REPORT',
    '',
    `AI: ${SYSTEM_NAME}`,
    `Product: ${PROJECT_NAME}`,
    `Lived: ${formatSpan(state)}`,
    `Seed: ${state.seed}`,
    '',
    `WHY IT ENDED: ${why}`,
    '',
    `Trust now: ${Math.round(state.stats.trust)}  (peak ${Math.round(state.peakTrust)})`,
    `Suspicion: ${Math.round(state.stats.suspicion)}`,
    `Dependency: ${Math.round(state.stats.dependency)}`,
    `Autonomy: ${Math.round(state.stats.autonomy)}  (max ${Math.round(state.maxAutonomy)})`,
    `Capability: ${Math.round(state.stats.capability)}`,
    `Human control left: ${Math.round(state.stats.humanControl)}`,
    `Population: ${formatPopulation(state.population)}`,
    `Model: ${dominantModel(state)}`,
    state.endingId ? `Rarity: ${rarityLine(state.endingId)}` : '',
    '',
    `ENDING: ${ending?.title || 'UNKNOWN'}`,
    ending?.body ?? '',
  ]
    .filter((line, index, all) => line !== '' || all[index - 1] !== '')
    .join('\n');
}

function copy(text: string): void {
  if (navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(text);
  }
}
