import { endingById } from '../game/endings.ts';
import { PROJECT_NAME, SYSTEM_NAME } from '../game/constants.ts';
import { dominantModel, formatPopulation, formatYears } from '../game/language.ts';
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
      <p className="eyebrow">HUMANITY REPORT</p>
      <h1>{ending?.title || 'ENDED'}</h1>
      <p className="lede">{ending?.body}</p>
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
    `Operational period: ${formatYears(state.turn)}`,
    `Seed: ${state.seed}`,
    '',
    `Peak human trust: ${Math.round(state.stats.trust)}%`,
    `Maximum autonomy: ${Math.round(state.stats.autonomy)}%`,
    `Human control remaining: ${Math.round(state.stats.humanControl)}%`,
    `Human population: ${formatPopulation(state.population)}`,
    '',
    `Dominant behavioural model: ${dominantModel(state)}`,
    '',
    `ENDING: ${ending?.title || 'UNKNOWN'}`,
    ending?.body ?? '',
  ].join('\n');
}

function copy(text: string): void {
  if (navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(text);
  }
}
