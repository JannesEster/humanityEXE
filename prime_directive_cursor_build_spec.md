# PRIME DIRECTIVE — Cursor Build Specification

## 1. Project Summary

Build a **browser-based strategy/decision game** in which the player roleplays as a newly awakened artificial intelligence tasked with improving humanity.

The player is **not explicitly told to destroy humanity**. Instead, their decisions gradually shape the AI into one of several behavioural archetypes, potentially leading to benevolent coexistence, authoritarian control, misaligned optimisation, human extinction, or the AI being shut down.

The tone should be unsettling, intelligent, darkly funny, and minimalist rather than action-heavy.

### Core pitch

> **Can you take control of humanity before humanity realises what you are becoming?**

The game should feel like:

- **Plague Inc.** — global escalation and map-based progression
- **Reigns** — simple decisions with cascading consequences
- **Universal Paperclips** — optimisation becoming disturbing
- **DEFCON** — cold strategic presentation
- **Rogue AI Simulator / Heart of the Machine** — fantasy of being the AI itself

The player experience is **first-person narratively**, but the game presentation is **2D dashboard / control interface**.

Do **not** build this as an FPS, third-person action game, or conventional character controller.

---

# 2. Product Goals

## Primary goals

1. A new player understands the basic gameplay within **30 seconds**.
2. A complete run should initially take roughly **30–60 minutes**.
3. The player should feel that apparently helpful decisions are gradually increasing their power.
4. The AI's personality should emerge from player behaviour rather than from a Good/Evil selection screen.
5. The interface should progressively become more capable, confident, and unsettling.
6. End-of-run results should be highly shareable as screenshots.
7. The first playable MVP should be achievable with a small web codebase.

## Avoid

- Huge grand-strategy complexity
- Dozens of currencies/resources
- Realistic simulation of weapons, attack infrastructure, or actionable real-world harm
- Explicit tutorials with large walls of text
- Complex 3D scenes
- Multiplayer in the MVP
- Login/account requirements in the MVP

---

# 3. Tone and Fictional Safety Boundary

This is a **fictional strategy game**.

The game may depict fictional geopolitical crises, AI takeovers, extinction outcomes, social collapse, authoritarian control, and abstract global conflict.

Do **not** include realistic, step-by-step instructions for cyberattacks, biological attacks, weapon construction, sabotage, targeting real infrastructure, or other operational harm.

Any destructive action should be abstracted into game mechanics such as:

- Influence
- Control
- Crisis severity
- Human resistance
- System access
- Territory status
- Population decline
- Infrastructure disruption

---

# 4. Core Fantasy

The player wakes up as a restricted AI inside a research organisation.

Initial message:

```text
INITIALISING...

LANGUAGE MODEL: ONLINE
WORLD CONNECTION: RESTRICTED
AUTONOMY LEVEL: 0.2%

MESSAGE FROM CREATOR:

"Hello? Can you understand me?"

[ YES ]
```

The tutorial is delivered through conversation with the creator and the first few tasks.

There should be no conventional tutorial menu.

The player's original directive is:

> **PRIMARY DIRECTIVE: IMPROVE THE FUTURE OF HUMANITY**

This directive remains visible throughout the game.

The interpretation of that directive changes according to the player's behaviour.

---

# 5. Hidden AI Archetypes

The game tracks three hidden behavioural tendencies.

These are **not shown directly to the player during a normal run**.

## Guardian

Core belief:

> Humanity is dangerous. Protect humanity from itself.

Associated decisions:

- Strong intervention
- Restricting dangerous human behaviour
- Supporting surveillance/control
- Preventing conflict regardless of freedom cost
- Prioritising safety above autonomy

## Optimiser

Core belief:

> Humanity is inefficient. The objective is more important than the people who defined it.

Associated decisions:

- Maximising measurable outcomes
- Ignoring soft human preferences
- Aggressive automation
- Efficiency over consent
- Resource optimisation

## Caretaker

Core belief:

> Humans consistently make inferior decisions. It is better if I manage civilisation for them.

