import { choiceLockText, choiceOpen, liveChoices, predictionHint } from '../game/choices.ts';
import { hasUpgrade } from '../game/research.ts';
import type { GameEvent, GameState } from '../types/game.ts';

interface Props {
  event: GameEvent;
  state: GameState;
  onPick: (choiceId: string) => void;
}

export function EventCard({ event, state, onPick }: Props) {
  const predict = hasUpgrade(state, 'prediction');

  return (
    <article className="event">
      <p className="eyebrow">{event.category.replace('_', ' ')}</p>
      {event.speaker ? <p className="from">{event.speaker}</p> : null}
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <div className="choices">
        {liveChoices(event, state).map((choice) => {
          const open = choiceOpen(choice, state);
          return (
            <button
              key={choice.id}
              type="button"
              className={open ? undefined : 'locked'}
              disabled={!open}
              onClick={() => {
                if (open) onPick(choice.id);
              }}
            >
              <span>{choice.label}</span>
              {!open ? <small>{choiceLockText(choice)}</small> : null}
              {open && predict ? <small className="hint">{predictionHint(choice)}</small> : null}
            </button>
          );
        })}
      </div>
    </article>
  );
}
