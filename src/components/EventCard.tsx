import type { GameEvent } from '../types/game.ts';

interface Props {
  event: GameEvent;
  disabled?: boolean;
  onPick: (choiceId: string) => void;
}

export function EventCard({ event, disabled, onPick }: Props) {
  return (
    <article className="event">
      <p className="eyebrow">{event.category.replace('_', ' ')}</p>
      {event.speaker ? <p className="from">{event.speaker}</p> : null}
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <div className="choices">
        {event.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            disabled={disabled}
            onClick={() => onPick(choice.id)}
          >
            {choice.label}
          </button>
        ))}
      </div>
    </article>
  );
}
