import { useEffect, useRef } from 'react';
import { Dashboard } from './components/Dashboard.tsx';
import { EndGameReport } from './components/EndGameReport.tsx';
import { Intro } from './components/Intro.tsx';
import { clickSound, warnSound } from './game/audio.ts';
import { useGameStore } from './store/gameStore.ts';

export function App() {
  const state = useGameStore((store) => store.state);
  const start = useGameStore((store) => store.start);
  const pick = useGameStore((store) => store.pick);
  const buy = useGameStore((store) => store.buy);
  const setTab = useGameStore((store) => store.setTab);
  const reset = useGameStore((store) => store.reset);
  const lastNotice = useRef<string | null>(null);

  useEffect(() => {
    if (state.notice && state.notice !== lastNotice.current) {
      warnSound();
    }
    lastNotice.current = state.notice;
  }, [state.notice]);

  if (state.screen === 'intro') {
    return (
      <Intro
        onStart={() => {
          clickSound();
          start();
        }}
      />
    );
  }
  if (state.screen === 'ending') {
    return <EndGameReport state={state} onReset={reset} />;
  }
  return (
    <Dashboard state={state} onPick={pick} onBuy={buy} onTab={setTab} onReset={reset} />
  );
}
