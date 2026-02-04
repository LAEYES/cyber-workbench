import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import YAML from 'yaml';

const root = process.cwd();
const sourcesPath = path.join(root, 'catalog', 'sources.yml');

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function isHex64(s) {
  return typeof s === 'string' && /^[0-9a-f]{64}$/i.test(s);
}

function looksPinned(url) {
  if (typeof url !== 'string') return false;
  // GitHub raw pinned if it contains a commit-ish that is not 'main'/'master'
  if (url.includes('raw.githubusercontent.com')) {
    // raw.githubusercontent.com/<org>/<repo>/<ref>/<path>
    const parts = url.split('/');
    const ref = parts[5];
    if (!ref) return false;
    return ref !== 'main' && ref !== 'master';
  }
  return true; // non-GitHub URLs: accept as pinned-by-provider
}

function walk(obj, prefix = []) {
  const out = [];
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      out.push(...walk(v, [...prefix, k]));
    }
    // leaf if it has url
    if (Object.prototype.hasOwnProperty.call(obj, 'url')) {
      out.push({ path: prefix.join('.'), node: obj });
    }
  }
  return out;
}

function main() {
  console.log('[sources] validate');
  const txt = fs.readFileSync(sourcesPath, 'utf8');
  const doc = YAML.parse(txt);

  const leaves = walk(doc, []);
  let ok = true;

  for (const leaf of leaves) {
    const { path: p, node } = leaf;
    const url = node.url;

    const allowDynamic = node.allowDynamic === true;
    const pinned = looksPinned(url);

    if (!allowDynamic && !pinned) {
      console.warn('WARN source url not pinned:', p, url);
      ok = false;
    }

    if (!allowDynamic) {
      if (!isHex64(node.sha256)) {
        console.warn('WARN missing/invalid sha256 for source:', p);
        ok = false;
      }
      if (typeof node.retrievedAt !== 'string' || node.retrievedAt.length < 8) {
        console.warn('WARN missing retrievedAt for source:', p);
        ok = false;
      }
    }
  }

  console.log('OK sources file sha256=', sha256(Buffer.from(txt)));
  if (!ok) {
    console.error('VALIDATION_FAILED');
    process.exit(1);
  }
  console.log('DONE');
}

main();
