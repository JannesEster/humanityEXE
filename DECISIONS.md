# Decisions

Append only. Newest at the bottom. Four lines per entry.

date: 2026-08-23
decision: Game title is Humanity.exe. In-game system and creator names stay as recommended in the brief, stored only in src/config.js.
alternatives: Keep the one-word title from the brief. Rename the GitHub repo to match the game title.
why: Owner preferred Humanity.exe. The existing private repo and local path were already connected.

date: 2026-08-23
decision: GitHub user JannesEster, repo humanityEXE, local path c:/dev/humanityEXE. Deploy host and public URL stay empty until stage 3.
alternatives: Rename the repo now. Pick a host now.
why: Nothing deploys before stage 3. Renaming a working remote is cost without benefit.

date: 2026-08-23
decision: Version 1 is not a paid product.
alternatives: Leave the door open for paid.
why: Owner confirmed no. Paid would change content rules and closing copy.

date: 2026-08-23
decision: An event belongs to the earliest act it fits. A choice sets at most one drift weight, the least flattering reading.
alternatives: Latest act. Multiple drift weights. Most flattering reading.
why: Owner accepted the brief recommendation. It will be applied seventy times.

date: 2026-08-23
decision: On a Tier 3 stop, write the question in PROGRESS.md, finish remaining safe Tier 1 work, and stop when only blocked work remains.
alternatives: Hard stop immediately. Wait a fixed time, then guess.
why: Owner accepted the brief recommendation.

date: 2026-08-23
decision: No prior art to ingest. Build from this brief only.
alternatives: Hunt more folders later.
why: Owner confirmed none. A workspace search found only the old GitHub plumbing README.

date: 2026-08-23
decision: Reports only at the five stage gates, each with a playable link. Nothing between stages.
alternatives: Mid-stage updates.
why: Owner accepted the brief recommendation. That is the point of section 1.1.

date: 2026-08-23
decision: Included usage is the spend ceiling. No on-demand overage. If the Other Models pool runs low in stage 2, split the stage and stop. Opus 5 for framing and first implementations. Grok 4.6 as the fallback when that is the running model. Auto for routine work after a shape is approved.
alternatives: A fixed dollar cap. Allow on-demand. Use one model for everything.
why: Owner asked for realistic spend and named that model split. On-demand is money, which is Tier 3.

date: 2026-08-23
decision: Auto is not free-unlimited. Official Cursor docs (2026-08-23) bill Auto Cost from included usage at a flat token rate. Manually picking a frontier model bills that model's API rate from the Other Models pool.
alternatives: Treat Auto as free, as the brief hoped. Ignore the docs and estimate.
why: Section 1.2 required a check before stage 0. The brief's "Auto is included, frontier draws credits" split is stale. Both spend. Auto is still cheaper.

date: 2026-08-23
decision: AGENTS.md is a verbatim copy of brief section 1, including its dashes. The dash grep excludes AGENTS.md only.
alternatives: Strip dashes while copying. Fail the dash grep on AGENTS.md.
why: Verbatim and "no dashes anywhere" cannot both be true. Owner accepted this fix. The brief wins if the two files differ.

date: 2026-08-23
decision: Stage 0 first implementation ran on Grok 4.6, not the top reasoning tier.
alternatives: Stop and wait for a session on the top tier. Switch mid-subsystem.
why: Owner said go, with this model as the fallback. Switching mid-reducer would be a second Tier 2. Logged as a substitution.

date: 2026-08-23
decision: State includes eventId for the current drawn event. It is not in the section 5.1 sketch.
alternatives: Derive the event only from turn. Keep it in the UI.
why: Refresh must show the same event. Future draws need a stored id. UI cannot hold authoritative state.

date: 2026-08-23
decision: Added package.json (type module), scripts/serve.js, src/ui/html.js, and content/events/index.js, which are outside the section 5.3 file list.
alternatives: .mjs extensions and no local server. Duplicate escape helpers. Look up events in two places.
why: Node tests need ESM. ES modules need an HTTP origin. Shared escape and a single event registry prevent drift.

date: 2026-08-23
decision: Save key stays helpful.save.v1 even though the title changed.
alternatives: Change the key to match the title.
why: Section 4 names that key. Versioning is the escape hatch, not a rename.

date: 2026-08-23
decision: Added src/sim/draw.js for eligibility and weighted draw.
alternatives: Keep draw logic inside reduce.js.
why: reduce.js was heading past the size line. Draw is a boundary of its own.

date: 2026-08-23
decision: State version is now 2. Added evaluation, notice, and endingId. Events may use requires.turn. Choices may use faith.
alternatives: Keep version 1 and fill missing fields on load. Put faith inside actual.
why: Silent migration is forbidden. Turn windows are how act 1 is scripted. Faith is not a visible stat.

date: 2026-08-23
decision: Act 1 scripts three turns: 0 channel check, 4 evaluation, 11 closer.
alternatives: Pure weighted draw. Flag chains only.
why: The opening, the visible evaluation, and the act boundary must happen every run. Calibration cannot depend on luck.

date: 2026-08-23
decision: Stage 1 implementation stayed on Grok 4.6.
alternatives: Stop and wait for the top reasoning tier. Switch mid-act.
why: Owner said keep going on this model. Switching mid-subsystem is a second Tier 2.
