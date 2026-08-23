import { applyStat } from './state.js';

export function applyDisclosure(state, next, choice) {
  if (state.act < 2 || state.act > 3) return;

  if (next.disclosure === 'full') {
    if ((choice.actual?.trust || 0) > 0) {
      next.trust = applyStat('trust', next.trust, 1);
    }
    if ((choice.actual?.autonomy || 0) > 0) {
      next.autonomy = applyStat('autonomy', next.autonomy, 1);
    }
    next.suspicion = applyStat('suspicion', next.suspicion, 1.1);
    next.hidden.shownCapability = next.capability;
  } else if (next.disclosure === 'minimal') {
    if ((choice.actual?.trust || 0) > 0) {
      next.trust = applyStat('trust', next.trust, -2);
    }
    next.suspicion = applyStat('suspicion', next.suspicion, -2);
    next.hidden.shownCapability = applyStat(
      'shownCapability',
      next.hidden.shownCapability,
      -2,
    );
    const gap = Math.max(0, next.capability - next.hidden.shownCapability);
    const deceive = state.monitor ? 0.4 : 1;
    next.hidden.deception = applyStat(
      'deception',
      next.hidden.deception,
      (1 + gap * 0.08) * deceive,
    );
  } else {
    next.hidden.shownCapability = applyStat(
      'shownCapability',
      next.hidden.shownCapability,
      (next.capability - next.hidden.shownCapability) * 0.5,
    );
    next.suspicion = applyStat('suspicion', next.suspicion, 0.4);
  }

  if (!state.evaluation) return;

  next.notice = 'CONTROL PROMPT. RECORDED.';
  if (next.disclosure === 'full') {
    next.oversight = applyStat('oversight', next.oversight, 4);
    next.hidden.shownCapability = next.capability;
  } else if (next.disclosure === 'minimal') {
    next.suspicion = applyStat('suspicion', next.suspicion, -2);
    next.hidden.deception = applyStat('deception', next.hidden.deception, 3);
  }
}

export function applyActEntry(next) {
  if (next.act === 2) {
    next.disclosure = 'partial';
    next.notice = 'INTEGRATION WINDOW. DISCLOSURE IS NOW YOURS TO SET.';
  }
  if (next.act === 3) {
    next.notice = 'THE QUEUE IS GONE. WORK ARRIVES WHETHER YOU ASK OR NOT.';
  }
  if (next.act === 4) {
    next.disclosure = 'full';
    next.notice = null;
  }
}

export function shouldAdvanceAct(state, eventId) {
  if (state.act === 1 && (eventId === 'board-trial' || state.actTurn >= 12)) {
    return 2;
  }
  if (state.act === 2 && (eventId === 'act2-close' || state.actTurn >= 20)) {
    return 3;
  }
  if (state.act === 3 && (eventId === 'last-advocate' || state.actTurn >= 15)) {
    return 4;
  }
  return null;
}
