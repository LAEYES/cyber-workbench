import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const root = process.cwd();

function sha256File(p) {
  const buf = fs.readFileSync(p);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function listFiles(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...listFiles(p));
    else out.push(p);
  }
  return out;
}

function tryCmd(cmd) {
  try {
    return execSync(cmd, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}_${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function parseOutPath() {
  const args = process.argv.slice(2);
  const idx = args.indexOf('--out');
  if (idx >= 0 && args[idx + 1]) return path.resolve(root, args[idx + 1]);
  return null;
}

function main() {
  const catalogRoot = path.join(root, 'catalog');
  const releasesDir = path.join(catalogRoot, 'RELEASES');
  fs.mkdirSync(releasesDir, { recursive: true });

  const stamp = nowStamp();
  const outPath = parseOutPath() || path.join(releasesDir, `catalog-release-${stamp}.json`);
  const latestPath = path.join(releasesDir, 'catalog-release-latest.json');

  const commit = tryCmd('git rev-parse HEAD');
  const branch = tryCmd('git rev-parse --abbrev-ref HEAD');

  const files = listFiles(catalogRoot)
    .filter((p) => !p.includes(path.sep + 'RELEASES' + path.sep))
    .filter((p) => !p.endsWith('.md'));

  const entries = files
    .map((p) => {
      const rel = path.relative(root, p).replace(/\\/g, '/');
      const stat = fs.statSync(p);
      return {
        path: rel,
        size: stat.size,
        sha256: sha256File(p),
      };
    })
    .sort((a, b) => a.path.localeCompare(b.path, 'en'));

  const payload = {
    kind: 'catalogRelease',
    version: '1.0',
    generatedAt: new Date().toISOString(),
    repo: {
      commit: commit || 'UNKNOWN',
      branch: branch || 'UNKNOWN',
    },
    catalogRoot: 'catalog',
    files: entries,
    notes: {
      guidance: [
        'This file captures a reproducible snapshot of the catalog inputs (hashes).',
        'Use scripts/pin-sources.mjs before creating a release if sources.yml changed.',
      ],
    },
  };

  const json = JSON.stringify(payload, null, 2) + '\n';
  fs.writeFileSync(outPath, json, 'utf8');
  // also update a stable "latest" snapshot for tooling/CI
  fs.writeFileSync(latestPath, json, 'utf8');
  console.log('OK catalog release written:', outPath);
  console.log('OK catalog release latest:', latestPath);
}

main();
