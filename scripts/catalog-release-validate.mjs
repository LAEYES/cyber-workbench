import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();

function sha256File(p) {
  const buf = fs.readFileSync(p);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function main() {
  const args = process.argv.slice(2);
  const idx = args.indexOf('--file');
  const file = idx >= 0 ? args[idx + 1] : args[0];
  if (!file) {
    console.error('USAGE: node scripts/catalog-release-validate.mjs --file <catalog-release.json>');
    process.exit(2);
  }

  const p = path.resolve(root, file);
  const rel = path.relative(root, p);
  if (path.isAbsolute(file) || rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error('INVALID_PATH_OUTSIDE_REPO');
  }
  if (!fs.existsSync(p) || !fs.statSync(p).isFile()) {
    throw new Error('RELEASE_FILE_NOT_FOUND');
  }
  const payload = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (payload.kind !== 'catalogRelease') throw new Error('Invalid kind');
  if (!Array.isArray(payload.files)) throw new Error('Invalid files array');

  let ok = true;
  for (const entry of payload.files) {
    const fp = path.resolve(root, entry.path);
    const fpRel = path.relative(root, fp);
    if (fpRel.startsWith('..') || path.isAbsolute(fpRel)) {
      console.error('INVALID_ENTRY_PATH_OUTSIDE_REPO', entry.path);
      ok = false;
      continue;
    }
    if (!fs.existsSync(fp)) {
      console.error('MISSING', entry.path);
      ok = false;
      continue;
    }
    const actual = sha256File(fp);
    if (String(actual).toLowerCase() !== String(entry.sha256).toLowerCase()) {
      console.error('HASH_MISMATCH', entry.path, 'expected', entry.sha256, 'actual', actual);
      ok = false;
    }
  }

  if (!ok) {
    console.error('VALIDATION_FAILED');
    process.exit(1);
  }
  console.log('OK catalog release validated:', file);
}

main();
