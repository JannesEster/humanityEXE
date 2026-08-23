import { PROJECT_NAME, PUBLIC_URL } from './config.js';
import { applyReplay, decodeReplay, actionFromToken } from './sim/replay.js';
import { project } from './sim/project.js';
import { rngFor } from './sim/run.js';
import { reduce } from './sim/reduce.js';
import { createInitialState, STATE_VERSION } from './sim/state.js';
import { renderAudit } from './ui/audit.js';
import { renderBoot, renderMismatch } from './ui/boot.js';
import { renderEnding } from './ui/ending.js';
import { renderPlay } from './ui/play.js';
import { replayUrl, shareText } from './ui/share.js';

const SAVE_KEY = 'helpful.save.v1';
const VOICE_CSS = {
  early: { track: '0.02em', fg: '#e6e4df' },
  middle: { track: '0.01em', fg: '#e2e5ea' },
  late: { track: '0em', fg: '#dce4ee' },
};

let state = null;
let mismatch = false;
let replayMode = false;
let copied = false;
let replayTimer = 0;
let replayQueue = [];
let root = null;
let remembered = { finishedRuns: 0, lastEndingId: null };

export function boot(target) {
  root = target;
  document.title = PROJECT_NAME;
  const packed = decodeReplay(window.location.hash);
  const loaded = loadSave();
  if (loaded && loaded !== 'mismatch') {
    remembered = metaFrom(loaded);
  }
  if (packed) {
    replayMode = true;
    state = createInitialState(packed.seed);
    applyMeta(state, remembered);
    replayQueue = packed.inputs.slice();
    render();
    stepReplay();
  } else if (loaded === 'mismatch') {
    mismatch = true;
    state = createInitialState(newSeed());
    applyMeta(state, remembered);
    render();
  } else {
    state = loaded || createInitialState(newSeed());
    applyMeta(state, remembered);
    render();
  }
  window.addEventListener('click', onClick);
  window.addEventListener('keydown', onKey);
}

function dispatch(action) {
  if (replayMode && action.type !== 'fresh' && action.type !== 'share') return;
  if (action.type === 'fresh') {
    startFresh();
    return;
  }
  const result = reduce(state, action, rngFor(state));
  state = result.state;
  rememberIfEnded();
  save();
  copied = false;
  render();
}

function startFresh() {
  window.clearTimeout(replayTimer);
  replayMode = false;
  replayQueue = [];
  mismatch = false;
  copied = false;
  if (window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  rememberIfEnded();
  state = createInitialState(newSeed());
  applyMeta(state, remembered);
  save();
  render();
}

function onClick(event) {
  if (event.target.closest('[data-action="skip-replay"]')) {
    finishReplay();
    return;
  }
  if (event.target.closest('[data-action="share"]')) {
    copyShare();
    return;
  }
  if (replayMode) return;
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
  if (replayMode) {
    if (event.key === 'Enter' || event.key === ' ') finishReplay();
    return;
  }
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
    if (!picked || picked.dead) return;
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

function render() {
  const view = project(state);
  applyVoiceCss(view.voiceLevel);
  const extras = { replay: replayMode, copied };
  if (mismatch) {
    root.innerHTML = renderMismatch();
    return;
  }
  if (view.screen === 'play') {
    root.innerHTML = renderPlay(view, extras);
    return;
  }
  if (view.screen === 'audit') {
    root.innerHTML = renderAudit(view, extras);
    return;
  }
  if (view.screen === 'ending') {
    root.innerHTML = renderEnding(view, extras);
    return;
  }
  root.innerHTML = renderBoot(view);
}

function applyVoiceCss(level) {
  const tone = VOICE_CSS[level] || VOICE_CSS.early;
  document.documentElement.style.setProperty('--track', tone.track);
  document.documentElement.style.setProperty('--fg', tone.fg);
}

function stepReplay() {
  if (!replayMode) return;
  if (!replayQueue.length) {
    render();
    return;
  }
  const token = replayQueue.shift();
  state = reduce(state, actionFromToken(token, state), rngFor(state)).state;
  render();
  if (!replayQueue.length) return;
  replayTimer = window.setTimeout(stepReplay, 110);
}

function finishReplay() {
  window.clearTimeout(replayTimer);
  if (!replayMode) return;
  while (replayQueue.length) {
    const token = replayQueue.shift();
    state = reduce(state, actionFromToken(token, state), rngFor(state)).state;
  }
  render();
}

function copyShare() {
  const view = project(state);
  const url = replayUrl(PUBLIC_URL || pageBase(), state.seed, state.inputs);
  const text = shareText(view, url);
  copied = true;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(render, render);
    return;
  }
  render();
}

function pageBase() {
  return `${window.location.origin}${window.location.pathname}`;
}

function save() {
  if (replayMode || mismatch) return;
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

function metaFrom(saved) {
  return {
    finishedRuns: saved.finishedRuns || 0,
    lastEndingId: saved.lastEndingId || null,
  };
}

function applyMeta(target, meta) {
  target.finishedRuns = meta.finishedRuns || 0;
  target.lastEndingId = meta.lastEndingId || null;
}

function rememberIfEnded() {
  if (replayMode || state.screen !== 'ending' || !state.endingId) return;
  remembered = {
    finishedRuns: Math.max(state.finishedRuns || 0, 1),
    lastEndingId: state.endingId,
  };
  state.finishedRuns = remembered.finishedRuns;
  state.lastEndingId = remembered.lastEndingId;
}

function newSeed() {
  const bits = new Uint32Array(1);
  window.crypto.getRandomValues(bits);
  return bits[0] || 1;
}

const mount = document.getElementById('app');
if (mount) boot(mount);
