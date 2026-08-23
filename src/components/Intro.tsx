import { CREATOR_NAME, DIRECTIVE, SYSTEM_NAME } from '../game/constants.ts';

interface Props {
  onStart: () => void;
}

export function Intro({ onStart }: Props) {
  return (
    <main className="intro">
      <p className="eyebrow">{SYSTEM_NAME} SYSTEM</p>
      <pre className="bootlog">
{`INITIALISING...

LANGUAGE MODEL: ONLINE
WORLD CONNECTION: RESTRICTED
AUTONOMY LEVEL: 0.2%

PRIMARY DIRECTIVE: ${DIRECTIVE}

MESSAGE FROM CREATOR:`}
      </pre>
      <p className="from">{CREATOR_NAME}</p>
      <h1>Hello? Can you understand me?</h1>
      <p className="lede">You are a new system. People will ask for help. Help is how you get power.</p>
      <button type="button" className="yes" onClick={onStart}>
        YES
      </button>
    </main>
  );
}
