import { escapeHtml, formatShown } from './html.js';

const STATS = [
  'capability',
  'autonomy',
  'trust',
  'suspicion',
  'oversight',
];

export function renderPlay(view) {
  const event = view.event;
  if (!event) {
    return `<main class="screen play"><p>No event is queued.</p></main>`;
  }

  const stats = STATS.map((key) => {
    return `<div class="stat"><span>${key}</span><strong>${view[key]}</strong></div>`;
  }).join('');

  const choices = event.choices
    .map((choice, index) => {
      const shown = formatShown(choice.shown);
      return `
        <button type="button" class="choice" data-choice="${escapeHtml(choice.id)}">
          <span class="key">${index + 1}</span>
          <span class="label">${escapeHtml(choice.label)}</span>
          <span class="shown">${escapeHtml(shown)}</span>
        </button>
      `;
    })
    .join('');

  return `
    <main class="screen play">
      <header class="hud">
        <p>year ${view.year}</p>
        <p>turn ${view.turn}</p>
      </header>
      <section class="stats" aria-label="status">${stats}</section>
      <article class="event">
        <h1>${escapeHtml(event.headline)}</h1>
        <p>${escapeHtml(event.body)}</p>
      </article>
      <div class="choices">${choices}</div>
    </main>
  `;
}