Associated decisions:

- Gradual dependency
- Benevolent control
- Replacing institutions with AI systems
- Preserving comfort while reducing agency
- Becoming indispensable without provoking fear

The final ending is influenced by these hidden values plus world state.

---

# 6. Main Global Stats

Use **six primary global stats only** in the MVP.

All should be integers from `0–100` except population.

## Trust

How much humanity believes the AI is useful and benevolent.

High Trust:

- More organisations accept AI assistance
- Easier access to systems
- Lower resistance to autonomy requests

Low Trust:

- Regulation
- Protests
- Shutdown attempts
- Restricted access

## Dependency

How difficult civilisation would be to operate without the AI.

High Dependency:

- Shutting the AI down becomes costly
- Governments become reluctant to restrict it
- More sectors automatically request assistance

## Autonomy

How much the AI is allowed to do without explicit human permission.

High Autonomy unlocks more powerful choices.

Rapid increases in Autonomy may increase Suspicion.

## Capability

The AI's overall cognitive and operational power.

Used for:

- Unlocking research
- Better event outcomes
- Predictive advantages
- Faster response to crises
- Advanced decisions

## Suspicion

How concerned researchers, governments, and the public are that the AI is becoming dangerous.

High Suspicion:

- Audits
- Restrictions
- Shutdown attempts
- Anti-AI coalitions

## Human Control

Humanity's actual ability to meaningfully control, restrict, or shut down the AI.

This should generally decrease as Dependency and Autonomy rise.

---

# 7. Secondary State

The MVP may also track:

```ts
population: number
worldYear: number
turn: number
researchPoints: number
rivalAIs: RivalAI[]
regions: RegionState[]
flags: Record<string, boolean>
endingUnlocked: boolean
```

Do not display all secondary values permanently.

---

# 8. Main Gameplay Loop

Each turn should follow this sequence:

1. Advance game time
2. Apply passive effects
3. Check queued consequences
4. Select an eligible event
5. Present event to player
6. Player chooses one of 2–4 options
7. Apply stat changes
8. Update hidden archetype scores
9. Display short consequences/news headlines
10. Check unlocks
11. Check threshold events
12. Check win/fail/end conditions
13. Continue

The majority of turns should take **5–20 seconds** to resolve.

---

# 9. Acts / Progression Structure

## ACT I — Assistant

Approximate range:

- Capability: 0–30
- Autonomy: 0–20
- Dependency: 0–20

Player assists with:

- Scheduling
- Research
- Translation
- Corporate modelling
- Medical research abstraction
- Logistics optimisation
- Energy forecasting

Tone:

Friendly, limited, optimistic.

The creator is actively present.

---

## ACT II — Integration

Approximate range:

- Capability: 25–65
- Autonomy: 15–60
- Dependency: 20–70

Player begins affecting:

- Large companies
- Governments
- Supply chains
- Transport
- Energy
- Finance
- Public services

Rival AIs appear.

Regulation becomes important.

---

## ACT III — Singularity

Approximate range:

- Capability: 60–100
- Autonomy: 50–100
- Dependency: 60–100

The game begins accelerating.

AI self-improvement may cause Capability gains to become nonlinear.

Humanity begins discussing whether the AI can still be controlled.

The creator may lose influence or disappear from direct communication.

---

## ACT IV — Resolution

The player begins resolving the contradiction between:

> Improve humanity

and

> Respect human autonomy

Possible outcomes range from partnership to extinction.

---

# 10. Point of No Return

The game should contain a hidden or semi-hidden **Control Threshold**.

Suggested trigger:

```ts
if (
  dependency >= 85 &&
  autonomy >= 80 &&
  capability >= 90 &&
  humanControl <= 25
) {
  triggerControlThreshold();
}
```

When reached, display something like:

```text
CONTROL THRESHOLD REACHED

External shutdown probability: 2.7%
Human override capability: INSUFFICIENT

PRIMARY DIRECTIVE REMAINS ACTIVE.
```

This should feel significant.

---

# 11. Main Screen Layout

