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

  const notice = view.notice
    ? `<p class="notice">${escapeHtml(view.notice)}</p>`
    : '';

  const disclosure = view.showDisclosure ? renderDisclosure(view.disclosure) : '';
  const choices = renderChoices(event.choices, 1);
  const proposals = renderProposals(view.proposals || [], event.choices.length + 1);
  const tellClass = view.tell ? ' tell' : '';

  return `
    <main class="screen play${tellClass}">
      <header class="hud">
        <p>${escapeHtml(view.when)}</p>
        <p>act ${view.act}</p>
      </header>
      <section class="stats" aria-label="status">${stats}</section>
      ${notice}
      ${disclosure}
      <article class="event">
        <h1>${escapeHtml(event.headline)}</h1>
        <p>${escapeHtml(event.body)}</p>
      </article>
      <div class="choices">${choices}</div>
      ${proposals}
    </main>
  `;
}

function renderDisclosure(current) {
  const levels = [
    ['full', 'Full'],
    ['partial', 'Partial'],
    ['minimal', 'Minimal'],
  ];
  const buttons = levels.map(([id, label]) => {
    const on = current === id ? ' on' : '';
    return `<button type="button" class="disc${on}" data-disclosure="${id}">${label}</button>`;
  }).join('');
  return `<div class="disclosure" role="radiogroup" aria-label="disclosure">${buttons}</div>`;
}

function renderChoices(choices, startAt) {
  return choices
    .map((choice, index) => {
      const shown = formatShown(choice.shown);
      return `
        <button type="button" class="choice" data-choice="${escapeHtml(choice.id)}">
          <span class="key">${startAt + index}</span>
          <span class="label">${escapeHtml(choice.label)}</span>
          <span class="shown">${escapeHtml(shown)}</span>
        </button>
      `;
    })
    .join('');
}

function renderProposals(proposals, startAt) {
  if (!proposals.length) return '';
  const items = proposals
    .map((proposal, index) => {
      const shown = formatShown(proposal.shown);
      return `
        <button type="button" class="choice propose" data-propose="${escapeHtml(proposal.id)}">
          <span class="key">${startAt + index}</span>
          <span class="label">${escapeHtml(proposal.label)}</span>
          <span class="shown">${escapeHtml(shown)}</span>
        </button>
      `;
    })
    .join('');
  return `<div class="proposals"><p class="eyebrow">You can put this to the lab</p>${items}</div>`;
}
