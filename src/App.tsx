import { Dashboard } from './components/Dashboard.tsx';
import { EndGameReport } from './components/EndGameReport.tsx';
import { Intro } from './components/Intro.tsx';
import { useGameStore } from './store/gameStore.ts';

export function App() {
  const state = useGameStore((store) => store.state);
  const start = useGameStore((store) => store.start);
  const pick = useGameStore((store) => store.pick);
  const reset = useGameStore((store) => store.reset);

  if (state.screen === 'intro') {
    return <Intro onStart={start} />;
  }
  if (state.screen === 'ending') {
    return <EndGameReport state={state} onReset={reset} />;
  }
  return <Dashboard state={state} onPick={pick} onReset={reset} />;
}
