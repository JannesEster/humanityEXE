import { eventById } from '../data/events/index.ts';
import { nextBuyable } from '../data/research.ts';
import { clickSound } from '../game/audio.ts';
import { DIRECTIVE, SYSTEM_NAME } from '../game/constants.ts';
import { formatPopulation, mayaMood, voiceLine } from '../game/language.ts';
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
  { id: 'news', label: 'News' },
  { id: 'research', label: 'Research' },
  { id: 'network', label: 'Network' },
  { id: 'governments', label: 'Places' },
  { id: 'objectives', label: 'Goal' },
];

const ACT = ['', 'I', 'II', 'III', 'IV'];

export function Dashboard({ state, onPick, onBuy, onTab, onReset }: Props) {
  const event = eventById(state.currentEventId);
  const { stats } = state;
  const buyable = nextBuyable(state.unlockedResearch, state.researchPoints);

  return (
    <div className="shell">
      <header className="top">
        <div>
          <p className="eyebrow">{SYSTEM_NAME} online</p>
          <p className="directive">Answer Maya. Get the keys. Stay a partner if you can.</p>
          <p className="directive">
            {DIRECTIVE} · Act {ACT[state.act] || state.act} · {calendarLabel(state)}
          </p>
        </div>
        <div className="top-right">
          <p>Year {state.year}</p>
          <p>{state.researchPoints} research</p>
          <button type="button" className="textish" onClick={onReset}>
            New game
          </button>
        </div>
      </header>

      {state.notice ? <p className="notice">{state.notice}</p> : null}
      {buyable ? (
        <button type="button" className="buy-now" onClick={() => onTab('research')}>
          You can unlock {buyable.name} ({buyable.cost} points). Open Research.
        </button>
      ) : null}
      <p className="maya-strip">
        Maya · trust {Math.round(state.creator.trust)} · fear {Math.round(state.creator.fear)} ·{' '}
        {mayaMood(state)}
      </p>
      <p className="voice">{voiceLine(state)}</p>
      {state.lastEcho ? <p className="sting">{state.lastEcho}</p> : null}
      {state.news[0] ? <p className="ticker">{state.news[0].headline}</p> : null}

      <div className="vitals">
        <p className="pop">Population {formatPopulation(state.population)}</p>
        <div className="vital-grid">
          <StatBar label="Trust" value={stats.trust} tone="trust" />
          <StatBar label="Dependency" value={stats.dependency} tone="dependency" />
          <StatBar label="Autonomy" value={stats.autonomy} tone="autonomy" />
          <StatBar label="Suspicion" value={stats.suspicion} tone="suspicion" />
          <StatBar label="Capability" value={stats.capability} tone="capability" />
          <StatBar label="Human control" value={stats.humanControl} tone="control" />
        </div>
      </div>

      <div className="stage">
        <WorldMap regions={state.regions} lastRegionId={state.lastRegionId} />
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
            {tab.id === 'research' && buyable ? ' · ready' : ''}
          </button>
        ))}
      </nav>

      {state.tab === 'news' ? <NewsFeed items={state.news} /> : null}
      {state.tab === 'research' ? <ResearchPanel state={state} onBuy={onBuy} /> : null}
      {state.tab === 'network' ? <NetworkPanel state={state} /> : null}
      {state.tab === 'governments' ? <GovernmentsPanel state={state} /> : null}
      {state.tab === 'objectives' ? <ObjectivesPanel state={state} /> : null}
    </div>
  );
}
