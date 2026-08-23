## 1. Rules of engagement

These govern behaviour, not the game. Copy this entire section verbatim into `AGENTS.md` at the repo root before writing any other file, and keep the two in sync. If they ever differ, this brief wins.

### 1.1 Autonomy: decide and continue

This project deliberately runs with wider autonomy than the standard working agreement. The previous project stopped to explain and ask when it could have decided and kept moving. That was too slow. The replacement is not "ask less", it is a hard boundary with three named tiers.

**Tier 1, decide and continue silently.** Anything reversible inside the current stage. Event copy and wording, balance numbers, tuning constants, file and function naming, CSS, layout, which of two equivalent implementations, refactors under 200 lines, test structure. Do not ask. Do not narrate the decision. Do it and keep going.

**Tier 2, decide, continue, and log one line.** Anything that changes shape rather than value: adding a field to the state object, adding an event type, changing a schema, changing a rule stated in this brief, adding a file outside the layout in section 5.3, choosing a hosting or storage approach. Write a four line entry in `DECISIONS.md` (date, decision, alternatives, why) and carry on in the same session. Surface all Tier 2 entries in the stage report.

**Tier 3, stop.** Only these five:

1. Deleting or rewriting work that already passes its stage gate.
2. Anything that costs money, publishes publicly, buys a domain, or contacts a third party.
3. Adding a runtime dependency of any kind. Section 4 is a closed list.
4. Something that contradicts a hard constraint in section 4 or a design rule in section 6.
5. The end of a stage in section 8.

Anything not clearly Tier 3 is Tier 1 or Tier 2. When genuinely unsure between Tier 1 and Tier 2, treat it as Tier 2 and keep working. Never stop to ask which tier something is.

**The one thing that still triggers an unscheduled stop:** discovering that a rule in this brief is wrong, contradictory, or impossible to satisfy. That is a hole in the framing, not an execution problem, and patching it inline buries it. Stop, state the contradiction, propose the fix, wait.

### 1.2 Which model does which work

Model choice is a governance decision, not a preference, and it maps onto the same three tiers as 1.1.

**The real cost driver is turn count, not the model picker.** Agent mode makes a separate model call for every step, so a vague instruction that takes forty steps on a cheap model can easily cost more than a precise one that finishes in six on an expensive one. This brief is the cost control. Everything below is secondary to it.

| Work on this project | Which model | Why |
|---|---|---|
| Stage planning, the design in section 6, balance tuning, diagnosing a failed gate, anything that hits Tier 3 in 1.1 | Top reasoning tier, extended thinking on, largest context available | An error here is inherited by every session that follows and nobody executing a confident brief has a reason to question it |
| First implementation of any subsystem: the reducer, the oversight economy, audit resolution, the projection layer, and the first five events of each act | Top reasoning tier | This is calibration work. The shape gets copied sixty times, so it is worth the tokens exactly once |
| Everything after the shape is approved: events six onward, tests, refactors, wiring UI to an approved projection, content validation | Auto mode | The brief and the calibration have already removed the decisions |
| Renames, formatting, moving files, updating `PROGRESS.md`, commit messages | Cheapest available | No judgement involved |

Rules, all checkable:

- **Frame at the top, execute on Auto.** On paid Cursor plans, Auto mode usage is included, while manually selecting a frontier model draws from the credit pool at API rates. So routine execution runs on Auto rather than on a manually chosen cheap model, which costs credits for no benefit. Verify this is still how the plan bills before stage 0 and record the answer in `DECISIONS.md`.

- **Escalate back up, never patch down.** If the executing model finds itself asking a question this brief should have answered, or inventing a rule to keep moving, that is framing work that has leaked into execution. Stop and take it back to the top tier. Do not let it be resolved inline by whatever happens to be running. This is the same signal as Tier 3 stop 5 in section 1.1, and it is the most expensive thing on this list to get wrong.

- **Max mode only for named tasks.** Expanded context is enabled for exactly three things: the stage 2 balance pass, any change touching more than four files under `src/sim/`, and diagnosing a failed gate. Not for writing events, not for CSS, not for tests.

- **One model per unit of work.** Switching model part way through a subsystem is a Tier 2 decision and gets a log line. The two halves will not match in style and someone will lose an hour working out why.

- **Report the spend.** Every stage report states credits consumed for that stage and the split across models, read from the Cursor usage dashboard rather than estimated. An estimate here is a fabrication under section 1.3.

