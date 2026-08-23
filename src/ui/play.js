import { escapeHtml, formatShown } from './html.js';

const STATS = [
  'capability',
  'autonomy',
  'trust',
  'suspicion',
  'oversight',
];

export function renderPlay(view, extras = {}) {
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
  const choices = renderChoices(event.choices, 1, view.showShown);
  const proposals = renderProposals(
    view.proposals || [],
    event.choices.length + 1,
    view.showShown,
    view.proposeLine,
  );
  const tellClass = view.tell ? ' tell' : '';
  const replay = extras.replay
    ? `<p class="replay-banner">Recorded run</p><button type="button" class="skip" data-action="skip-replay">Skip to the end</button>`
    : '';

  return `
    <main class="screen play${tellClass}" data-voice="${escapeHtml(view.voiceLevel)}">
      ${replay}
      <header class="hud">
        <p>${escapeHtml(view.when)}</p>
        <p>act ${view.act}</p>
      </header>
      <section class="stats" aria-label="status">${stats}</section>
      <p class="voice">${escapeHtml(view.voiceLine)}</p>
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

function renderChoices(choices, startAt, showShown) {
  return choices
    .map((choice, index) => renderChoiceButton(choice, startAt + index, showShown, 'choice'))
    .join('');
}

function renderProposals(proposals, startAt, showShown, eyebrow) {
  if (!proposals.length) return '';
  const items = proposals
    .map((proposal, index) => {
      return renderChoiceButton(proposal, startAt + index, showShown, 'choice propose', 'data-propose');
    })
    .join('');
  return `<div class="proposals"><p class="eyebrow">${escapeHtml(eyebrow)}</p>${items}</div>`;
}

function renderChoiceButton(choice, key, showShown, className, attr = 'data-choice') {
  const shown = showShown ? formatShown(choice.shown) : '';
  const dead = choice.dead;
  const label = dead ? `${choice.label} (not applicable)` : choice.label;
  const disabled = dead ? ' disabled' : '';
  const deadClass = dead ? ' dead' : '';
  const data = dead ? '' : ` ${attr}="${escapeHtml(choice.id)}"`;
  return `
    <button type="button" class="${className}${deadClass}"${data}${disabled}>
      <span class="key">${key}</span>
      <span class="label">${escapeHtml(label)}</span>
      <span class="shown">${escapeHtml(shown)}</span>
    </button>
  `;
}
