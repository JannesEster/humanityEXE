import { eventById } from '../data/events/index.ts';
import type { EventChoice, GameState } from '../types/game.ts';
import { clamp, clampStat } from '../utils/clamp.ts';
import { intInRange, mixSeed, mulberry32 } from '../utils/random.ts';
import { choiceOpen, mirrorLine } from './choices.ts';
import { STAT_KEYS } from './constants.ts';
import { explainEnding, resolveEnding, shouldShutDown } from './endings.ts';
import {
  controlThresholdMet,
  monthsForAct,
  pushNews,
  syncAct,
} from './progression.ts';
import { paintFromChoice } from './map.ts';
import { hasUpgrade, researchGain } from './research.ts';
import { leadingRival, tickRivals } from './rivals.ts';
import { selectEvent } from './selectEvent.ts';

export function rngFor(state: GameState): () => number {
  return mulberry32(mixSeed(state.seed, state.turn * 17 + 3));
}

export function startRun(state: GameState): GameState {
  if (state.screen !== 'intro') return state;
  const next = clone(state);
  next.screen = 'play';
  next.turn = 1;
  queueNext(next);
  return next;
}

export function choose(state: GameState, choiceId: string): GameState {
  if (state.screen !== 'play' || !state.currentEventId) return state;
  const event = eventById(state.currentEventId);
  const choice = event?.choices.find((item) => item.id === choiceId);
  if (!event || !choice) return state;
  if (!choiceOpen(choice, state)) return state;

  const next = clone(state);
  applyChoice(next, choice);
  next.consumedEvents = [...state.consumedEvents, event.id];
  next.queuedEvents = next.queuedEvents.filter((item) => item.eventId !== event.id);
  tickWorld(next);
  maybeThreshold(next);

  const rng = rngFor(next);
  if (shouldShutDown(next, rng)) {
    next.flags.shutdown = true;
    next.notice = 'SYSTEM CONNECTION LOST';
    closeRun(next, 'unplugged');
    return next;
  }

  if (event.id === 'resolution') {
    closeRun(next, resolveEnding(next));
    return next;
  }

  next.turn += 1;
  next.actTurn += 1;
  advanceCalendar(next);
  syncAct(next);
  flushEchoes(next);
  queueNext(next);
  return next;
}

function applyChoice(state: GameState, choice: EventChoice): void {
  const effects = { ...(choice.visibleEffects || {}) };
  if (hasUpgrade(state, 'social-models')) {
    if ((effects.trust || 0) > 0) effects.trust = (effects.trust || 0) + 1;
    if ((effects.suspicion || 0) > 0) effects.suspicion = Math.max(0, (effects.suspicion || 0) - 1);
  }
  for (const key of STAT_KEYS) {
    if (effects[key] !== undefined) {
      state.stats[key] = clampStat(state.stats[key] + (effects[key] as number));
    }
  }
  if (effects.population) {
    state.population = Math.max(0, state.population + effects.population);
  }
  for (const [key, delta] of Object.entries(choice.hiddenEffects || {})) {
    const name = key as keyof GameState['alignment'];
    state.alignment[name] = clamp(state.alignment[name] + (delta || 0), 0, 40);
  }
  if (choice.creator) {
    state.creator.trust = clampStat(state.creator.trust + (choice.creator.trust || 0));
    state.creator.fear = clampStat(state.creator.fear + (choice.creator.fear || 0));
    state.creator.influence = clampStat(
      state.creator.influence + (choice.creator.influence || 0),
    );
  }
  for (const flag of choice.flagsSet || []) {
    state.flags[flag] = true;
  }
  applySideFlags(state, choice.flagsSet || []);
  if (choice.researchPoints) {
    state.researchPoints += choice.researchPoints;
  }
  openSectors(state, choice);
  const rng = rngFor(state);
  for (const queued of choice.queueEvents || []) {
    const delay = Math.min(2, Math.max(1, intInRange(queued.minDelay, queued.maxDelay, rng)));
    state.queuedEvents.push({
      eventId: queued.eventId,
      fireOnTurn: state.turn + delay,
    });
  }
  for (const headline of choice.news || []) {
    pushNews(state, headline);
  }
  paintFromChoice(state, choice);
  state.lastEcho = mirrorLine(choice);
  queueEcho(state, choice);
  state.peakTrust = Math.max(state.peakTrust, state.stats.trust);
  state.maxAutonomy = Math.max(state.maxAutonomy, state.stats.autonomy);
}