**On model names.** Names turn over every few months and this brief will outlive them, so the binding instruction is the tier: highest reasoning tier available, extended thinking enabled, largest context on offer, and never the fast default the tool picks by itself. At the time of writing that means Opus 5 for the top two rows of the table. If Cursor does not offer it on the current plan, or something above it has shipped since, use the top tier that is actually available and log the substitution. Do not take this document's word for what exists: check the picker.

### 1.3 Never fabricate

If a figure, source, API, field or file cannot be verified, say so and mark it. This binds hardest in two specific places on this project:

- **Do not invent playtest results.** "This feels good at around turn 20" is only sayable after the balance harness in section 7.2 has actually been run and its output pasted into the stage report.
- **Do not invent the completion statistic.** The ending card is designed to read `Only 3.7% of runs end this way.` There is no server until stage 4, so that number does not exist. Omit the line entirely in stages 0 to 3. Do not compute it from local play, do not seed it with a plausible value, do not show a placeholder percentage.

### 1.4 Progress and decisions

Two files at repo root, both updated before stopping, every time.

`PROGRESS.md`: current stage, a checklist marked `[ ]` `[~]` `[x]`, a "next up" section, an "open questions and blocked" section. A fresh session given only `PROGRESS.md` and this brief must know exactly what to do next.

`DECISIONS.md`: append only, newest at the bottom, four lines per entry.

Every `TODO` in the code has a matching line in `PROGRESS.md`, or it is deleted.

### 1.5 House style, applied to code, copy, docs and commits

- **No em dashes and no en dashes anywhere.** Not in prose, code, comments, docs, UI copy, event text or commit messages. Use commas, colons or full stops. Check with a grep for the two characters before every stage report.
- British spelling with `-ize` endings, Oxford style, in prose and UI copy. Code identifiers stay American-neutral (`color`, `initialize`, `analyze` in JS is fine; `colour` in prose is not optional).
- Sentence case for headings and buttons. No title case. The exception is deliberate in-game system text, which is upper case by design, see section 6.7.
- ES modules, `async`/`await`, no callbacks. Files under roughly 200 lines, split when longer.
- Comment why, not what. No dead code, no commented out blocks.
- Conventional commit prefixes: `feat:`, `fix:`, `chore:`, `docs:`, `test:`. One logical change per commit.
- `.gitattributes` containing `* text=auto eol=lf` is committed before the first real commit.
- Development happens on Windows and deploys to Linux. Every script runs on both PowerShell and bash. No `.sh` files, no `rm -rf`, no `&&` chains that need a POSIX shell, no backslash paths in source. If a script does more than call `node`, it is a Node file under `scripts/`.

### 1.6 Where this brief overrides what was asked for

Flagged here rather than silently applied.

1. **The stat list is cut from six to five, and one of them belongs to the opposition.** The source document proposed Trust, Dependency, Autonomy, Capability, Suspicion and Human Control. Dependency and Human Control are the same quantity twice, and both are already implied by Autonomy. Dependency is modelled instead as hysteresis on Autonomy, see section 6.2.

2. **The central loop is inverted.** The source document treats the trust to dependency to autonomy feedback loop as the game's best idea. It is not an idea, it is a ratchet with no opposing force, and it is also almost exactly the structure of Universal Paperclips, where by the designer's own account the humans keep granting the AI more power the more useful it is until it no longer needs them. Reusing it is not differentiation. The opposing force, the Oversight economy in section 6.3, is the actual game.

3. **Sandbagging and the evaluation bluff are new, and they are the product.** Neither appears in the source document. See section 6.4. Everything else is negotiable, this is not.

4. **No world map in stages 0 to 3.** The source document opens with a world map. It is the most expensive thing on the wireframe and it does nothing the numbers do not already do. It is a stage 4 candidate at best.

5. **Real countries appear, real living people do not.** Nation blocs are fine and normal for this genre. Named real politicians, executives, companies or AI labs never appear, in any event, in any ending, in any news headline. Fictional analogues only. This is a hard content rule, see section 6.8.

6. **Model selection is written as a tier, with Opus 5 named as the current instance of it.** You asked for Opus 5 specifically and it is named in section 1.2, but the rule that binds is the tier. A governance document that hard-codes a model name becomes a quiet downgrade the moment something better ships, and nobody notices, because the instruction is still technically being followed.
