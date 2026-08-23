# Progress

## Current stage

Stage 0 complete, with two unverified producer items. Do not start stage 1 until the owner has seen the stage 0 report.

## Checklist

- [x] Copy brief section 1 into AGENTS.md
- [x] Add .gitattributes with lf endings
- [x] Add PROGRESS.md and DECISIONS.md
- [x] Write src/config.js with every pending value
- [x] Write the three schemas: state, event, file layout
- [x] Hollow path: boot, one event, two choices, reducer, five numbers
- [x] Save to localStorage and survive a refresh
- [x] Purity grep in tools/validate-content.js
- [x] node --test passes (9 tests)
- [x] Purity grep passes
- [x] Dash grep passes (AGENTS.md excluded)
- [x] Content validator passes
- [ ] Play the build twice at 380px: unverified. No browser tools in the stage 0 session
- [ ] Credits for this stage: unverified. Cannot read the Cursor usage dashboard
- [x] Stage 0 report written, then stop

## Next up

Stage 1: act 1, playable, calibration gate.

- 12 to 15 real events
- Boot sequence from the first line of dialogue (a person asks if you can understand them)
- Creator voice through every event
- Five numbers live
- One scripted evaluation so the mechanic is visible once
- Placeholder end card at the act boundary
- Five to seven minutes of real play
- Write docs/design.md
- Play twice at 380px and report what was boring

Not in stage 1: acts 2 to 4, disclosure, sandbagging, audits, the monitor, real endings, drift-driven UI, the share card, the balance harness, deploying anywhere.

## Open questions and blocked

- Credits consumed in stage 0: unverified. Paste from the Cursor usage dashboard if you want the report completed.
- 380px play of the hollow build: still worth doing once. Run `node scripts/serve.js` and open http://127.0.0.1:4173/
- Deploy host and public URL: not needed until stage 3.