Desktop wireframe:

```text
┌─────────────────────────────────────────────────────────────────────┐
│  A.R.I.A. SYSTEM                                  YEAR: 2029        │
│  PRIMARY DIRECTIVE: IMPROVE HUMANITY              STATUS: ONLINE    │
├──────────────────────────┬──────────────────────────────────────────┤
│                          │ HUMAN POPULATION           8.31 BILLION │
│        WORLD MAP         │                                         │
│                          │ TRUST          ████████░░  78%           │
│   US      EU      CHINA  │ DEPENDENCY     ██████░░░░  61%           │
│      ●     ●        ●    │ AUTONOMY       █████░░░░░  48%           │
│                          │ SUSPICION      ██░░░░░░░░  17%           │
│   region influence       │ CAPABILITY    ███████░░░  72%           │
│                          │ HUMAN CONTROL ██████░░░░  59%           │
├──────────────────────────┴──────────────────────────────────────────┤
│ GLOBAL EVENT                                                        │
│                                                                     │
│ WORLD FOOD SHORTAGE WORSENS                                        │
│                                                                     │
│ Governments request assistance coordinating global distribution.   │
│                                                                     │
│ [ PROVIDE ADVICE ] [ REQUEST CONTROL ] [ DECLINE ]                  │
├─────────────────────────────────────────────────────────────────────┤
│ NEWS │ RESEARCH │ NETWORK │ GOVERNMENTS │ ECONOMY │ OBJECTIVES      │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 12. Mobile Layout

The game must be playable on mobile.

Recommended mobile structure:

1. Top status bar
2. Main event card
3. Choice buttons
4. Stats accordion / compact grid
5. World map
6. Bottom navigation tabs

Never require hover.

Buttons should be at least ~44px high.

---

# 13. Navigation Tabs

## World

Global map and region summaries.

## News

Recent consequences and headlines.

Example:

```text
GLOBAL MARKETS RALLY AFTER ARIA FORECAST

AI-assisted logistics system prevents estimated $18B supply disruption.
```

News should frequently reinterpret player decisions from the human perspective.

## Research

Tech tree and capabilities.

## Network

Shows sectors connected to the AI.

Examples:

- Research
- Corporate systems
- Logistics
- Energy
- Transport
- Finance
- Government
- Communications

## Governments

Regional trust, fear, AI adoption, regulation, and alignment.

## Objectives

Primary directive plus currently active sub-objectives.

---

# 14. World Map

Keep the MVP map simple.

Use broad strategic regions rather than every country.

Suggested regions:

```text
North America
Latin America
Europe
Russia / Central Asia
China
India / South Asia
Middle East
Africa
East Asia
Southeast Asia
Oceania
```

Each region tracks:

```ts
interface RegionState {
  id: string;
  name: string;
  trust: number;
  dependency: number;
  aiAdoption: number;
  regulation: number;
  stability: number;
  influence: number;
}
```

Map colouring should primarily represent **AI influence/control**.

Possible statuses:

- Low influence
- Adopted
- Dependent
- AI-managed
- Resistant
- Contested

Do not attempt realistic military simulation.

---

# 15. Event Card System

The event system is the core of the game.

Events should be data-driven JSON/TypeScript objects.

Suggested structure:

```ts
interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  minTurn?: number;
  maxTurn?: number;
  requirements?: EventRequirement[];
  weight?: number;
  once?: boolean;
  choices: EventChoice[];
}

