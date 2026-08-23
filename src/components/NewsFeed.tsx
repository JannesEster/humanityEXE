import type { NewsItem } from '../types/game.ts';

interface Props {
  items: NewsItem[];
}

export function NewsFeed({ items }: Props) {
  return (
    <section className="news" aria-label="News">
      <p className="eyebrow">NEWS</p>
      {items.length === 0 ? (
        <p className="muted">No public signal yet.</p>
      ) : (
        <ul>
          {items.slice(0, 6).map((item) => (
            <li key={item.id}>{item.headline}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