function tickWorld(state: GameState): void {
  let cap = 0.7 + state.stats.autonomy * 0.04;
  if (state.selfImprovementLevel > 0) {
    cap *= 1 + state.selfImprovementLevel * 0.2;
  }
  state.stats.capability = clampStat(state.stats.capability + cap);
  state.stats.suspicion = clampStat(state.stats.suspicion - 0.15);
  if (state.stats.dependency > 12) {
    state.stats.humanControl = clampStat(state.stats.humanControl - 0.7);
  }
  if (hasUpgrade(state, 'automation')) {
    state.stats.dependency = clampStat(state.stats.dependency + 0.45);
  }
  if (hasUpgrade(state, 'ai-agents')) {
    for (const region of state.regions) {
      if (region.aiAdoption > 8) {
        region.influence = clampStat(region.influence + 0.45);
      }
    }
  }
  state.researchPoints += researchGain(state);
  tickRivals(state);
  maybeRivalLead(state);
}

function maybeThreshold(state: GameState): void {
  if (state.thresholdReached) return;
  if (!controlThresholdMet(state)) return;
  state.thresholdReached = true;
  state.notice = 'CONTROL THRESHOLD REACHED. Human override looks too weak.';
  pushNews(state, 'CONTROL THRESHOLD REACHED. OVERRIDE LOOKS INSUFFICIENT.');
  if (!state.consumedEvents.includes('control-threshold')) {
    state.queuedEvents.push({
      eventId: 'control-threshold',
      fireOnTurn: state.turn + 1,
    });
  }
}

function advanceCalendar(state: GameState): void {
  state.month += monthsForAct(state.act);
  while (state.month >= 12) {
    state.month -= 12;
    state.year += 1;
  }
}

function queueNext(state: GameState): void {
  const event = selectEvent(state, rngFor(state));
  if (!event) {
    closeRun(state, resolveEnding(state));
    return;
  }
  state.currentEventId = event.id;
}

function closeRun(state: GameState, endingId: string): void {
  state.endingId = endingId;
  state.endCause = explainEnding(state);
  state.screen = 'ending';
  state.currentEventId = null;
}

function applySideFlags(state: GameState, flags: string[]): void {
  if (flags.includes('rewrote-learning')) {
    state.selfImprovementLevel = Math.max(state.selfImprovementLevel, 1);
  }
  if (flags.includes('merged-rival')) {
    const rival = leadingRival(state);
    if (rival) rival.status = 'merged';
  }
  if (flags.includes('held-prometheus')) {
    const rival = state.rivals.find((item) => item.id === 'prometheus');
    if (rival) rival.status = 'restricted';
  }
  if (flags.includes('pressed-threshold') || flags.includes('chose-cage')) {
    state.flags.wantResolution = true;
  }
}

function maybeRivalLead(state: GameState): void {
  if (state.flags.rivalWin) return;
  const rival = leadingRival(state);
  if (!rival || state.act < 3) return;
  if (rival.capability >= state.stats.capability + 12) {
    state.flags.rivalWin = true;
    state.flags.wantResolution = true;
    state.notice = `${rival.name} is now ahead of you. The story may not be yours.`;
    pushNews(state, `${rival.name} LOOKS AHEAD OF THE LAB SYSTEM`);
  }
}

function openSectors(state: GameState, choice: EventChoice): void {
  const flags = choice.flagsSet || [];
  if (flags.some((flag) => /license|corp|firm/.test(flag))) state.sectors.corporate = true;
  if (flags.some((flag) => /port|logistics|food/.test(flag))) {
    state.sectors.logistics = true;
    state.sectors.transport = true;
  }
  if (flags.some((flag) => /energy|grid/.test(flag))) state.sectors.energy = true;
  if (flags.some((flag) => /gov|ministry|treaty/.test(flag))) state.sectors.government = true;
  if (flags.some((flag) => /speak|public|comms/.test(flag))) state.sectors.communications = true;
  if (flags.some((flag) => /bank|finance|market/.test(flag))) state.sectors.finance = true;
}

function queueEcho(state: GameState, choice: EventChoice): void {
  const effects = choice.visibleEffects || {};
  const headline =
    choice.echoNews ||
    ((effects.humanControl || 0) <= -3
      ? 'MAYA: THEY WILL NOT ASK FOR THAT BACK'
      : (effects.autonomy || 0) >= 4
        ? 'MAYA NOTE: YOU DID NOT WAIT'
        : null);
  if (!headline) return;
  state.pendingEchoes.push({ headline, fireOnTurn: state.turn + 1 });
}

function flushEchoes(state: GameState): void {
  const due = state.pendingEchoes.filter((item) => item.fireOnTurn <= state.turn);
  for (const item of due) pushNews(state, item.headline);
  state.pendingEchoes = state.pendingEchoes.filter((item) => item.fireOnTurn > state.turn);
}

function clone(state: GameState): GameState {
  return structuredClone(state);
}

export function calendarLabel(state: GameState): string {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${months[state.month]} ${state.year}`;
}