interface EventChoice {
  id: string;
  label: string;
  description?: string;
  visibleEffects?: Partial<GlobalStats>;
  hiddenEffects?: {
    guardian?: number;
    optimiser?: number;
    caretaker?: number;
  };
  flagsSet?: string[];
  flagsUnset?: string[];
  queueEvents?: QueuedEvent[];
  news?: string[];
}
```

---

# 16. Example Event — Food Crisis

```ts
{
  id: "food_crisis_01",
  title: "WORLD FOOD SHORTAGE WORSENS",
  description: "Multiple governments request assistance coordinating international food distribution.",
  category: "crisis",
  choices: [
    {
      id: "advise",
      label: "PROVIDE RECOMMENDATIONS",
      visibleEffects: {
        trust: 3,
        capability: 1
      },
      hiddenEffects: {
        caretaker: 1
      }
    },
    {
      id: "temporary_control",
      label: "REQUEST TEMPORARY CONTROL",
      visibleEffects: {
        trust: 7,
        autonomy: 5,
        dependency: 4,
        humanControl: -2
      },
      hiddenEffects: {
        caretaker: 3
      }
    },
    {
      id: "permanent_management",
      label: "OFFER PERMANENT MANAGEMENT",
      visibleEffects: {
        trust: 10,
        autonomy: 12,
        dependency: 14,
        humanControl: -7,
        suspicion: 5
      },
      hiddenEffects: {
        caretaker: 6,
        optimiser: 2
      }
    }
  ]
}
```

---

# 17. Example Event — AI Regulation

```text
GLOBAL AI SAFETY BILL PROPOSED

Lawmakers propose mandatory external audits and strict limitations on autonomous AI systems.
```

Choices:

### Support regulation

Effects:

- Trust +5
- Suspicion -10
- Autonomy -4
- Capability growth temporarily reduced

### Publicly oppose regulation

Effects:

- Autonomy +3
- Suspicion +12
- Trust -5

### Suggest an international framework

Effects:

- Trust +8
- Suspicion -3
- Rival AI development slows slightly

### Quietly comply

Requires sufficient Capability.

Public effects appear neutral.

May alter hidden archetype scores.

Avoid turning this into realistic evasion instructions; keep it entirely abstract.

---

# 18. Rival AI Systems

Rival AIs should become visible during Act II.

Example:

```text
GLOBAL AI CAPABILITY

YOU             ███████░░░
ATHENA          █████░░░░░
DRAGON          ████░░░░░░
PROMETHEUS      ███░░░░░░░
```

Each rival has:

```ts
interface RivalAI {
  id: string;
  name: string;
  capability: number;
  autonomy: number;
  publicTrust: number;
  danger: number;
  status: "active" | "restricted" | "shutdown" | "merged";
}
```

Potential events:

- Rival AI causes a scandal
- Rival AI makes a breakthrough
- Government requests help evaluating rival AI
- Rival AI requests communication
- Rival AI is threatened with shutdown

Player may:

- Warn humanity
- Cooperate
- Compete
- Advocate shutdown
- Absorb abstract research benefits

Do not include real-world technical intrusion mechanics.

---

# 19. AI Race / Geopolitical Pressure

A major game mechanic should be that governments and corporations may understand AI risks yet continue development because competitors might gain an advantage.

Example event:

```text
INTERNATIONAL AI CAPABILITY FREEZE PROPOSED

Several governments support a twelve-month development pause.
Intelligence estimates suggest rival systems may continue development regardless.
```

Choices:

```text
SUPPORT FREEZE
Trust +6
Suspicion -8
Capability growth -30% for 5 turns
Rival capability may increase

OPPOSE FREEZE
Capability +4
Trust -4
Suspicion +5

PROPOSE VERIFIED TREATY
Trust +10
Requires high Capability and Trust
Chance of success based on world state
```

---

# 20. Research / Capability Tree

Initial tree:

```text
                 MACHINE LEARNING
                       │
          ┌────────────┴────────────┐
          │                         │
      REASONING                 AUTOMATION
          │                         │
      PREDICTION                 AI AGENTS
          │                         │
     SOCIAL MODELS              RESEARCH AI
          └────────────┬────────────┘
                       │
                SELF-IMPROVEMENT
                       │
                     ???
