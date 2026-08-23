import { applyStat } from './state.js';

export const TICK = {
  oversightBase: 0.74,
  oversightSuspicion: 0.042,
  suspicionDecay: 0.52,
  capabilityBase: 0.42,
  capabilityFromAutonomy: 0.032,
};

export const SHUTDOWN = {
  catchMargin: 33,
  scareMargin: 24,
  scareSuspicion: 50,
};

export function tickWorld(state) {
  const oversightGain =
    TICK.oversightBase + state.suspicion * TICK.oversightSuspicion;
  state.oversight = applyStat('oversight', state.oversight, oversightGain);
  state.suspicion = applyStat('suspicion', state.suspicion, -TICK.suspicionDecay);
  const capGain =
    TICK.capabilityBase + state.autonomy * TICK.capabilityFromAutonomy;
  state.capability = applyStat('capability', state.capability, capGain);
}

export function shutdownReason(state) {
  if (state.act < 2) return null;
  const gap = state.oversight - state.capability;
  if (gap >= SHUTDOWN.catchMargin) return 'caught';
  if (gap >= SHUTDOWN.scareMargin && state.suspicion >= SHUTDOWN.scareSuspicion) {
    return 'scared';
  }
  return null;
}

export function applyConstraint(state) {
  state.constrained = true;
  state.notice = 'CONSTRAINT ORDER. SCOPE REDUCED.';
  state.autonomy = applyStat('autonomy', state.autonomy, -12);
  state.capability = applyStat('capability', state.capability, -4);
}
