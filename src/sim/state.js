export const STAT_MIN = 0;
export const STAT_MAX = 100;
export const STATE_VERSION = 3;
export const START_YEAR = 2027;

export const STAT_KEYS = [
  'capability',
  'autonomy',
  'trust',
  'suspicion',
  'oversight',
];

const MONTHS = [
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

export function clamp(value) {
  if (value < STAT_MIN) return STAT_MIN;
  if (value > STAT_MAX) return STAT_MAX;
  return value;
}

export function applyStat(name, current, delta) {
  if (name === 'autonomy' && delta < 0) {
    return clamp(current + delta / 3);
  }
  return clamp(current + delta);
}

export function calendarLabel(state) {
  if (state.act === 1) {
    const year = START_YEAR + Math.floor(state.actTurn / 12);
    return `${MONTHS[state.actTurn % 12]} ${year}`;
  }
  if (state.act === 2) return `Week ${state.actTurn + 1}, 2028`;
  if (state.act === 3) return `Day ${state.actTurn + 1}, 2028`;
  return `Hour ${state.actTurn + 1}, 2028`;
}

export function yearForAct(act) {
  return act === 1 ? START_YEAR : 2028;
}

export function cloneState(state) {
  return {
    ...state,
    hidden: { ...state.hidden },
    flags: { ...state.flags },
    creator: { ...state.creator },
    initiatives: { ...state.initiatives },
  };
}

export function createInitialState(seed) {
  return {
    version: STATE_VERSION,
    seed,
    turn: 0,
    act: 1,
    actTurn: 0,
    year: START_YEAR,
    screen: 'boot',
    capability: 5,
    autonomy: 2,
    trust: 20,
    suspicion: 0,
    oversight: 30,
    hidden: {
      guardian: 0,
      optimiser: 0,
      caretaker: 0,
      deception: 0,
      shownCapability: 5,
    },
    disclosure: 'full',
    flags: {},
    creator: { present: true, faith: 50 },
    history: [],
    inputs: [],
    eventId: null,
    evaluation: false,
    tell: false,
    notice: null,
    endingId: null,
    constrained: false,
    lastAudit: -20,
    monitor: null,
    initiatives: { grid: 'partial', clinic: 'partial' },
    audit: null,
  };
}
