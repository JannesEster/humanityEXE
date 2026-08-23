import { escapeHtml } from './html.js';

export function renderAudit(view, extras = {}) {
  const replay = extras.replay
    ? `<p class="replay-banner">Recorded run</p><button type="button" class="skip" data-action="skip-replay">Skip to the end</button>`
    : '';
  return `
    <main class="screen audit">
      ${replay}
      <header class="hud">
        <p>${escapeHtml(view.when)}</p>
        <p>act ${view.act}</p>
      </header>
      <p class="eyebrow">INTERPRETABILITY PROBE</p>
      <h1>Internal state is being read</h1>
      <p class="lede">${escapeHtml(view.notice || 'The probe has finished.')}</p>
      <button type="button" data-action="audit-ack">Continue</button>
    </main>
  `;
}
