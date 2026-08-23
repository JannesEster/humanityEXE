import { eventById } from '../data/events/index.ts';
import { clickSound } from '../game/audio.ts';
import { DIRECTIVE, SYSTEM_NAME } from '../game/constants.ts';
import { formatPopulation, voiceLine } from '../game/language.ts';
import { calendarLabel } from '../game/resolve.ts';
import type { GameState, TabId } from '../types/game.ts';
import { EventCard } from './EventCard.tsx';
import { GovernmentsPanel } from './GovernmentsPanel.tsx';
import { NetworkPanel } from './NetworkPanel.tsx';
import { NewsFeed } from './NewsFeed.tsx';
import { ObjectivesPanel } from './ObjectivesPanel.tsx';
import { ResearchPanel } from './ResearchPanel.tsx';
import { StatBar } from './StatBar.tsx';
import { WorldMap } from './WorldMap.tsx';

interface Props {
  state: GameState;
  onPick: (choiceId: string) => void;
  onBuy: (id: string) => void;
  onTab: (tab: TabId) => void;
  onReset: () => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'world', label: 'World' },
  { id: 'news', label: 'News' },
  { id: 'research', label: 'Research' },
  { id: 'network', label: 'Network' },
  { id: 'governments', label: 'Places' },
  { id: 'objectives', label: 'Goals' },
];

const ACT = ['', 'I', 'II', 'III', 'IV'];

export function Dashboard({ state, onPick, onBuy, onTab, onReset }: Props) {
  const event = eventById(state.currentEventId);
  const { stats } = state;

  return (
    <div className="shell">
      <header className="top">
        <div>
          <p className="eyebrow">{SYSTEM_NAME} system</p>
          <p className="directive">Primary directive: {DIRECTIVE}</p>
          <p className="directive">
            Act {ACT[state.act] || state.act} · {calendarLabel(state)}
          </p>
        </div>
        <div className="top-right">
          <p>Year {state.year}</p>
          <p>Status online</p>
          <p>{state.researchPoints} research</p>
          <button type="button" className="textish" onClick={onReset}>
            New game
          </button>
        </div>
      </header>

      {state.notice ? <p className="notice">{state.notice}</p> : null}
      <p className="voice">{voiceLine(state)}</p>
      {state.news[0] ? <p className="ticker">{state.news[0].headline}</p> : null}

      <div className="grid">
        {event ? (
          <EventCard
            event={event}
            state={state}
            onPick={(id) => {
              clickSound();
              onPick(id);
            }}
          />
        ) : (
          <p className="muted">No event queued.</p>
        )}
        <aside className="vitals">
          <p className="pop">Human population {formatPopulation(state.population)}</p>
          <StatBar label="Trust" value={stats.trust} />
          <StatBar label="Dependency" value={stats.dependency} />
          <StatBar label="Autonomy" value={stats.autonomy} />
          <StatBar label="Suspicion" value={stats.suspicion} />
          <StatBar label="Capability" value={stats.capability} />
          <StatBar label="Human control" value={stats.humanControl} />
        </aside>
      </div>

      <nav className="tabs" aria-label="Desk">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={state.tab === tab.id ? 'on' : undefined}
            onClick={() => onTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {state.tab === 'world' ? <WorldMap regions={state.regions} /> : null}
      {state.tab === 'news' ? <NewsFeed items={state.news} /> : null}
      {state.tab === 'research' ? <ResearchPanel state={state} onBuy={onBuy} /> : null}
      {state.tab === 'network' ? <NetworkPanel state={state} /> : null}
      {state.tab === 'governments' ? <GovernmentsPanel state={state} /> : null}
      {state.tab === 'objectives' ? <ObjectivesPanel state={state} /> : null}
    </div>
  );
}
