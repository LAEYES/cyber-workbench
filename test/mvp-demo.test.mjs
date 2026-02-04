import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';

function run(args, cwd) {
  return execFileSync(process.execPath, ['dist/cli.js', ...args], { cwd, encoding: 'utf8' });
}

test('nato:mvp-demo runs end-to-end', async () => {
  const repo = path.resolve('.');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cyberwb-demo-'));

  const out = run(['nato:mvp-demo', '--out', path.join(tmp, 'deliverables'), '--org', 'ORG_TEST', '--actor', 'tester', '--sign'], repo);
  assert.match(out, /DEMO_OK/);
});
