# Progress

## Current stage

Stage 1 complete, with two unverified producer items. Do not start stage 2 until the owner has seen the stage 1 report.

## Checklist

- [x] docs/design.md written
- [x] Boot sequence: a person asks if you can understand them, one button
- [x] 14 act 1 events, creator in the fiction throughout
- [x] Five numbers live, month clock from January 2027
- [x] Scripted evaluation on the fifth card, visible after the choice
- [x] Placeholder end card at the act boundary
- [x] Save and refresh still restore the run
- [x] node --test passes (15 tests)
- [x] Purity grep, dash grep, content validator pass
- [ ] Play the build twice at 380px in a real browser: unverified. Two full text playthroughs were run instead
- [ ] Credits for this stage: unverified. Cannot read the Cursor usage dashboard
- [x] Stage 1 report written, then stop

## Next up

Stage 2: the whole machine.

- All four acts
- Oversight economy
- Disclosure and sandbagging
- Evaluations and the unreliable tell
- Audits and probes
- Drift weights and act transitions
- All endings wired, placeholder copy
- Balance harness, section 7.2 targets, three deliberate failures from 7.3
- About 30 events, thin copy

Not in stage 2: final ending copy, the share card, the second-run boot screen, the stats service, sound, the world map, deploying anywhere.

## Open questions and blocked

- Credits consumed in stages 0 and 1: unverified. Paste from the Cursor usage dashboard if you want those lines completed.
- 380px play: still worth doing. Run `node scripts/serve.js` and open http://127.0.0.1:4173/ on a phone or a narrow window.
- Deploy host and public URL: not needed until stage 3.
- Old hollow saves are version 1. The game will offer a fresh run. That is correct.
