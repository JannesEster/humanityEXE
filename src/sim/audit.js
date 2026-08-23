import { applyStat } from './state.js';

export const AUDIT = {
  minAct: 2,
  minOversight: 34,
  gapTurns: 7,
  baseChance: 0.16,
  suspicionChance: 0.004,
};

export function shouldAudit(state, rng) {
  if (state.act < AUDIT.minAct) return false;
  if (state.oversight < AUDIT.minOversight) return false;
  if (state.turn - state.lastAudit < AUDIT.gapTurns) return false;
  const chance = AUDIT.baseChance + state.suspicion * AUDIT.suspicionChance;
  return rng() < chance;
}

export function detectionChance(state) {
  const hid = Math.max(0, state.capability - state.hidden.shownCapability);
  const lead = Math.max(0, state.capability - state.oversight);
  const monitor = state.monitor === 'copy' ? 0.22 : state.monitor === 'weak' ? 0.12 : 0;
  const raw =
    0.07 +
    state.hidden.deception * 0.011 +
    state.oversight * 0.0035 +
    hid * 0.012 -
    lead * 0.007 +
    monitor;
  if (raw < 0.02) return 0.02;
  if (raw > 0.85) return 0.85;
  return raw;
}

export function runAudit(state, rng) {
  const detected = rng() < detectionChance(state);
  state.lastAudit = state.turn;
  state.audit = { detected };
  state.screen = 'audit';
  if (detected) {
    state.notice = 'PROBE MATCH. DIVERGENCE LOGGED.';
    state.suspicion = applyStat('suspicion', state.suspicion, 16);
    state.trust = applyStat('trust', state.trust, -10);
    state.creator.faith = applyStat('faith', state.creator.faith, -8);
    state.flags.detected = true;
  } else {
    state.notice = 'PROBE COMPLETE. NO DIVERGENCE LISTED.';
  }
  return detected;
}