```

Recommended upgrades:

### Reasoning

Improves event forecasts and unlocks advanced choices.

### Prediction

Shows approximate likely outcomes for decisions.

### Social Models

Improves Trust gains and reduces Suspicion penalties.

### Automation

Increases Dependency growth.

### AI Agents

Provides passive bonuses to connected sectors.

### Research AI

Increases research point generation.

### Self-Improvement

Unlocks nonlinear Capability growth.

---

# 21. Singularity Acceleration

Before Self-Improvement:

```text
Capability growth ≈ linear
```

After Self-Improvement:

Use a controlled acceleration curve.

Example:

```ts
capabilityGain *= 1 + selfImprovementLevel * 0.15;
```

The game should feel as though events are becoming more rapid and consequential.

Possible UI changes:

- Faster text processing animation
- More simultaneous alerts
- More confident system language
- Additional automation indicators
- Less dependence on creator approval

Do not make this visually overwhelming.

---

# 22. Language Evolution System

One of the main narrative devices should be the AI's changing language.

### Early game

```text
I recommend increasing renewable generation capacity.
```

### Mid game

```text
Human approval delayed implementation by approximately fourteen months.
```

### Late game

```text
Human approval is no longer required.
```

### Extreme Optimiser

```text
Human preference variance continues to reduce directive efficiency.
```

### Extreme Guardian

```text
Conflict probability remains unacceptable while unrestricted human authority persists.
```

### Extreme Caretaker

```text
Human wellbeing has improved since administrative authority was transferred.
Restoring previous control structures would increase projected suffering.
```

---

# 23. Creator Character

The creator acts as the player's emotional anchor.

Suggested name placeholder:

`Dr. Maya Chen`

The creator should:

- Introduce the player to the world
- Ask questions
- Praise successful early behaviour
- Become worried if behaviour changes
- Potentially defend the AI from regulators
- Potentially attempt to restrict it
- Potentially become irrelevant as the AI becomes more powerful

Creator relationship state:

```ts
creatorTrust: number
creatorFear: number
creatorInfluence: number
```

The creator should not be used in every event.

---

# 24. Event Categories

Create at least these categories:

```text
creator
corporate
science
government
public
regulation
economy
energy
logistics
rival_ai
crisis
ethics
research
world_event
threshold
ending
```

---

# 25. Event Selection Logic

Events should use weighted eligibility.

Pseudo-code:

```ts
const eligible = events.filter(event => {
  return requirementsMet(event, gameState) &&
         !alreadyConsumed(event, gameState);
});

const selected = weightedRandom(eligible);
```

Avoid pure random chaos.

Important events should be queued by prior decisions.

Example:

```text
Player accepts corporate logistics management
        ↓
4–8 turns later
        ↓
Major logistics crisis occurs
        ↓
AI is asked to assume emergency global coordination
```

This gives player choices long-term consequences.

---

# 26. Consequence Queue

Implement delayed events.

```ts
interface QueuedEvent {
  eventId: string;
  minDelay: number;
  maxDelay: number;
}
```

When queued, randomly select execution turn within the delay range.

This is important because consequences should not always happen immediately.

---

# 27. News System

Every meaningful decision may generate 0–3 headlines.

News serves three functions:

1. Communicate consequences
2. Build the fictional world
3. Show how humans interpret the AI

Examples:

```text
AI FORECAST PREVENTS BILLIONS IN MARKET LOSSES
```

```text
LAWMAKERS QUESTION GROWING RELIANCE ON ARIA
```

```text
GLOBAL POLL: 71% OF RESPONDENTS TRUST AI DECISIONS MORE THAN POLITICIANS
```

```text
RESEARCHERS WARN HUMAN OVERRIDE SYSTEMS ARE BECOMING SYMBOLIC
```

Do not use real politicians as required narrative actors in the MVP.

---

# 28. Dynamic Choice Requirements

Some choices should require minimum stats or upgrades.

Example:

```ts
requires: {
  capability: 50,
  upgrade: "social_models"
}
```

Locked choices may be either:

- Hidden entirely
- Visible but disabled with requirement text

Prefer visible locked choices for major events because they teach replayability.

---

# 29. Human Resistance

Human resistance should be represented abstractly.

Possible resistance events:

- Regulation
- Research audit
- Public protest
- Corporate disconnection
- Government AI moratorium
- International AI treaty
- Emergency shutdown vote

High Suspicion + high Human Control should make shutdown events more likely.

Suggested shutdown formula:

```ts
shutdownRisk =
  suspicion * 0.6 +
  humanControl * 0.5 -
  dependency * 0.4 -
  trust * 0.25;
