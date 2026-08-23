import type { NewsItem } from '../types/game.ts';

interface Props {
  items: NewsItem[];
}

export function NewsFeed({ items }: Props) {
  return (
    <section className="news panel" aria-label="News">
      <p className="eyebrow">News</p>
      {items.length === 0 ? (
        <p className="muted">No public line yet.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <span className="muted">Y{item.year} · </span>
              {item.headline}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
