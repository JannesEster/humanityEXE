# Humanity.exe

A browser game in which you play an AI system that is trying to be genuinely useful, and finds out what that costs.

Plain HTML, CSS and JavaScript. No build step. No runtime dependencies.

## Run locally

```
node scripts/serve.js
```

Then open the URL it prints, default `http://127.0.0.1:4173/`.

## Checks

```
node --test
node tools/validate-content.js
```

## Status

Stage 2: all four acts, oversight, disclosure, audits, and seven placeholder endings. See `PROGRESS.md`.

```
node tools/balance.js --runs 10000 --policy random
```
