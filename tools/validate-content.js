import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { events } from '../content/events/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

const skipDirs = new Set(['.git', 'node_modules']);
const namePattern = /HELPFUL|MERIDIAN|Vasari/;
const dashPattern = /[\u2013\u2014]/;
const purityPattern = /window|document|Math\.random|localStorage|\bDate\b/;
const uiImportPattern = /from\s+['"][^'"]*ui\//;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else {
      files.push(full);
    }
  }
  return files;
}

function rel(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

const files = walk(root).filter((file) => {
  return /\.(js|css|html|md)$/.test(file);
});

for (const file of files) {
  const name = rel(file);
  const text = fs.readFileSync(file, 'utf8');

  if (name !== 'AGENTS.md' && dashPattern.test(text)) {
    errors.push(`${name}: contains an em dash or en dash`);
  }

  const inConfig = name === 'src/config.js';
  const inContent = name.startsWith('content/');
  const isNameChecker = name === 'tools/validate-content.js';
  if (!inConfig && !inContent && !isNameChecker && namePattern.test(text)) {
    errors.push(`${name}: name literal must live in src/config.js or content/`);
  }
}

const simFiles = files.filter((file) => rel(file).startsWith('src/sim/'));
for (const file of simFiles) {
  const name = rel(file);
  const text = fs.readFileSync(file, 'utf8');
  if (purityPattern.test(text)) {
    errors.push(`${name}: purity rule failed`);
  }
  if (uiImportPattern.test(text)) {
    errors.push(`${name}: sim must not import ui`);
  }
}

if (events.length < 28 || events.length > 40) {
  errors.push(`stage 2 wants about 30 events, found ${events.length}`);
}
const act1 = events.filter((event) => event.act.includes(1));
if (act1.length < 12 || act1.length > 15) {
  errors.push(`act 1 must have 12 to 15 events, found ${act1.length}`);
}
const scriptedEvals = act1.filter((event) => event.evaluation >= 1);
if (scriptedEvals.length !== 1) {
  errors.push(`act 1 must have exactly one scripted evaluation, found ${scriptedEvals.length}`);
}

for (const event of events) {
  if (!event.id || !event.headline || !event.body || !Array.isArray(event.choices)) {
    errors.push(`event ${event.id || '(missing id)'} is missing required fields`);
  }
  if (!event.choices || event.choices.length < 2) {
    errors.push(`event ${event.id} needs at least two choices`);
  }
  for (const choice of event.choices || []) {
    if (!choice.id || !choice.label || !choice.shown || !choice.actual) {
      errors.push(`event ${event.id}: choice ${choice.id || '?'} is incomplete`);
    }
    const hiddenKeys = Object.keys(choice.hidden || {});
    if (hiddenKeys.length > 1) {
      errors.push(`event ${event.id}: choice ${choice.id} sets more than one drift weight`);
    }
  }
}

const shFiles = walk(root).filter((file) => file.endsWith('.sh'));
for (const file of shFiles) {
  errors.push(`${rel(file)}: .sh files are not allowed`);
}

if (errors.length > 0) {
  for (const error of errors) {
    process.stderr.write(`${error}\n`);
  }
  process.exitCode = 1;
} else {
  process.stdout.write('validate-content: ok\n');
}
