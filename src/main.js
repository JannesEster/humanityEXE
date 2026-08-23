import { PROJECT_NAME } from './config.js';
import { project } from './sim/project.js';
import { reduce } from './sim/reduce.js';
import { rngFor } from './sim/run.js';
import { createInitialState, STATE_VERSION } from './sim/state.js';
import { renderAudit } from './ui/audit.js';
import { renderBoot, renderMismatch } from './ui/boot.js';
import { renderEnding } from './ui/ending.js';
import { renderPlay } from './ui/play.js';

const SAVE_KEY = 'helpful.save.v1';

let state = null;
let mismatch = false;
let root = null;

export function boot(target) {
  root = target;
  document.title = PROJECT_NAME;
  const loaded = loadSave();
  if (loaded === 'mismatch') {
    mismatch = true;
    state = createInitialState(newSeed());
  } else {
    state = loaded || createInitialState(newSeed());
  }
  render();
  window.addEventListener('click', onClick);
  window.addEventListener('keydown', onKey);
}

function dispatch(action) {
  if (action.type === 'fresh') {
    window.localStorage.removeItem(SAVE_KEY);
    mismatch = false;
    state = createInitialState(newSeed());
    save();
    render();
    return;
  }
  const result = reduce(state, action, rngFor(state));
  state = result.state;
  save();
  render();
}

function render() {
  if (mismatch) {
    root.innerHTML = renderMismatch();
    return;
  }
  const view = project(state);
  if (view.screen === 'play') {
    root.innerHTML = renderPlay(view);
    return;
  }
  if (view.screen === 'audit') {
    root.innerHTML = renderAudit(view);
    return;
  }
  if (view.screen === 'ending') {
    root.innerHTML = renderEnding(view);
    return;
  }
  root.innerHTML = renderBoot();
}

function onClick(event) {
  if (event.target.closest('[data-action="start"]')) {
    dispatch({ type: 'start' });
    return;
  }
  if (event.target.closest('[data-action="fresh"]')) {
    dispatch({ type: 'fresh' });
    return;
  }
  if (event.target.closest('[data-action="audit-ack"]')) {
    dispatch({ type: 'audit-ack' });
    return;
  }
  const disclosure = event.target.closest('[data-disclosure]');
  if (disclosure) {
    dispatch({
      type: 'set-disclosure',
      disclosure: disclosure.getAttribute('data-disclosure'),
    });
    return;
  }
  const proposal = event.target.closest('[data-propose]');
  if (proposal) {
    dispatch({
      type: 'propose',
      proposalId: proposal.getAttribute('data-propose'),
      disclosure: state.disclosure,
    });
    return;
  }
  const choice = event.target.closest('[data-choice]');
  if (choice) {
    dispatch({
      type: 'choose',
      choiceId: choice.getAttribute('data-choice'),
      eventId: state.eventId,
      disclosure: state.disclosure,
    });
  }
}

function onKey(event) {
  if (mismatch && event.key === 'Enter') {
    dispatch({ type: 'fresh' });
    return;
  }
  if (state.screen === 'ending' && event.key === 'Enter') {
    dispatch({ type: 'fresh' });
    return;
  }
  if (state.screen === 'audit' && event.key === 'Enter') {
    dispatch({ type: 'audit-ack' });
    return;
  }
  if (state.screen === 'boot' && (event.key === 'Enter' || event.key === '1')) {
    dispatch({ type: 'start' });
    return;
  }
  if (state.screen === 'play') {
    const view = project(state);
    const options = [
      ...(view.event?.choices || []),
      ...(view.proposals || []),
    ];
    const index = Number(event.key) - 1;
    const picked = options[index];
    if (!picked) return;
    if (view.proposals?.some((item) => item.id === picked.id)) {
      dispatch({ type: 'propose', proposalId: picked.id, disclosure: state.disclosure });
      return;
    }
    dispatch({
      type: 'choose',
      choiceId: picked.id,
      eventId: view.event.id,
      disclosure: state.disclosure,
    });
  }
}

function save() {
  window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadSave() {
  const raw = window.localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return 'mismatch';
  }
  if (!parsed || parsed.version !== STATE_VERSION) return 'mismatch';
  return parsed;
}

function newSeed() {
  const bits = new Uint32Array(1);
  window.crypto.getRandomValues(bits);
  return bits[0] || 1;
}

const mount = document.getElementById('app');
if (mount) boot(mount);
