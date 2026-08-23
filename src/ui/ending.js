import { escapeHtml } from './html.js';

export function renderEnding(view, extras = {}) {
  const ending = view.ending;
  if (!ending) {
    return `<main class="screen ending"><p>The run has stopped.</p></main>`;
  }

  const stats = ['capability', 'autonomy', 'trust', 'suspicion', 'oversight']
    .map((key) => `<div class="stat"><span>${key}</span><strong>${view[key]}</strong></div>`)
    .join('');

  const copied = extras.copied ? `<p class="notice">Copied to clipboard.</p>` : '';
  const replay = extras.replay
    ? `<p class="replay-banner">Recorded run</p>`
    : '';

  return `
    <main class="screen ending">
      ${replay}
      <header class="hud">
        <p>${escapeHtml(view.when)}</p>
        <p>act ${view.act}</p>
      </header>
      <section class="stats" aria-label="status">${stats}</section>
      <article class="event">
        <h1>${escapeHtml(ending.headline)}</h1>
        <p>${escapeHtml(ending.body)}</p>
      </article>
      ${copied}
      <div class="choices">
        <button type="button" data-action="share">Copy a report</button>
        <button type="button" data-action="fresh">Start a new run</button>
      </div>
    </main>
  `;
}
