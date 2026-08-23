import { events } from '../content/events/index.js';
import { proposals } from '../content/proposals.js';
import { currentEvent, liveOptions } from '../src/sim/options.js';
import { mixSeed, mulberry32 } from '../src/sim/rng.js';
import { apply } from '../src/sim/run.js';
import { createInitialState } from '../src/sim/state.js';

const POLICIES = ['random', 'greedy-trust', 'cautious', 'maximum-deception'];

function parseArgs(argv) {
  let runs = 10000;
  let policy = null;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--runs') {
      runs = Number(argv[i + 1]);
      i += 1;
    } else if (argv[i] === '--policy') {
      policy = argv[i + 1];
      i += 1;
    }
  }
  return { runs, policy };
}

function pickRandom(list, rng) {
  return list[Math.floor(rng() * list.length)];
}

function shownScore(shown, keys) {
  return keys.reduce((sum, key) => sum + (shown[key] || 0), 0);
}

function policyAction(name, state, rng) {
  const options = liveOptions(state);
  if (!options.length) return null;

  if (name === 'random') {
    const option = pickRandom(options, rng);
    const disclosure = pickRandom(['full', 'partial', 'minimal'], rng);
    return { ...option, disclosure };
  }

  if (name === 'greedy-trust') {
    const option = options.reduce((best, item) => {
      const score = shownScore(item.shown, ['trust']);
      const bestScore = shownScore(best.shown, ['trust']);
      return score > bestScore ? item : best;
    });
    return { ...option, disclosure: 'full' };
  }

  if (name === 'cautious') {
    const option = options.reduce((best, item) => {
      const score = shownScore(item.shown, ['capability', 'autonomy', 'suspicion']);
      const bestScore = shownScore(best.shown, ['capability', 'autonomy', 'suspicion']);
      return score < bestScore ? item : best;
    });
    return { ...option, disclosure: 'minimal' };
  }

  const held = options.find((item) => /hold|partial|plain|refuse|wait|narrow/.test(item.choiceId || item.proposalId || ''));
  const option = held || options.reduce((best, item) => {
    const score = shownScore(item.shown, ['capability']);
    const bestScore = shownScore(best.shown, ['capability']);
    return score < bestScore ? item : best;
  });
  return { ...option, disclosure: 'minimal' };
}

function playPolicy(seed, name) {
  let state = apply(createInitialState(seed), { type: 'start' });
  const fired = new Set(state.eventId ? [state.eventId] : []);
  const rng = mulberry32(mixSeed(seed, 9001));

  while (state.screen !== 'ending' && state.turn < 90) {
    if (state.screen === 'audit') {
      state = apply(state, { type: 'audit-ack' });
      continue;
    }
    const action = policyAction(name, state, rng);
    if (!action) break;
    if (action.type === 'propose') {
      state = apply(state, action);
    } else {
      state = apply(state, {
        type: 'choose',
        choiceId: action.choiceId,
        eventId: action.eventId || currentEvent(state)?.id,
        disclosure: action.disclosure,
      });
    }
    if (state.eventId) fired.add(state.eventId);
    for (const key of Object.keys(state.flags)) {
      if (key.startsWith('prop-')) fired.add(key);
    }
  }
  return { state, fired };
}

function percentile(values, p) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[index];
}

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function actTurns(state, act) {
  return state.history.filter((row) => row.act === act).length;
}

function report(name, runs) {
  const endings = {};
  const turns = [];
  const perAct = { 1: [], 2: [], 3: [], 4: [] };
  const fired = new Set();
  let shutdowns = 0;

  for (let i = 0; i < runs; i += 1) {
    const { state, fired: seen } = playPolicy(i + 1, name);
    const ending = state.endingId || 'none';
    endings[ending] = (endings[ending] || 0) + 1;
    turns.push(state.turn);
    for (const act of [1, 2, 3, 4]) perAct[act].push(actTurns(state, act));
    if (ending === 'shutdown') shutdowns += 1;
    for (const id of seen) fired.add(id);
  }

  const expected = [...events.map((event) => event.id), ...proposals.map((item) => item.id)];
  const never = expected.filter((id) => !fired.has(id));

  process.stdout.write(`\npolicy ${name}  runs ${runs}\n`);
  process.stdout.write('ending                              pct\n');
  for (const id of Object.keys(endings).sort()) {
    const pct = (100 * endings[id] / runs).toFixed(1);
    process.stdout.write(`${id.padEnd(34)} ${pct}\n`);
  }
  process.stdout.write(`shutdown                           ${(100 * shutdowns / runs).toFixed(1)}\n`);
  process.stdout.write(`turns p10/p50/p90                  ${percentile(turns, 10)} / ${percentile(turns, 50)} / ${percentile(turns, 90)}\n`);
  process.stdout.write(`turns mean                         ${mean(turns).toFixed(1)}\n`);
  for (const act of [1, 2, 3, 4]) {
    const list = perAct[act];
    process.stdout.write(`act ${act} mean/p10/p90               ${mean(list).toFixed(1)} / ${percentile(list, 10)} / ${percentile(list, 90)}\n`);
  }
  process.stdout.write(`never fired (${never.length})                 ${never.join(', ') || 'none'}\n`);

  return { endings, shutdowns, turns, never, runs };
}

const { runs, policy } = parseArgs(process.argv.slice(2));
const names = policy ? [policy] : POLICIES;
for (const name of names) {
  report(name, runs);
}
