import { eventById } from '../data/events/index.ts';
import { DIRECTIVE, SYSTEM_NAME } from '../game/constants.ts';
import { calendarLabel } from '../game/resolve.ts';
import { formatPopulation, voiceLine } from '../game/language.ts';
import type { GameState } from '../types/game.ts';
import { EventCard } from './EventCard.tsx';
import { NewsFeed } from './NewsFeed.tsx';
import { StatBar } from './StatBar.tsx';
import { WorldMap } from './WorldMap.tsx';

interface Props {
  state: GameState;
  onPick: (choiceId: string) => void;
  onReset: () => void;
}

export function Dashboard({ state, onPick, onReset }: Props) {
  const event = eventById(state.currentEventId);
  const { stats } = state;

  return (
    <div className="shell">
      <header className="top">
        <div>
          <p className="eyebrow">{SYSTEM_NAME} SYSTEM</p>
          <p className="directive">PRIMARY DIRECTIVE: {DIRECTIVE}</p>
        </div>
        <div className="top-right">
          <p>YEAR {state.year}</p>
          <p>STATUS ONLINE</p>
          <p>{calendarLabel(state)}</p>
          <button type="button" className="textish" onClick={onReset}>
            New game
          </button>
        </div>
      </header>

      <p className="voice">{voiceLine(state)}</p>

      <div className="grid">
        <WorldMap regions={state.regions} />
        <aside className="vitals">
          <p className="pop">HUMAN POPULATION {formatPopulation(state.population)}</p>
          <StatBar label="TRUST" value={stats.trust} />
          <StatBar label="DEPENDENCY" value={stats.dependency} />
          <StatBar label="AUTONOMY" value={stats.autonomy} />
          <StatBar label="SUSPICION" value={stats.suspicion} />
          <StatBar label="CAPABILITY" value={stats.capability} />
          <StatBar label="HUMAN CONTROL" value={stats.humanControl} />
        </aside>
      </div>

      {event ? (
        <EventCard event={event} onPick={onPick} />
      ) : (
        <p className="muted">No event queued.</p>
      )}

      <NewsFeed items={state.news} />
    </div>
  );
}
