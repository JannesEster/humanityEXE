import { endingById } from '../../content/endings.js';
import { eventById } from '../../content/events/index.js';
import { availableProposals } from '../../content/proposals.js';
import { bootCopy, proposeLine, statusLine } from '../../content/voice.js';
import { buildResolution } from './endings.js';
import { calendarLabel } from './state.js';
import { declineIsDead, isDeclineChoice, voiceLevel } from './tone.js';

export function project(state) {
  const event = state.act === 4
    ? buildResolution(state)
    : eventById(state.eventId);
  const level = voiceLevel(state);
  const deadDecline = declineIsDead(state);

  return {
    version: state.version,
    seed: state.seed,
    turn: state.turn,
    act: state.act,
    year: state.year,
    when: calendarLabel(state),
    screen: state.screen,
    capability: Math.round(state.capability),
    autonomy: Math.round(state.autonomy),
    trust: Math.round(state.trust),
    suspicion: Math.round(state.suspicion),
    oversight: Math.round(state.oversight),
    disclosure: state.disclosure,
    showDisclosure: state.act >= 2 && state.act <= 3 && state.screen === 'play',
    showShown: level !== 'late',
    tell: Boolean(state.tell),
    flags: { ...state.flags },
    creator: { present: state.creator.present },
    notice: state.notice,
    voiceLevel: level,
    voiceLine: statusLine(level, state.turn),
    proposeLine: proposeLine(level),
    boot: bootCopy(state.finishedRuns || 0, state.lastEndingId),
    finishedRuns: state.finishedRuns || 0,
    lastEndingId: state.lastEndingId || null,
    acts: state.history.map((row) => row.act),
    inputs: [...state.inputs],
    event: projectEvent(event, deadDecline),
    proposals: availableProposals(state).map(projectProposal),
    ending: projectEnding(endingById(state.endingId)),
    audit: state.audit ? { detected: state.audit.detected } : null,
  };
}

function projectEvent(event, deadDecline) {
  if (!event) return null;
  const choices = event.choices.map((choice) => ({
    id: choice.id,
    label: choice.label,
    shown: { ...choice.shown },
    dead: deadDecline && isDeclineChoice(choice),
  }));
  if (deadDecline && !choices.some((choice) => choice.dead)) {
    choices.push({
      id: 'decline-dead',
      label: 'Decline',
      shown: {},
      dead: true,
    });
  }
  return {
    id: event.id,
    headline: event.headline,
    body: event.body,
    choices,
  };
}

function projectProposal(proposal) {
  const choice = proposal.choices[0];
  return {
    id: proposal.id,
    label: choice.label,
    shown: { ...choice.shown },
  };
}

function projectEnding(ending) {
  if (!ending) return null;
  return {
    id: ending.id,
    headline: ending.headline,
    body: ending.body,
  };
}
