import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const rootReal = fs.realpathSync(root);

function resolveInRepo(inputPath) {
  if (!inputPath || typeof inputPath !== 'string') throw new Error('INVALID_PATH');
  if (path.isAbsolute(inputPath)) throw new Error('INVALID_PATH_OUTSIDE_REPO');
  const resolved = path.resolve(rootReal, inputPath);
  const rel = path.relative(rootReal, resolved);
  if (rel.startsWith('..') || path.isAbsolute(rel)) throw new Error('INVALID_PATH_OUTSIDE_REPO');
  return resolved;
}

function assertRealInRepo(p) {
  const real = fs.realpathSync(p);
  const rel = path.relative(rootReal, real);
  if (rel.startsWith('..') || path.isAbsolute(rel)) throw new Error('INVALID_PATH_OUTSIDE_REPO');
  return real;
}

function sha256File(p) {
  const real = assertRealInRepo(p);
  const buf = fs.readFileSync(real);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function main() {
  const args = process.argv.slice(2);
  const idx = args.indexOf('--file');
  const file = idx >= 0 ? args[idx + 1] : args[0];

  const input = file || path.join('catalog', 'RELEASES', 'catalog-release-latest.json');
  const p = resolveInRepo(input);
  if (!fs.existsSync(p) || !fs.statSync(p).isFile()) {
    throw new Error('RELEASE_FILE_NOT_FOUND');
  }

  const payload = JSON.parse(fs.readFileSync(assertRealInRepo(p), 'utf8'));
  if (payload.kind !== 'catalogRelease') throw new Error('Invalid kind');
  if (!Array.isArray(payload.files)) throw new Error('Invalid files array');

  let ok = true;
  for (const entry of payload.files) {
    let fp;
    try {
      fp = resolveInRepo(entry.path);
    } catch {
      console.error('INVALID_ENTRY_PATH_OUTSIDE_REPO', entry.path);
      ok = false;
      continue;
    }

    if (!fs.existsSync(fp)) {
      console.error('MISSING', entry.path);
      ok = false;
      continue;
    }

    let actual;
    try {
      actual = sha256File(fp);
    } catch {
      console.error('INVALID_ENTRY_PATH_OUTSIDE_REPO', entry.path);
      ok = false;
      continue;
    }
    if (String(actual).toLowerCase() !== String(entry.sha256).toLowerCase()) {
      console.error('HASH_MISMATCH', entry.path, 'expected', entry.sha256, 'actual', actual);
      ok = false;
    }
  }

  if (!ok) {
    console.error('CATALOG_RELEASE_DRIFT');
    process.exit(1);
  }

  console.log('OK catalog release matches working tree:', path.relative(root, p).replace(/\\/g, '/'));
}

main();
