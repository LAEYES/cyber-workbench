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
  const dirIdx = args.indexOf('--dir');
  const releaseDir = dirIdx >= 0 && args[dirIdx + 1] ? path.resolve(root, args[dirIdx + 1]) : null;
  if (!releaseDir) {
    console.error('USAGE: node scripts/release-verify.mjs --dir <releases/release-...>');
    process.exit(2);
  }

  let dir = releaseDir;
  if (String(dir).includes('*')) {
    const parent = path.dirname(dir);
    const pattern = path.basename(dir).replace(/\./g, '\\.').replace(/\*/g, '.*');
    const re = new RegExp(`^${pattern}$`);
    const matches = fs
      .readdirSync(parent, { withFileTypes: true })
      .filter((e) => e.isDirectory() && re.test(e.name))
      .map((e) => path.join(parent, e.name));
    if (matches.length === 0) throw new Error(`No release dirs match: ${dir}`);
    matches.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
    dir = matches[0];
  }

  const mfPath = path.join(dir, 'release-manifest.json');
  if (!fs.existsSync(mfPath)) throw new Error(`release-manifest.json not found in ${dir}`);

  const mf = JSON.parse(fs.readFileSync(mfPath, 'utf8'));
  if (mf.kind !== 'cyberWorkbenchRelease') throw new Error('Invalid manifest kind');

  let ok = true;

  // Verify hashed inputs still match working tree
  const hashes = mf.inputs?.hashes || {};
  for (const rel of Object.keys(hashes)) {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) {
      console.error('MISSING_INPUT', rel);
      ok = false;
      continue;
    }
    const actual = sha256File(abs);
    if (String(actual).toLowerCase() !== String(hashes[rel].sha256).toLowerCase()) {
      console.error('HASH_MISMATCH', rel, 'expected', hashes[rel].sha256, 'actual', actual);
      ok = false;
    }
  }

  // Verify embedded catalog snapshot hash
  const cr = mf.inputs?.catalogRelease;
  if (cr?.path) {
    const abs = path.join(dir, cr.path);
    if (!fs.existsSync(abs)) {
      console.error('MISSING_RELEASE_FILE', cr.path);
      ok = false;
    } else {
      const actual = sha256File(abs);
      if (String(actual).toLowerCase() !== String(cr.sha256).toLowerCase()) {
        console.error('RELEASE_FILE_HASH_MISMATCH', cr.path);
        ok = false;
      }
    }
  }

  if (!ok) {
    console.error('RELEASE_VERIFY_FAILED');
    process.exit(1);
  }
  console.log('OK release verify');
}

main();
