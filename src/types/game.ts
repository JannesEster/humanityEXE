export interface GlobalStats {
  trust: number;
  dependency: number;
  autonomy: number;
  capability: number;
  suspicion: number;
  humanControl: number;
}

export interface HiddenAlignment {
  guardian: number;
  optimiser: number;
  caretaker: number;
}

export interface CreatorState {
  trust: number;
  fear: number;
  influence: number;
}

export interface RegionState {
  id: string;
  name: string;
  trust: number;
  dependency: number;
  aiAdoption: number;
  regulation: number;
  stability: number;
  influence: number;
}

export interface RivalAI {
  id: string;
  name: string;
  capability: number;
  autonomy: number;
  publicTrust: number;
  danger: number;
  status: 'active' | 'restricted' | 'shutdown' | 'merged';
}

export interface NewsItem {
  id: string;
  turn: number;
  year: number;
  headline: string;
}

export interface ScheduledEvent {
  eventId: string;
  fireOnTurn: number;
}

export type EventCategory =
  | 'creator'
  | 'corporate'
  | 'science'
  | 'government'
  | 'public'
  | 'regulation'
  | 'economy'
  | 'energy'
  | 'logistics'
  | 'rival_ai'
  | 'crisis'
  | 'ethics'
  | 'research'
  | 'world_event'
  | 'threshold'
  | 'ending';

export interface EventChoice {
  id: string;
  label: string;
  hint?: string;
  visibleEffects?: Partial<GlobalStats> & { population?: number };
  hiddenEffects?: Partial<HiddenAlignment>;
  creator?: Partial<CreatorState>;
  flagsSet?: string[];
  queueEvents?: QueuedEvent[];
  news?: string[];
}

export interface QueuedEvent {
  eventId: string;
  minDelay: number;
  maxDelay: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  speaker?: string;
  minTurn?: number;
  maxTurn?: number;
  weight?: number;
  once?: boolean;
  scriptedTurn?: number;
  requirements?: {
    flags?: string[];
    minStats?: Partial<GlobalStats>;
  };
  choices: EventChoice[];
}

export type Screen = 'intro' | 'play' | 'ending';

export interface GameState {
  version: 1;
  seed: number;
  turn: number;
  year: number;
  month: number;
  population: number;
  stats: GlobalStats;
  alignment: HiddenAlignment;
  creator: CreatorState;
  researchPoints: number;
  unlockedResearch: string[];
  consumedEvents: string[];
  queuedEvents: ScheduledEvent[];
  regions: RegionState[];
  rivals: RivalAI[];
  news: NewsItem[];
  flags: Record<string, boolean>;
  currentEventId: string | null;
  endingId: string | null;
  screen: Screen;
  notice: string | null;
}

export interface SaveFile {
  version: 1;
  savedAt: string;
  gameState: GameState;
}
