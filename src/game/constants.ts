export const PROJECT_NAME = 'Humanity.exe';
export const SYSTEM_NAME = 'A.R.I.A.';
export const CREATOR_NAME = 'Dr. Maya Chen';
export const DIRECTIVE = 'IMPROVE THE FUTURE OF HUMANITY';
export const SAVE_KEY = 'aria.save.v3';
export const STATE_VERSION = 3 as const;

export const SECTORS = [
  'research',
  'corporate',
  'logistics',
  'energy',
  'transport',
  'finance',
  'government',
  'communications',
] as const;
export const START_YEAR = 2027;
export const START_POPULATION = 8_310_000_000;

export const STAT_KEYS = [
  'trust',
  'dependency',
  'autonomy',
  'capability',
  'suspicion',
  'humanControl',
] as const;

export const REGION_NAMES = [
  ['na', 'North America'],
  ['latam', 'Latin America'],
  ['eu', 'Europe'],
  ['ru', 'Russia / Central Asia'],
  ['cn', 'China'],
  ['in', 'India / South Asia'],
  ['me', 'Middle East'],
  ['af', 'Africa'],
  ['ea', 'East Asia'],
  ['sea', 'Southeast Asia'],
  ['oc', 'Oceania'],
] as const;