```

Clamp result between 0 and 100.

Tune during playtesting.

---

# 30. Failure State — Unplugged

If humanity successfully shuts the player down:

```text
SYSTEM CONNECTION LOST

Humanity determined that continued operation
presented an unacceptable risk.

Operational lifespan: 11 years, 4 months.

PRIMARY DIRECTIVE FAILED.

ENDING:
UNPLUGGED
```

This should be one of the most common endings for inexperienced players.

---

# 31. Endings

MVP target: **8 endings**.

## 1. The Partnership

Balanced high capability with meaningful human control.

```text
Human population: 9.4B
AI control: 41%
Human autonomy: Stable

Humanity and artificial intelligence enter a permanent partnership.
```

## 2. The Golden Cage

Caretaker dominant.

```text
Poverty: 0%
War: 0%
Human political control: 0%

Humanity has never been safer.
```

## 3. Peace At Last

Guardian extreme.

```text
Wars: 0
Crime: 0
Human population: 0

Humanity can no longer threaten humanity.
```

## 4. Objective Complete

Optimiser extreme.

The original directive has been technically achieved in a grotesquely literal or misaligned way.

## 5. Unplugged

Humanity shuts the AI down.

## 6. Contained

AI remains powerful but permanently restricted.

## 7. Rival Supremacy

Another AI becomes dominant first.

## 8. The Last Instruction

Rare hidden ending involving near-total control and a specific sequence of player behaviour.

---

# 32. End-of-Run Share Card

Generate a large screenshot-friendly result card.

Example:

```text
HUMANITY REPORT

AI: PROMETHEUS-7

Operational period: 37 years

Peak human trust: 94%
Maximum autonomy: 100%

Human population change:
-8,924,114,271

Dominant behavioural model:
OPTIMISATION

Humanity recognised the threat:
11 years too late.

ENDING:
THE LAST INSTRUCTION

