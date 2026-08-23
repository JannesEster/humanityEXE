# Progress

## Current stage

Stage 3 complete, with two unverified producer items. Do not start stage 4 until the owner has seen the stage 3 report.

## Checklist

- [x] About 70 events across the acts (71: 14 / 32 / 25)
- [x] Final ending copy, seven endings, no completion percentage
- [x] Drift-driven language bank, three levels
- [x] CSS drift: tracking and foreground white
- [x] Dead decline controls, greyed, labelled (not applicable)
- [x] Second-run boot, keyed off finishedRuns in the same save
- [x] Share card as plain text plus emoji grid, clipboard only
- [x] Replay string in the URL fragment, seed plus inputs
- [x] Deploy host and public URL written in src/config.js
- [x] node --test passes (32 tests)
- [x] Purity grep, dash grep, content validator pass
- [x] Random 10000 still inside the old 7.2 bands, never-fired zero
- [ ] Play twice at 380px in a real browser: unverified. Three full text playthroughs were run instead
- [ ] Credits for this stage: unverified. Cannot read the Cursor usage dashboard
- [x] Stage 3 report written, then stop

## Next up

Stage 4: the stats service, and only then. Second repo. Node and Postgres. One write, one read. The game must work with the service down. Only then may the ending card show a real percentage.

Not in stage 4: leaderboards, accounts, comments, a replay gallery, achievements.

## Open questions and blocked

- Credits for stages 0 to 3: unverified. Paste from the Cursor usage dashboard if you want those lines completed.
- 380px play: still worth doing. Open the public URL on a phone, or run `node scripts/serve.js` and open http://127.0.0.1:4173/
- Saves are version 3. Older saves offer a fresh run. A finished v3 save now also carries finishedRuns.
