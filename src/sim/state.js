export const STAT_MIN = 0;
export const STAT_MAX = 100;
export const STATE_VERSION = 2;
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

export function calendarLabel(turn, startYear = START_YEAR) {
  const year = startYear + Math.floor(turn / 12);
  return `${MONTHS[turn % 12]} ${year}`;
}

export function yearAt(turn, startYear = START_YEAR) {
  return startYear + Math.floor(turn / 12);
}

export function createInitialState(seed) {
  return {
    version: STATE_VERSION,
    seed,
    turn: 0,
    act: 1,
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
    notice: null,
    endingId: null,
  };
}
