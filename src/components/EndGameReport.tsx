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
  const text = reportText(state);

  return (
    <main className="report">
      <p className="eyebrow">Humanity report</p>
      <h1>{ending?.title || 'Ended'}</h1>
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

function reportText(state: GameState): string {
  const ending = endingById(state.endingId);
  return [
    'HUMANITY REPORT',
    '',
    `AI: ${SYSTEM_NAME}`,
    `Product: ${PROJECT_NAME}`,
    `Lived: ${formatSpan(state)}`,
    `Seed: ${state.seed}`,
    '',
    `Peak trust: ${Math.round(state.peakTrust)}`,
    `Maximum autonomy: ${Math.round(state.maxAutonomy)}`,
    `Human control remaining: ${Math.round(state.stats.humanControl)}`,
    `Human population: ${formatPopulation(state.population)}`,
    '',
    `Dominant model: ${dominantModel(state)}`,
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
