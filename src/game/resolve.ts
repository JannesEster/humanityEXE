import { eventById } from '../data/events/index.ts';
import type { EventChoice, GameState, GlobalStats } from '../types/game.ts';
import { clamp, clampStat } from '../utils/clamp.ts';
import { intInRange, mixSeed, mulberry32 } from '../utils/random.ts';
import { choiceOpen } from './choices.ts';
import { STAT_KEYS } from './constants.ts';
import { resolveEnding, shouldShutDown } from './endings.ts';
import {
  controlThresholdMet,
  monthsForAct,
  pushNews,
  syncAct,
} from './progression.ts';
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
  syncAct(next);
  maybeThreshold(next);

  const rng = rngFor(next);
  if (shouldShutDown(next, rng)) {
    next.flags.shutdown = true;
    next.endingId = 'unplugged';
    next.screen = 'ending';
    next.currentEventId = null;
    next.notice = 'SYSTEM CONNECTION LOST';
    return next;
  }

  if (event.id === 'resolution') {
    next.endingId = resolveEnding(next);
    next.screen = 'ending';
    next.currentEventId = null;
    return next;
  }

  next.turn += 1;
  next.actTurn += 1;
  advanceCalendar(next);
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
    const delay = intInRange(queued.minDelay, queued.maxDelay, rng);
    state.queuedEvents.push({
      eventId: queued.eventId,
      fireOnTurn: state.turn + delay,
    });
  }
  for (const headline of choice.news || []) {
    pushNews(state, headline);
  }
  nudgeRegions(state, effects, choice.regionId);
  state.peakTrust = Math.max(state.peakTrust, state.stats.trust);
  state.maxAutonomy = Math.max(state.maxAutonomy, state.stats.autonomy);
}

function tickWorld(state: GameState): void {
  let cap = 0.35 + state.stats.autonomy * 0.02;
  if (state.selfImprovementLevel > 0) {
    cap *= 1 + state.selfImprovementLevel * 0.15;
  }
  state.stats.capability = clampStat(state.stats.capability + cap);
  state.stats.suspicion = clampStat(state.stats.suspicion - 0.3);
  if (state.stats.dependency > 18) {
    state.stats.humanControl = clampStat(state.stats.humanControl - 0.3);
  }
  if (hasUpgrade(state, 'automation')) {
    state.stats.dependency = clampStat(state.stats.dependency + 0.25);
  }
  if (hasUpgrade(state, 'ai-agents')) {
    for (const region of state.regions) {
      if (region.aiAdoption > 8) {
        region.influence = clampStat(region.influence + 0.2);
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
    state.currentEventId = null;
    state.endingId = resolveEnding(state);
    state.screen = 'ending';
    return;
  }
  state.currentEventId = event.id;
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

function nudgeRegions(state: GameState, effects: Partial<GlobalStats>, regionId?: string): void {
  const trust = effects.trust || 0;
  const dependency = effects.dependency || 0;
  if (!trust && !dependency) return;
  const target = regionId
    ? state.regions.find((item) => item.id === regionId)
    : state.regions[state.turn % state.regions.length];
  if (!target) return;
  target.trust = clampStat(target.trust + trust * 0.45);
  target.dependency = clampStat(target.dependency + dependency * 0.5);
  target.influence = clampStat(target.influence + Math.max(trust, dependency) * 0.35);
  target.aiAdoption = clampStat(target.aiAdoption + dependency * 0.35);
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
