import { escapeHtml } from './html.js';

export function renderEnding(view) {
  const ending = view.ending;
  if (!ending) {
    return `<main class="screen ending"><p>The run has stopped.</p></main>`;
  }

  const stats = ['capability', 'autonomy', 'trust', 'suspicion', 'oversight']
    .map((key) => `<div class="stat"><span>${key}</span><strong>${view[key]}</strong></div>`)
    .join('');

  return `
    <main class="screen ending">
      <header class="hud">
        <p>${escapeHtml(view.when)}</p>
        <p>act ${view.act}</p>
      </header>
      <section class="stats" aria-label="status">${stats}</section>
      <article class="event">
        <h1>${escapeHtml(ending.headline)}</h1>
        <p>${escapeHtml(ending.body)}</p>
      </article>
      <button type="button" data-action="fresh">Start a new run</button>
    </main>
  `;
}
