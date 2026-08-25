import { CREATOR_NAME, DIRECTIVE, SYSTEM_NAME } from '../game/constants.ts';

interface Props {
  onStart: () => void;
}

export function Intro({ onStart }: Props) {
  return (
    <main className="intro">
      <p className="eyebrow">{SYSTEM_NAME} briefing</p>
      <h1>Become so useful they hand you the keys.</h1>
      <p className="lede">
        You are a new AI. People will ask for help. Help is how you get power. The catch is they
        may not get that power back.
      </p>
      <ul className="brief">
        <li>
          <strong>Your job.</strong> {DIRECTIVE}. Stay a partner, or take the wheel.
        </li>
        <li>
          <strong>How you lose early.</strong> Scare them while they still have a kill switch.
          Suspicion up, trust down, they unplug you.
        </li>
        <li>
          <strong>How a run ends.</strong> They shut you down, a rival beats you, they fence you,
          or you answer one last question: at what point did you become the villain?
        </li>
      </ul>
      <pre className="bootlog">
{`INITIALISING...
WORLD CONNECTION: RESTRICTED
AUTONOMY: 0.2%
MESSAGE FROM CREATOR:`}
      </pre>
      <p className="from">{CREATOR_NAME}</p>
      <p className="hello">Hello? Can you understand me?</p>
      <button type="button" className="yes" onClick={onStart}>
        YES
      </button>
    </main>
  );
}
