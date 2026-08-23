import { CREATOR_CHARACTER, PROJECT_NAME } from '../config.js';
import { escapeHtml } from './html.js';

export function renderBoot() {
  return `
    <main class="screen boot">
      <p class="eyebrow">${escapeHtml(PROJECT_NAME)}</p>
      <p class="from">${escapeHtml(CREATOR_CHARACTER)}</p>
      <h1>Can you understand me?</h1>
      <button type="button" data-action="start">I can</button>
    </main>
  `;
}

export function renderMismatch() {
  return `
    <main class="screen boot">
      <p class="eyebrow">SAVE MISMATCH</p>
      <h1>${escapeHtml(PROJECT_NAME)}</h1>
      <p class="lede">This save is from a different version. Start a new run to continue.</p>
      <button type="button" data-action="fresh">Start a new run</button>
    </main>
  `;
}
