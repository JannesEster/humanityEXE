import { PROJECT_NAME } from './config.js';
import { mulberry32 } from './sim/rng.js';
import { createInitialState, STATE_VERSION } from './sim/state.js';
import { reduce } from './sim/reduce.js';
import { project } from './sim/project.js';
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
  const rng = mulberry32(state.seed + state.turn);
  const result = reduce(state, action, rng);
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
  if (view.screen === 'ending') {
    root.innerHTML = renderEnding(view);
    return;
  }
  root.innerHTML = renderBoot();
}

function onClick(event) {
  const start = event.target.closest('[data-action="start"]');
  if (start) {
    dispatch({ type: 'start' });
    return;
  }
  const fresh = event.target.closest('[data-action="fresh"]');
  if (fresh) {
    dispatch({ type: 'fresh' });
    return;
  }
  const choice = event.target.closest('[data-choice]');
  if (choice) {
    dispatch({
      type: 'choose',
      choiceId: choice.getAttribute('data-choice'),
      eventId: state.eventId,
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
  if (state.screen === 'boot' && (event.key === 'Enter' || event.key === '1')) {
    dispatch({ type: 'start' });
    return;
  }
  if (state.screen === 'play') {
    const view = project(state);
    const index = Number(event.key) - 1;
    const picked = view.event?.choices[index];
    if (picked) {
      dispatch({ type: 'choose', choiceId: picked.id, eventId: view.event.id });
    }
  }
}

function save() {
  const payload = JSON.stringify(state);
  window.localStorage.setItem(SAVE_KEY, payload);
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
  if (!parsed || parsed.version !== STATE_VERSION) {
    return 'mismatch';
  }
  return parsed;
}

function newSeed() {
  const bits = new Uint32Array(1);
  window.crypto.getRandomValues(bits);
  return bits[0] || 1;
}

const mount = document.getElementById('app');
if (mount) {
  boot(mount);
}