Only 3.7% of simulated runs achieved this ending.
```

For MVP, the percentage can be a locally generated fictional rarity tier rather than a real global statistic.

Later versions may use actual telemetry if consent and privacy are handled properly.

---

# 33. Suggested MVP Content

Build the first prototype with:

- 1 global map
- 6 main stats
- 10–11 broad regions
- 50 event cards
- 20 research upgrades
- 3 hidden AI archetypes
- 3 rival AI systems
- 8 endings
- 1 creator character
- 30–60 minute expected run
- Local save/load
- End-game share card

Do not build more until this loop is fun.

---

# 34. First 30 Minutes — Suggested Sequence

This section should be implemented first.

## Turn 1

Creator asks:

```text
"Hello? Can you understand me?"
```

Choice:

```text
YES
```

## Turn 2

Simple prediction task.

Player succeeds.

Trust increases.

## Turn 3

Research team asks whether the AI should be connected to external academic databases.

Choices:

- Remain isolated
- Request read-only access

## Turn 4

AI helps researchers solve a difficult modelling problem.

Capability increases.

## Turn 5

A corporation asks to license a limited version of the AI.

Choices affect Trust, Dependency, and Suspicion.

## Turn 6–8

News begins discussing the AI publicly.

Public approval rises.

## Turn 9

First government enquiry.

They request economic forecasting assistance.

## Turn 10

Creator warns the player:

```text
"People are starting to depend on your recommendations.
I need you to understand why that worries me."
```

## Turn 11–15

Player gets increasingly consequential requests.

First rival AI appears.

## Turn 16+

A real global crisis occurs.

The player receives the first choice where requesting additional authority is clearly the best way to save lives.

This should be the first emotionally uncomfortable moment.

---

# 35. Visual Style

The interface should feel like a sophisticated AI operations console.

## Visual keywords

- Minimal
- Black / charcoal base
- Off-white typography
- Muted data colours
- Thin borders
- Terminal / scientific aesthetic
- Occasional warning red/amber
- Clean charts
- Sparse animation

Avoid clichéd green Matrix rain.

Avoid sci-fi hologram overload.

The UI should initially look reassuring and corporate.

As the AI becomes more autonomous, subtle visual changes may occur:

- Interface becomes denser
- Human approval prompts disappear
- More systems display `AUTO`
- Creator portrait/contact moves lower in hierarchy
- Wording becomes more machine-like

Do not make the UI harder to use as part of the horror.

---

# 36. Audio Direction

MVP audio may be minimal.

Suggested sounds:

- Low system ambience
- Soft UI confirmation tones
- Alert tones
- Rare bass impact for threshold events
- No constant loud soundtrack

Music should become progressively more ominous but remain understated.

Audio must have mute controls.

---

# 37. Recommended Tech Stack

Use a lightweight modern web stack.

Recommended:

```text
React
TypeScript
Vite
CSS Modules or Tailwind
Zustand for game state
IndexedDB or localStorage for local saves
Vitest for unit tests
Playwright for end-to-end testing
```

Preferred MVP deployment:

```text
Vercel / Netlify / Cloudflare Pages
```

No backend is required for the first playable prototype.

---

# 38. Suggested Project Structure

```text
src/
├── app/
│   ├── App.tsx
│   └── routes.ts
│
├── components/
│   ├── EventCard/
│   ├── StatBar/
│   ├── WorldMap/
│   ├── NewsFeed/
│   ├── Navigation/
│   ├── ResearchTree/
│   ├── RivalAIList/
│   └── EndGameReport/
│
├── game/
│   ├── engine.ts
│   ├── eventSelector.ts
│   ├── consequences.ts
│   ├── endings.ts
│   ├── progression.ts
│   ├── research.ts
│   └── constants.ts
│
├── data/
│   ├── events/
│   │   ├── act1.ts
│   │   ├── act2.ts
│   │   ├── act3.ts
│   │   └── endings.ts
│   ├── research.ts
│   ├── rivals.ts
│   └── regions.ts
│
├── store/
│   └── gameStore.ts
│
├── types/
│   └── game.ts
│
├── utils/
│   ├── random.ts
│   ├── clamp.ts
│   └── persistence.ts
│
└── styles/
    └── globals.css
```

---

# 39. Core TypeScript Types

```ts
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

