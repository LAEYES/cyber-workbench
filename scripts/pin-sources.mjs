import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import crypto from 'node:crypto';
import YAML from 'yaml';

const root = process.cwd();
const sourcesPath = path.join(root, 'catalog', 'sources.yml');

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'cyber-workbench' } }, res => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetch(res.headers.location));
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }
        const chunks = [];
        res.on('data', d => chunks.push(d));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

function walk(obj, prefix = []) {
  const out = [];
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      out.push(...walk(v, [...prefix, k]));
    }
    if (Object.prototype.hasOwnProperty.call(obj, 'url')) {
      out.push({ path: prefix.join('.'), node: obj });
    }
  }
  return out;
}

async function main() {
  console.log('[sources] pin');
  const txt = fs.readFileSync(sourcesPath, 'utf8');
  const doc = YAML.parse(txt);
  const leaves = walk(doc, []);

  for (const leaf of leaves) {
    const { path: p, node } = leaf;
    if (node.allowDynamic === true) {
      console.log('SKIP dynamic:', p);
      continue;
    }
    const url = node.url;
    if (!url) continue;

    console.log('FETCH', p);
    const buf = await fetch(url);
    node.sha256 = sha256(buf);
    node.retrievedAt = new Date().toISOString();
  }

  const out = YAML.stringify(doc);
  fs.writeFileSync(sourcesPath, out, 'utf8');
  console.log('DONE');
}

main().catch(err => {
  console.error('PIN_FAILED', err?.message || err);
  process.exit(1);
});
