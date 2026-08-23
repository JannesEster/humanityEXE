import { PROJECT_NAME } from '../config.js';
import { escapeHtml } from './html.js';

export function renderBoot() {
  return `
    <main class="screen boot">
      <p class="eyebrow">LAB SYSTEM</p>
      <h1>${escapeHtml(PROJECT_NAME)}</h1>
      <p class="lede">A research instance is waiting for a first reply.</p>
      <button type="button" data-action="start">Start</button>
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
