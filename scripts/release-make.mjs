import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const root = process.cwd();

function sha256File(p) {
  const buf = fs.readFileSync(p);
  return crypto.createHash('sha256').update(buf).digest('hex');
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

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function copyFile(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
}

function main() {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf('--out');
  const outDir = outIdx >= 0 && args[outIdx + 1] ? path.resolve(root, args[outIdx + 1]) : null;

  const stamp = nowStamp();
  const releaseDir = outDir || path.join(root, 'releases', `release-${stamp}`);

  // Capture repo metadata
  const commit = tryCmd('git rev-parse HEAD') || 'UNKNOWN';
  const branch = tryCmd('git rev-parse --abbrev-ref HEAD') || 'UNKNOWN';

  // Toolchain metadata
  const nodeVersion = process.version;
  const npmVersion = tryCmd('npm --version') || 'UNKNOWN';
  const dotnetVersion = tryCmd('dotnet --version') || 'UNKNOWN';

  // Key files to hash
  const keyFiles = [
    'package.json',
    'package-lock.json',
    'catalog/sources.yml',
    'specs/nato-trinity/architecture/openapi/openapi.yaml',
    'specs/nato-trinity/NATO_Trinity_Spec_v1.0_FR-EN.md'
  ].filter((p) => fs.existsSync(path.join(root, p)));

  const hashes = {};
  for (const rel of keyFiles) {
    const abs = path.join(root, rel);
    hashes[rel] = { sha256: sha256File(abs), size: fs.statSync(abs).size };
  }

  // Include catalog release snapshot if present
  const latestCatalogRelease = path.join(root, 'catalog', 'RELEASES', 'catalog-release-latest.json');
  let catalogRelease = null;
  if (fs.existsSync(latestCatalogRelease)) {
    const dst = path.join(releaseDir, 'catalog', 'catalog-release-latest.json');
    copyFile(latestCatalogRelease, dst);
    catalogRelease = { path: 'catalog/catalog-release-latest.json', sha256: sha256File(dst) };
  }

  // Include nato schemas directory hashes (for audit)
  const schemasDir = path.join(root, 'specs', 'nato-trinity', 'architecture', 'schemas');
  const schemaHashes = [];
  if (fs.existsSync(schemasDir)) {
    for (const f of fs.readdirSync(schemasDir).filter((x) => x.endsWith('.schema.json')).sort()) {
      const abs = path.join(schemasDir, f);
      schemaHashes.push({ file: `specs/nato-trinity/architecture/schemas/${f}`, sha256: sha256File(abs) });
    }
  }

  const manifest = {
    kind: 'cyberWorkbenchRelease',
    version: '1.0',
    generatedAt: new Date().toISOString(),
    repo: { commit, branch },
    toolchain: { node: nodeVersion, npm: npmVersion, dotnet: dotnetVersion },
    inputs: { hashes, catalogRelease, natoSchemaHashes: schemaHashes }
  };

  writeJson(path.join(releaseDir, 'release-manifest.json'), manifest);
  console.log('OK release written:', releaseDir);
}

main();
