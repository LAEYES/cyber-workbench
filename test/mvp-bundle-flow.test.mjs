import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

function run(args, cwd) {
  return execFileSync(process.execPath, ['dist/cli.js', ...args], { cwd, encoding: 'utf8' });
}

test('MVP bundle export/verify flow works', () => {
  const cwd = process.cwd();
  // ensure build exists
  assert.ok(fs.existsSync(path.join(cwd, 'dist', 'cli.js')));

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cyberwb-test-'));
  const base = path.join(tmp, 'deliverables');
  const org = 'TESTORG';

  // init store data via CLI
  const riskId = 'R-TEST-1';
  const actor = 'alice';
  run(['nato:mvp-risk-create', '--out', base, '--org', org, '--actor', actor, '--risk-id', riskId, '--title', 't', '--owner', 'bob', '--likelihood', '3', '--impact', '4', '--due', '2026-12-31'], cwd);

  run(['nato:mvp-decision-create', '--out', base, '--org', org, '--actor', actor, '--risk-id', riskId, '--type', 'accept', '--rationale', 'ok', '--approved-by', 'ciso', '--expiry', '2026-12-31'], cwd);

  // export bundle from store
  const out = run(['nato:mvp-export-from-store', '--store', base, '--out', base, '--org', org, '--actor', actor, '--scope', `risk:${riskId}`], cwd);
  assert.match(out, /OK/);

  const producedRoot = path.join(base, 'nato-mvp');
  assert.ok(fs.existsSync(producedRoot));

  const entries = fs
    .readdirSync(producedRoot, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => path.join(producedRoot, d.name))
    .filter(p => fs.existsSync(path.join(p, 'manifest.json')));

  assert.ok(entries.length >= 1, 'No bundle directory with manifest.json found');

  // Pick the most recent bundle directory
  const bundleDir = entries
    .map(p => ({ p, mtime: fs.statSync(p).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0].p;

  // verify manifest and bundle hashes
  run(['nato:mvp-verify-manifest', '--bundle', bundleDir], cwd);
  const manifestPath = path.join(bundleDir, 'manifest.json');
  run(['nato:mvp-verify-bundle', '--manifest', manifestPath], cwd);
});
