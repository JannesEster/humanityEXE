import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

if (fs.existsSync(dist)) {
  fs.rmSync(dist, { recursive: true, force: true });
}
fs.mkdirSync(dist);

const files = ['index.html', 'style.css', '.nojekyll'];
for (const name of files) {
  fs.copyFileSync(path.join(root, name), path.join(dist, name));
}

copyTree(path.join(root, 'src'), path.join(dist, 'src'));
copyTree(path.join(root, 'content'), path.join(dist, 'content'));

process.stdout.write(`packed ${countFiles(dist)} files into dist/\n`);

function copyTree(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const source = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyTree(source, dest);
    else fs.copyFileSync(source, dest);
  }
}

function countFiles(dir) {
  let total = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) total += countFiles(full);
    else total += 1;
  }
  return total;
}