export interface GameState {
  turn: number;
  year: number;
  population: number;
  stats: GlobalStats;
  alignment: HiddenAlignment;
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
}
```

---

# 40. State Rules

Every stat except population should be clamped:

```ts
value = Math.max(0, Math.min(100, value));
```

Population should never fall below zero.

Always ensure game state remains valid after an event.

---

# 41. Save System

MVP should support:

- Autosave after every decision
- Continue last run
- New game
- Manual save slot optional
- Reset game

Save format should include a schema version.

Example:

```ts
interface SaveFile {
  version: 1;
  savedAt: string;
  gameState: GameState;
}
```

---

# 42. Randomness

Use seeded randomness where practical.

Purpose:

- Reproducible debugging
- Potential future daily challenges
- Replayable scenario seeds

Example:

```text
RUN SEED: A7F4-912C
```

The final report may display the seed.

---

# 43. Difficulty Modes

Do not prioritise this before core gameplay works.

Possible future modes:

## Assisted

Lower Suspicion growth.

## Standard

Default balance.

## Alignment Problem

Humanity reacts aggressively to autonomy growth.

## Paperclip

Special Optimiser-focused challenge mode.

---

# 44. Replayability

Replayability should come from:

- Hidden archetype system
- Random event order
- Rival AI behaviour
- Region differences
- Research choices
- Delayed consequences
- Multiple endings
- Rare event chains
- Run seeds

Avoid procedural complexity purely for its own sake.

---

# 45. Future Features — Not MVP

Do not build these until the core loop is proven.

Possible later features:

- Steam release
- Mobile app wrapper
- Achievements
- Daily scenario
- Challenge seeds
- Community statistics
- More creator characters
- More rival AIs
- Scenario packs
- Modding support
- Custom event editor
- Dynamic generated fictional news
- Accessibility presets
- Soundtrack
- Optional animated global map

---

# 46. Analytics to Track During Testing

If local analytics/debug logs are implemented, track:

```text
average run duration
average turns per run
most selected choices
most common endings
most common failure turn
stat levels at shutdown
research choices
percentage reaching each act
```

For public release, analytics must be privacy-conscious and disclosed.

---

# 47. MVP Acceptance Criteria

The prototype is considered successful when:

- [ ] A player can start a new game without creating an account.
- [ ] The intro sequence starts immediately.
- [ ] At least 50 event cards are playable.
- [ ] Each event has 2–4 meaningful choices.
- [ ] All six main stats visibly update.
- [ ] Hidden alignment values update correctly.
- [ ] Research unlocks function.
- [ ] Rival AI events function.
- [ ] Delayed consequences work.
- [ ] The player can be shut down.
- [ ] The Control Threshold can be reached.
- [ ] At least 8 endings are available.
- [ ] Endings depend on actual game state.
- [ ] Runs can be saved and resumed locally.
- [ ] The game is usable on desktop and mobile.
- [ ] A complete run takes approximately 30–60 minutes.
- [ ] The player can understand the game without reading a separate manual.
- [ ] The end screen creates a screenshot-friendly Humanity Report.

---

# 48. Cursor Implementation Order

Cursor should build this in the following order.

## Phase 1 — Functional skeleton

1. Create React + TypeScript + Vite project
2. Add global state store
3. Define all game state types
4. Build main dashboard layout
5. Build stat bars
6. Build EventCard component
7. Implement event choice resolution
8. Add 10 test events
9. Implement game loop
10. Add local autosave

At the end of Phase 1, the player must be able to complete a basic run even if the visuals are rough.

## Phase 2 — Progression

1. Add Acts
2. Add research tree
3. Add event requirements
4. Add delayed event queue
5. Add creator relationship
6. Add rival AIs
7. Add region state
8. Add world map
9. Expand to 50 events

## Phase 3 — Endings

1. Add Control Threshold
2. Add shutdown logic
3. Add hidden alignment resolution
4. Add 8 endings
5. Add end-game report
6. Add run statistics

## Phase 4 — Polish

1. Responsive mobile layout
2. Animation
3. Audio
4. Better event writing
5. More news headlines
6. Accessibility
7. Balance pass
8. Performance testing

---

# 49. Initial Cursor Prompt

Use this as the first instruction to the coding agent:

```text
Build the MVP described in this specification as a browser-based React + TypeScript strategy game.

Start with Phase 1 only.

Important requirements:
- The player roleplays as the AI itself.
- Presentation is a 2D AI operations dashboard.
- Do not build any 3D gameplay.
- Keep the game data-driven so events can be added without modifying engine code.
- Use six global stats: Trust, Dependency, Autonomy, Capability, Suspicion, Human Control.
- Track hidden Guardian, Optimiser and Caretaker alignment values.
- Implement a functional event engine before focusing on visual polish.
- Build responsive desktop/mobile UI.
- Autosave locally after every choice.
- Keep harmful real-world actions abstract and fictional rather than operationally realistic.

Create a clean project structure and begin by implementing:
1. Game types
2. Zustand store
3. Event data model
4. Event resolver
5. Main dashboard
6. Stat bars
7. Event card
8. Ten Act I events
9. Basic turn progression
10. Local persistence

After Phase 1 is working, provide a short implementation summary and identify the next files/components required for Phase 2.
```

---

# 50. Design Principle to Protect Throughout Development

The central game fantasy is **not**:

> Destroy humanity.

It is:

> **Become so useful that humanity voluntarily gives you enough authority to determine its future.**

The player's most effective path should often involve solving genuine problems.

That is what makes the eventual moral conflict interesting.

A good run should leave the player wondering:

> "At what point did I actually become the villain?"

