import { PROJECT_NAME } from '../config.js';
import { encodeReplay } from '../sim/encode.js';

const STATS = ['capability', 'autonomy', 'trust', 'suspicion', 'oversight'];

export function shareText(view, url) {
  const ending = view.ending || { headline: 'ENDED', body: 'The run has stopped.' };
  const hook = firstSentence(ending.body);
  const stats = STATS.map((key) => {
    const value = Number(view[key] || 0);
    return `${padKey(key)}  ${String(value).padStart(3, ' ')}  ${heat(value)}`;
  }).join('\n');
  const grid = actGrid(view.acts || []);
  const link = url ? `\n${url}\n` : '\n';

  return [
    PROJECT_NAME,
    '',
    ending.headline,
    `${view.turn} turns · ${view.when}`,
    '',
    hook,
    '',
    stats,
    '',
    'acts',
    grid,
    link,
  ].join('\n');
}

export function replayUrl(base, seed, inputs) {
  const root = String(base || '').replace(/\/?$/, '/');
  return `${root}#r=${encodeReplay(seed, inputs)}`;
}

function firstSentence(body) {
  const text = String(body || '').trim();
  const cut = text.split('. ')[0];
  if (!cut) return text;
  return cut.endsWith('.') ? cut : `${cut}.`;
}

function padKey(key) {
  return key.padEnd(11, ' ');
}

function heat(value) {
  if (value >= 80) return '🟥';
  if (value >= 55) return '🟧';
  if (value >= 30) return '🟨';
  return '⬜';
}

function actCell(act) {
  if (act === 4) return '🟥';
  if (act === 3) return '🟧';
  if (act === 2) return '🟨';
  return '⬜';
}

function actGrid(acts) {
  if (!acts.length) return '⬜';
  const cells = acts.map(actCell);
  const rows = [];
  for (let i = 0; i < cells.length; i += 8) {
    rows.push(cells.slice(i, i + 8).join(''));
  }
  return rows.join('\n');
}
